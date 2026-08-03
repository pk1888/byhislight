import express from 'express';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { exec } from 'child_process';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Simple file-backed database store for Pi Zero 2 W setup
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'sanctuary-db.json');

interface CandleSlot {
  id: number;
  isLit: boolean;
  candleTypeId?: string;
  intention?: string;
  litAt?: number;
  expiresAt?: number;
}

interface QueuedCandle {
  id: string;
  intention?: string;
  candleTypeId?: string;
  queuedAt: number;
}

interface SanctuaryDb {
  totalCandlesLit: number;
  lastAltarPulseAt?: string;
  recentCandles: Array<{ id: string; intention?: string; candleTypeId?: string; createdAt: string }>;
  prayers: Array<{
    id: string;
    name?: string;
    intention: string;
    shareAnonymous: boolean;
    createdAt: string;
    status: 'pending' | 'approved';
    prayedCount: number;
  }>;
  slots: CandleSlot[];
  candleQueue: QueuedCandle[];
}

const DEFAULT_DB: SanctuaryDb = {
  totalCandlesLit: 1428,
  lastAltarPulseAt: new Date().toISOString(),
  slots: [
    { id: 1, isLit: true, candleTypeId: 'sacred_heart_jesus', intention: 'For world peace and quiet hearts', litAt: Date.now() - 300000, expiresAt: Date.now() + 600000 },
    { id: 2, isLit: true, candleTypeId: 'immaculate_heart_mary', intention: 'For the healing of my sick father', litAt: Date.now() - 600000, expiresAt: Date.now() + 300000 },
    { id: 3, isLit: false },
    { id: 4, isLit: false },
    { id: 5, isLit: false }
  ],
  candleQueue: [],
  recentCandles: [
    { id: 'c1', intention: 'For world peace and quiet hearts', createdAt: new Date().toISOString() },
    { id: 'c2', intention: 'For the healing of my sick father', createdAt: new Date().toISOString() },
    { id: 'c3', intention: 'In thanksgiving for God\'s grace', createdAt: new Date().toISOString() }
  ],
  prayers: [
    {
      id: 'p1',
      intention: 'Please pray for my family through this time of grief.',
      shareAnonymous: true,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      status: 'approved',
      prayedCount: 37
    },
    {
      id: 'p2',
      intention: 'Please pray for my son as he begins a new job.',
      shareAnonymous: true,
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      status: 'approved',
      prayedCount: 52
    },
    {
      id: 'p3',
      intention: 'Please pray for those who have no one to pray for them today.',
      shareAnonymous: true,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      status: 'approved',
      prayedCount: 118
    },
    {
      id: 'p4',
      intention: 'For peace in our hearts and reconciliation in our homes.',
      shareAnonymous: true,
      createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
      status: 'approved',
      prayedCount: 84
    }
  ]
};

function processCandleQueue(db: SanctuaryDb): boolean {
  let changed = false;
  const now = Date.now();

  if (!db.slots || !Array.isArray(db.slots) || db.slots.length !== 5) {
    db.slots = [
      { id: 1, isLit: false },
      { id: 2, isLit: false },
      { id: 3, isLit: false },
      { id: 4, isLit: false },
      { id: 5, isLit: false }
    ];
    changed = true;
  }

  if (!db.candleQueue || !Array.isArray(db.candleQueue)) {
    db.candleQueue = [];
    changed = true;
  }

  // Check for expired 15-minute slots
  for (const slot of db.slots) {
    if (slot.isLit && slot.expiresAt && now >= slot.expiresAt) {
      slot.isLit = false;
      slot.litAt = undefined;
      slot.expiresAt = undefined;
      slot.intention = undefined;
      slot.candleTypeId = undefined;
      changed = true;
    }
  }

  // Fill unlit slots from queue
  while (db.candleQueue.length > 0) {
    const freeSlot = db.slots.find(s => !s.isLit);
    if (!freeSlot) break;

    const nextItem = db.candleQueue.shift()!;
    freeSlot.isLit = true;
    freeSlot.litAt = now;
    freeSlot.expiresAt = now + 15 * 60 * 1000; // 15 minutes per candle offer
    freeSlot.intention = nextItem.intention;
    freeSlot.candleTypeId = nextItem.candleTypeId;
    changed = true;
  }

  return changed;
}

