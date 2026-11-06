/**
 * ToneEngine: a tiny Web Audio API helper for test tones.
 * MIT License. https://speakercleaningtool.com
 *
 * Create it inside a user gesture (click/tap), never at page load,
 * because browsers block audio until the user interacts.
 */
export class ToneEngine {
  constructor() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.3;
    this.master.connect(this.ctx.destination);
    this.current = null;
  }

  setVolume(v) {
    const t = this.ctx.currentTime;
    this.master.gain.setTargetAtTime(clamp(v, 0, 1), t, 0.02);
  }

  /** Play a sine tone. pan: -1 (left) to 1 (right). */
  playTone({ frequency = 165, duration = 10, volume = 0.3, pan = 0, type = "sine" } = {}) {
    return this.#start(duration, volume, pan, (osc, t) => {
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, t);
    });
  }

  /** Exponential frequency sweep from `from` Hz to `to` Hz. */
  playSweep({ from = 100, to = 1000, duration = 10, volume = 0.3, pan = 0 } = {}) {
    return this.#start(duration, volume, pan, (osc, t) => {
      osc.type = "sine";
      osc.frequency.setValueAtTime(from, t);
      osc.frequency.exponentialRampToValueAtTime(to, t + duration);
    });
  }

  stop() {
    if (!this.current) return;
    const { osc, env } = this.current;
    const t = this.ctx.currentTime;
    env.gain.cancelScheduledValues(t);
    env.gain.setTargetAtTime(0, t, 0.03); // short fade avoids clicks
    osc.stop(t + 0.2);
    this.current = null;
  }

  #start(duration, volume, pan, configure) {
    this.stop();
    if (this.ctx.state === "suspended") this.ctx.resume();
    this.setVolume(volume);

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    const panner = this.ctx.createStereoPanner
      ? this.ctx.createStereoPanner()
      : null;

    configure(osc, t);

    // 50 ms fade in / out to prevent speaker pops.
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(1, t + 0.05);
    env.gain.setValueAtTime(1, t + Math.max(0.05, duration - 0.05));
    env.gain.linearRampToValueAtTime(0, t + duration);

    osc.connect(env);
    if (panner) {
      panner.pan.value = clamp(pan, -1, 1);
      env.connect(panner).connect(this.master);
    } else {
      env.connect(this.master);
    }

    osc.start(t);
    osc.stop(t + duration + 0.05);
    const handle = { osc, env };
    osc.onended = () => { if (this.current === handle) this.current = null; };
    this.current = handle;
    return handle;
  }
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}
