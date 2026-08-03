/**
 * Web Audio API synthesizer for a quiet, reverent chapel bell.
 * Completely offline, 0 network dependencies, extremely lightweight.
 */

let audioCtx: AudioContext | null = null;

export function playChapelBell(volume: number = 0.25) {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Fundamental bell pitch: D4 (~293.66 Hz) or A3 (~220 Hz)
    const fundamental = 293.66;
    const partials = [
      { freq: fundamental * 1.0, gain: 0.5, decay: 4.0 },
      { freq: fundamental * 2.76, gain: 0.2, decay: 2.5 }, // Hum tone / overtone
      { freq: fundamental * 5.4, gain: 0.1, decay: 1.5 },  // High shimmer
    ];

    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(volume, now);
    masterGain.connect(audioCtx.destination);

    partials.forEach(p => {
      const osc = audioCtx!.createOscillator();
      const gain = audioCtx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.freq, now);

      gain.gain.setValueAtTime(p.gain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + p.decay);
    });

  } catch (err) {
    console.debug('Audio context play quiet fail:', err);
  }
}