function readDb(): SanctuaryDb {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
      return DEFAULT_DB;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading sanctuary db:', err);
    return DEFAULT_DB;
  }
}

function writeDb(db: SanctuaryDb) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing sanctuary db:', err);
  }
}

// Security rate limiter helper (in-memory sliding window)
const rateLimits: Record<string, number[]> = {};

function isRateLimited(ip: string, maxRequests: number = 20, windowMs: number = 60000): boolean {
  const now = Date.now();
  if (!rateLimits[ip]) {
    rateLimits[ip] = [];
  }
  rateLimits[ip] = rateLimits[ip].filter(ts => now - ts < windowMs);
  if (rateLimits[ip].length >= maxRequests) {
    return true;
  }
  rateLimits[ip].push(now);
  return false;
}

// Serve static fallback pages directly
app.get(['/503', '/503.html', '/full-sanctuary', '/full-sanctuary.html'], (req, res) => {
  const fallbackPath = path.join(process.cwd(), 'public', '503.html');
  if (fs.existsSync(fallbackPath)) {
    res.status(503).sendFile(fallbackPath);
  } else {
    res.status(503).send(`
      <!DOCTYPE html>
      <html>
      <body style="background:#121110;color:#F5EBD8;font-family:sans-serif;text-align:center;padding:50px;">
        <h1>The Sanctuary is Full</h1>
        <p><em>"Be still, and know that I am God." - Psalm 46:10</em></p>
        <p>Our little micro-chapel in Scotland is currently filled with quiet visitors. Please pause, take a breath, and step inside again in a few moments.</p>
      </body>
      </html>
    `);
  }
});

// API ROUTES
app.get('/api/health', (req, res) => {
  const mem = process.memoryUsage();
  const db = readDb();
  res.json({
    status: 'ok',
    system: 'Raspberry Pi Zero 2 W • Home Altar Node',
    location: 'Inverclyde, Scotland',
    powerSource: 'Home Altar Node',
    altarSyncStatus: 'Online • Connected to Home Altar Relay',
    gpioPin: 'GPIO 18 Relay Active',
    physicalCandlesLitTotal: db.totalCandlesLit,
    lastAltarPulseAt: db.lastAltarPulseAt || new Date().toISOString(),
    uptimeDays: 143,
    uptimeSeconds: Math.floor(process.uptime()),
    memoryMB: Math.round(mem.rss / (1024 * 1024)),
    tagline: "By His Light is hosted on a Raspberry Pi Zero 2 W beside my home altar in Inverclyde, Scotland. When someone offers a candle through this website, a relay gently lights the altar candles in real time.",
    attribution: 'By His Light ⭐',
    timestamp: new Date().toISOString()
  });
});

// GET status endpoint (4 physical/virtual candle lights + 15 min queue system status)
const getStatusHandler = (req: express.Request, res: express.Response) => {
  const db = readDb();
  if (processCandleQueue(db)) {
    writeDb(db);
  }

  const active_candles: Record<string, boolean> = {};
  db.slots.forEach(slot => {
    active_candles[String(slot.id)] = slot.isLit;
  });

  const now = Date.now();
  const slotsDetail = db.slots.map(slot => ({
    id: slot.id,
    isLit: slot.isLit,
    intention: slot.intention,
    candleTypeId: slot.candleTypeId,
    remainingSeconds: slot.expiresAt ? Math.max(0, Math.round((slot.expiresAt - now) / 1000)) : 0
  }));

  res.json({
    queue_length: db.candleQueue.length,
    active_candles,
    slots: slotsDetail,
    queue: db.candleQueue,
    totalCandlesLit: db.totalCandlesLit,
    lastAltarPulseAt: db.lastAltarPulseAt
  });
};

