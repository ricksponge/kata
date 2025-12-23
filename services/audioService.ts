
import { MoveType } from "../types";

class AudioService {
  private ctx: AudioContext | null = null;
  private ambienceOsc: OscillatorNode | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private createOscillator(freq: number, type: OscillatorType, duration: number, volume: number, fade: boolean = true) {
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    if (fade) {
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  public playZenAmbience() {
    this.init();
    if (!this.ctx) return;
    
    // Simuler une flûte zen (Shakuhachi) avec des harmoniques douces
    const playNote = () => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const baseFreq = 220 * Math.pow(1.059, [0, 2, 5, 7, 9][Math.floor(Math.random() * 5)]);
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.02, now + 2); // Vibrato
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.02, now + 1);
        gain.gain.linearRampToValueAtTime(0, now + 4);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 4);
    };

    setInterval(playNote, 5000);
    playNote();
  }

  public playMove(type: MoveType) {
    this.init();
    if (!this.ctx) return;

    switch (type) {
      case MoveType.OI_ZUKI_JODAN:
        this.createOscillator(180, 'square', 0.1, 0.08);
        this.createOscillator(120, 'sine', 0.15, 0.1);
        break;
      case MoveType.GEDAN_BARAI:
        this.createOscillator(300, 'triangle', 0.1, 0.1);
        break;
      case MoveType.KIAI:
        // Un KIAI guttural et puissant
        const now = this.ctx.currentTime;
        const frequencies = [200, 350, 480];
        frequencies.forEach(f => {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(f, now);
            osc.frequency.exponentialRampToValueAtTime(f * 0.8, now + 0.4);
            g.gain.setValueAtTime(0.1, now);
            g.gain.linearRampToValueAtTime(0, now + 0.5);
            osc.connect(g);
            g.connect(this.ctx.destination);
            osc.start();
            osc.stop(now + 0.5);
        });
        break;
      case MoveType.YAME:
        this.createOscillator(100, 'sine', 1, 0.05);
        break;
    }
  }

  public playSuccess() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((f, i) => {
        this.createOscillator(f, 'sine', 0.8, 0.05);
    });
  }

  public playFail() {
    this.init();
    if (!this.ctx) return;
    this.createOscillator(80, 'sawtooth', 0.4, 0.1);
  }
}

export const audioService = new AudioService();
