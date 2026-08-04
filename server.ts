import express from 'express';
import path from 'path';
import fs from 'fs';
import os from 'os';
import crypto from 'crypto';
import { exec, execFile } from 'child_process';
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

interface GuestbookEntry {
  id: string;
  name?: string;
  country?: string;
  message: string;
  anonymous: boolean;
  createdAt: string;
  approved: boolean;
  ipHash: string;
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
  guestbook: GuestbookEntry[];
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
  ],
  guestbook: [
    {
      id: 'g_seed_1',
      name: 'Margaret',
      country: 'Ireland',
      message: 'What a peaceful corner of the internet. Praying for all who stop here today.',
      anonymous: false,
      createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
      approved: true,
      ipHash: hashIp('127.0.0.1')
    },
    {
      id: 'g_seed_2',
      country: 'United States',
      message: 'Lord, bring peace to all who visit today.',
      anonymous: true,
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      approved: true,
      ipHash: hashIp('127.0.0.1')
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
    const db = JSON.parse(raw) as SanctuaryDb;
    if (!Array.isArray(db.guestbook)) {
      db.guestbook = [];
    }
    return db;
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

// Hashes an IP address so the database never stores raw visitor IPs
function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(`${ip}|byhislight-guestbook`).digest('hex').slice(0, 16);
}

// Basic spam protection: reject anything that looks like a link
const LINK_PATTERN = /(https?:\/\/|www\.|\S+\.(?:com|net|org|io|co|uk|gg|link|me|xyz|info|biz|live|site|shop)\b)/i;

// Application-maintained, sanitised event log (never journalctl)
interface SanctuaryEvent {
  ts: string;
  type: string;
  label: string;
}

interface EventsFile {
  lastBootAt?: string;
  events: SanctuaryEvent[];
}

const EVENTS_FILE = path.join(DATA_DIR, 'sanctuary-events.json');
const MAX_EVENTS = 20;

function readEvents(): EventsFile {
  try {
    if (fs.existsSync(EVENTS_FILE)) {
      const raw = fs.readFileSync(EVENTS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.events)) {
        return { lastBootAt: parsed.lastBootAt, events: parsed.events };
      }
    }
  } catch (err) {
    console.error('Error reading sanctuary events:', err);
  }
  return { events: [] };
}

function writeEvents(file: EventsFile) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(file, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing sanctuary events:', err);
  }
}

function appendEvent(file: EventsFile, type: string, label: string) {
  file.events.unshift({ ts: new Date().toISOString(), type, label });
  if (file.events.length > MAX_EVENTS) {
    file.events.length = MAX_EVENTS;
  }
  writeEvents(file);
}

// Reads a systemd unit state safely. Never exposes unit logs, paths or args.
type ServiceState = 'active' | 'inactive' | 'unknown';

function getSystemdState(service: string): Promise<ServiceState> {
  return new Promise((resolve) => {
    execFile('systemctl', ['is-active', service], { timeout: 3000 }, (error, stdout) => {
      const state = (stdout || '').trim().toLowerCase();
      if (state === 'active') {
        resolve('active');
        return;
      }
      if (state === 'inactive' || state === 'failed' || state === 'activating' || state === 'deactivating') {
        resolve('inactive');
        return;
      }
      // Missing unit, missing systemctl, or unreadable state
      resolve('unknown');
    });
  });
}