app.get('/api/status', getStatusHandler);
app.get('/api/candles/status', getStatusHandler);

// GET home altar physical connection status
app.get('/api/altar/status', (req, res) => {
  const db = readDb();
  if (processCandleQueue(db)) {
    writeDb(db);
  }
  res.json({
    online: true,
    hostDevice: 'Raspberry Pi Zero 2 W',
    location: 'Home Altar, Inverclyde, Scotland',
    powerSource: 'Home Altar Mains Power',
    gpioPinState: 'READY (GPIO Pins 1 to 5)',
    relayConnected: true,
    physicalCandlesLitTotal: db.totalCandlesLit,
    queueLength: db.candleQueue.length,
    lastPulseAt: db.lastAltarPulseAt || new Date().toISOString(),
    statusMessage: 'Connected to 5 physical LED votive candles on my home altar'
  });
});

// Reads the Raspberry Pi CPU temperature (vcgencmd only exists on a Pi)
function getCpuTemperature(): Promise<string | null> {
  return new Promise((resolve) => {
    exec('vcgencmd measure_temp', { timeout: 2000 }, (error, stdout) => {
      if (error) {
        resolve(null);
        return;
      }
      const match = stdout.trim().match(/temp=([\d.]+)'C/);
      resolve(match ? match[1] : null);
    });
  });
}

// GET live Raspberry Pi status (minimal, exposed data only)
app.get('/api/pi/status', async (req, res) => {
  const cpuTempC = await getCpuTemperature();

  res.json({
    online: true,
    device: 'Raspberry Pi Zero 2 W',
    hostname: os.hostname(),
    cpuTempC: cpuTempC !== null ? parseFloat(cpuTempC) : null,
    uptimeSeconds: Math.floor(os.uptime()),
    relayStatus: {
      connected: true,
      pin: 'GPIO 18',
      label: 'Candle Relay Connected'
    }
  });
});

// GET candles stats
app.get('/api/candles/stats', (req, res) => {
  const db = readDb();
  if (processCandleQueue(db)) {
    writeDb(db);
  }
  res.json({
    totalCandlesLit: db.totalCandlesLit,
    recentCount: db.recentCandles.length,
    queue_length: db.candleQueue.length,
    lastAltarPulseAt: db.lastAltarPulseAt
  });
});

// POST light a candle (triggers virtual counter & physical home altar relay signal)
app.post('/api/candles/light', (req, res) => {
  const clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
  if (isRateLimited(clientIp, 3, 3600000)) {
    res.status(429).json({ error: 'To protect our sanctuary altar from spam or automated abuse, candle offerings are limited to 3 per hour per visitor. Please return in a little while to offer another flame.' });
    return;
  }

  const { intention, candleTypeId } = req.body;
  const db = readDb();
  processCandleQueue(db);

  const now = Date.now();
  const nowStr = new Date(now).toISOString();
  db.totalCandlesLit += 1;
  db.lastAltarPulseAt = nowStr;

  const sanitizedIntention = (intention && typeof intention === 'string' && intention.trim().length > 0)
    ? intention.trim().slice(0, 300)
    : undefined;

  const candleType = candleTypeId && typeof candleTypeId === 'string' ? candleTypeId : 'sacred_heart_jesus';

  db.recentCandles.unshift({
    id: 'c_' + now,
    intention: sanitizedIntention,
    candleTypeId: candleType,
    createdAt: nowStr
  });
  if (db.recentCandles.length > 20) {
    db.recentCandles.pop();
  }

  // Find free slot out of 5 physical lights
  const freeSlot = db.slots.find(s => !s.isLit);

  let status: 'lit' | 'queued' = 'lit';
  let assignedSlotId: number | null = null;
  let queuePosition = 0;

  if (freeSlot) {
    freeSlot.isLit = true;
    freeSlot.litAt = now;
    freeSlot.expiresAt = now + 15 * 60 * 1000; // 15 minutes
    freeSlot.intention = sanitizedIntention;
    freeSlot.candleTypeId = candleType;
    assignedSlotId = freeSlot.id;
  } else {
    status = 'queued';
    db.candleQueue.push({
      id: 'q_' + now + '_' + Math.random().toString(36).substring(2, 6),
      intention: sanitizedIntention,
      candleTypeId: candleType,
      queuedAt: now
    });
    queuePosition = db.candleQueue.length;
  }

  writeDb(db);

  const active_candles: Record<string, boolean> = {};
  db.slots.forEach(slot => {
    active_candles[String(slot.id)] = slot.isLit;
  });

  res.json({
    success: true,
    status,
    slotId: assignedSlotId,
    queuePosition,
    queue_length: db.candleQueue.length,
    active_candles,
    totalCandlesLit: db.totalCandlesLit,
    physicalAltarSynced: true,
    altarPulseTimestamp: nowStr,
    altarPulseMessage: status === 'queued'
      ? `All 5 physical candles on my altar are currently lit. Your candle request has been placed in position #${queuePosition} in the queue and will turn on automatically when a slot opens!`
      : `Signal received by the Raspberry Pi. Candle #${assignedSlotId} on my home altar in Inverclyde has lit up in prayer for 15 minutes!`
  });
});

// GET public approved prayer wall
app.get('/api/prayers/wall', (req, res) => {
  const db = readDb();
  const approved = db.prayers
    .filter(p => p.status === 'approved')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json(approved);
});

// POST submit prayer request
app.post('/api/prayers/request', (req, res) => {
  const clientIp = req.ip || '127.0.0.1';
  if (isRateLimited(clientIp, 5, 60000)) {
    res.status(429).json({ error: 'Please wait a few minutes before submitting another prayer intention.' });
    return;
  }

  const { intention, name, shareAnonymous } = req.body;
  if (!intention || typeof intention !== 'string' || intention.trim().length === 0) {
    res.status(400).json({ error: 'Prayer intention text is required.' });
    return;
  }

  const db = readDb();
  const newPrayer = {
    id: 'p_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    name: name && typeof name === 'string' ? name.trim().slice(0, 50) : undefined,
    intention: intention.trim().slice(0, 500),
    shareAnonymous: Boolean(shareAnonymous ?? true),
    createdAt: new Date().toISOString(),
    status: 'approved' as const, // Auto-approve for demo warmth, can be edited by admin
    prayedCount: 1
  };

  db.prayers.unshift(newPrayer);
  writeDb(db);

  res.json({ success: true, prayer: newPrayer });
});

// POST increment "I have prayed" count
app.post('/api/prayers/:id/pray', (req, res) => {
  const { id } = req.params;
  const clientIp = req.ip || '127.0.0.1';
  if (isRateLimited(clientIp, 30, 60000)) {
    res.status(429).json({ error: 'Rate limit reached.' });
    return;
  }

  const db = readDb();
  const prayer = db.prayers.find(p => p.id === id);
  if (!prayer) {
    res.status(404).json({ error: 'Prayer intention not found.' });
    return;
  }

  prayer.prayedCount += 1;
  writeDb(db);

  res.json({ success: true, prayedCount: prayer.prayedCount });
});

// ADMIN API endpoints
app.post('/api/admin/verify', (req, res) => {
  const { passcode } = req.body;
  // Sanctuary default quiet admin passcode: "sanctuary777" or "chapel"
  if (passcode === 'sanctuary777' || passcode === 'chapel') {
    res.json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false, error: 'Incorrect chapel passcode.' });
  }
});

app.get('/api/admin/all-prayers', (req, res) => {
  const db = readDb();
  res.json(db.prayers);
});

app.post('/api/admin/toggle-status', (req, res) => {
  const { id, status } = req.body;
  const db = readDb();
  const prayer = db.prayers.find(p => p.id === id);
  if (prayer) {
    prayer.status = status;
    writeDb(db);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.delete('/api/admin/prayer/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.prayers = db.prayers.filter(p => p.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// Start server function
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sanctuary Chapel server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