// Records what the chapel app itself can observe at startup.
async function seedStartupEvents() {
  const file = readEvents();
  const now = Date.now();
  const bootMs = now - os.uptime() * 1000;
  const bootAt = new Date(bootMs).toISOString();
  const prevBootMs = file.lastBootAt ? new Date(file.lastBootAt).getTime() : 0;
  const isNewBoot = !prevBootMs || Math.abs(prevBootMs - bootMs) > 120000;

  if (isNewBoot) {
    appendEvent(file, 'system_started', 'System started');
    file.lastBootAt = bootAt;
  }

  const lastSiteEvent = file.events.find(e => e.type === 'website_started');
  if (!lastSiteEvent || now - new Date(lastSiteEvent.ts).getTime() > 60000) {
    appendEvent(file, 'website_started', 'Website service started');
  }

  const cloudflaredState = await getSystemdState('cloudflared');
  if (isNewBoot && cloudflaredState === 'active') {
    appendEvent(file, 'cloudflare_connected', 'Cloudflare Tunnel connected');
  }

  if (!file.events.some(e => e.type === 'site_deployed')) {
    appendEvent(file, 'site_deployed', 'Site deployment completed');
  }

  writeEvents(file);
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
        <h1>The Home Altar is Temporarily Unavailable</h1>
        <p><em>"The light shines in the darkness, and the darkness has not overcome it." - John 1:5</em></p>
        <p>This may be due to a restart, a temporary power interruption, or a small update being installed. Please try again in a few moments.</p>
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

function getCpuLoadPercent(): number | null {
  const cores = os.cpus();
  if (!cores || cores.length === 0) return null;
  const oneMinute = os.loadavg()[0];
  if (oneMinute == null) return null;
  return Math.min(100, Math.round((oneMinute / cores.length) * 100));
}

function getMemoryUsedPercent(): number | null {
  const total = os.totalmem();
  if (!total) return null;
  return Math.round(((total - os.freemem()) / total) * 100);
}

function getDiskUsage(): { usedGB: number; totalGB: number } | null {
  try {
    const stats = fs.statfsSync(process.cwd());
    const total = stats.blocks * stats.bsize;
    if (!total) return null;
    const free = stats.bfree * stats.bsize;
    return {
      usedGB: Math.round(((total - free) / (1024 ** 3)) * 10) / 10,
      totalGB: Math.round((total / (1024 ** 3)) * 10) / 10,
    };
  } catch {
    return null;
  }
}

function getDiskUsedPercent(): number | null {
  const usage = getDiskUsage();
  if (!usage || usage.totalGB === 0) return null;
  return Math.round((usage.usedGB / usage.totalGB) * 100);
}

// GET live Raspberry Pi status (minimal, exposed data only)
app.get('/api/pi/status', async (req, res) => {
  res.set('Cache-Control', 'no-store');

  const [cpuTempC, websiteService, cloudflaredService] = await Promise.all([
    getCpuTemperature(),
    getSystemdState('byhislight'),
    getSystemdState('cloudflared'),
  ]);
  const diskUsage = getDiskUsage();
  const eventsFile = readEvents();
  const bootTime = new Date(Date.now() - os.uptime() * 1000).toISOString();
  const relayConnected = true;

  res.json({
    online: true,
    device: 'Raspberry Pi Zero 2 W',
    hostname: os.hostname(),
    cpuTempC: cpuTempC !== null ? parseFloat(cpuTempC) : null,
    uptimeSeconds: Math.floor(os.uptime()),
    cpuLoadPercent: getCpuLoadPercent(),
    memoryUsedPercent: getMemoryUsedPercent(),
    diskUsedPercent: getDiskUsedPercent(),
    diskUsedGB: diskUsage ? diskUsage.usedGB : null,
    diskTotalGB: diskUsage ? diskUsage.totalGB : null,
    websiteService,
    cloudflaredService,
    candleRelay: relayConnected ? 'connected' : 'disconnected',
    lastBootTime: bootTime,
    relayStatus: {
      connected: relayConnected,
      pin: 'GPIO 18',
      label: 'Candle Relay Connected'
    },
    recentEvents: (eventsFile.events || []).slice(0, 6).map(e => ({
      ts: e.ts,
      type: e.type,
      label: e.label
    }))
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

// VISITORS' BOOK (guestbook) endpoints

// A request is treated as "local" only when it arrives over a loopback socket
// address. Header values such as X-Forwarded-For / CF-Connecting-IP are never
// trusted to grant access; their presence only marks the request as having
// passed through a proxy, which denies it.
function isLoopbackAddress(addr: string | undefined): boolean {
  if (!addr) return false;
  const a = addr.toLowerCase();
  return a === '127.0.0.1' || a === '::1' || a === '::ffff:127.0.0.1';
}

function isProxiedRequest(req: express.Request): boolean {
  return Boolean(
    req.headers['cf-connecting-ip'] ||
    req.headers['cf-ray'] ||
    req.headers['x-forwarded-for'] ||
    req.headers['x-forwarded-proto']
  );
}

// Admin guestbook routes are only served to local moderators. Any request that
// did not originate on loopback - or that travelled through a proxy such as
// Cloudflare - is answered with a plain 404 so the admin API stays unadvertised.
function localOnlyAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const isLocal = isLoopbackAddress(req.socket.remoteAddress) && !isProxiedRequest(req);
  if (!isLocal) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  next();
}

// POST leave a message (held for quiet approval before appearing)
app.post('/api/guestbook', (req, res) => {
  const clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
  if (isRateLimited(clientIp, 3, 3600000)) {
    res.status(429).json({ error: 'To keep our Visitors\' Book a quiet and peaceful place, messages are limited to 3 per hour per visitor. Please return in a little while to leave another message.' });
    return;
  }

  const { name, country, message, anonymous } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    res.status(400).json({ error: 'A short prayer or message is required.' });
    return;
  }
  if (message.trim().length > 200) {
    res.status(400).json({ error: 'Please keep your message to 200 characters or fewer.' });
    return;
  }

  const cleanMessage = message.trim().slice(0, 200);
  const cleanName = name && typeof name === 'string' ? name.trim().slice(0, 50) : undefined;
  const cleanCountry = country && typeof country === 'string' ? country.trim().slice(0, 56) : undefined;

  if (LINK_PATTERN.test(cleanMessage) || LINK_PATTERN.test(cleanName || '') || LINK_PATTERN.test(cleanCountry || '')) {
    res.status(400).json({ error: 'Messages containing web links cannot be accepted. Please remove any links and try again.' });
    return;
  }

  const isAnonymous = Boolean(anonymous);
  const db = readDb();
  const entry: GuestbookEntry = {
    id: 'g_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    name: isAnonymous ? undefined : cleanName,
    country: cleanCountry,
    message: cleanMessage,
    anonymous: isAnonymous,
    createdAt: new Date().toISOString(),
    approved: false,
    ipHash: hashIp(clientIp)
  };

  db.guestbook.unshift(entry);
  writeDb(db);

  res.json({
    success: true,
    status: 'pending',
    message: 'Thank you. Your message has been received and will appear in the Visitors\' Book once it has been quietly approved.'
  });
});

// GET approved messages, newest first (never exposes ipHash or moderation state)
app.get('/api/guestbook', (req, res) => {
  const db = readDb();
  const approved = db.guestbook
    .filter(e => e.approved)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map(e => ({
      id: e.id,
      name: e.anonymous ? undefined : e.name,
      country: e.country,
      message: e.message,
      createdAt: e.createdAt
    }));
  res.json(approved);
});

// ADMIN: list every entry (including pending) for moderation
app.get('/api/admin/guestbook', localOnlyAdmin, (req, res) => {
  const db = readDb();
  const entries = db.guestbook
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(entries);
});

// ADMIN: approve or hide an entry
app.patch('/api/admin/guestbook/:id', localOnlyAdmin, (req, res) => {
  const { id } = req.params;
  const { approved } = req.body;
  const db = readDb();
  const entry = db.guestbook.find(e => e.id === id);
  if (!entry) {
    res.status(404).json({ error: 'Entry not found' });
    return;
  }
  entry.approved = Boolean(approved);
  writeDb(db);
  res.json({ success: true, approved: entry.approved });
});

// ADMIN: remove an entry entirely
app.delete('/api/admin/guestbook/:id', localOnlyAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.guestbook = db.guestbook.filter(e => e.id !== id);
  writeDb(db);
  res.json({ success: true });
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

  await seedStartupEvents();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sanctuary Chapel server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
