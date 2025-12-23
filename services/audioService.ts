
import { MoveType } from "../types";

class AudioService {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private createOscillator(freq: number, type: OscillatorType, duration: number, volume: number) {
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  private createNoise(duration: number, volume: number) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    noise.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }

  public playMove(type: MoveType) {
    this.init();
    if (!this.ctx) return;

    switch (type) {
      case MoveType.PUNCH:
        this.createOscillator(160, 'square', 0.1, 0.1);
        break;
      case MoveType.KICK:
        this.createOscillator(110, 'triangle', 0.2, 0.15);
        break;
      case MoveType.BLOCK:
        this.createOscillator(450, 'sine', 0.08, 0.1);
        break;
      case MoveType.KIAI:
        // Un KIAI puissant combine plusieurs sons et du bruit blanc
        this.createOscillator(220, 'sawtooth', 0.5, 0.15);
        this.createOscillator(440, 'square', 0.4, 0.05);
        this.createNoise(0.4, 0.1); // Le "souffle" du cri
        break;
    }
  }

  public playSuccess() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [440, 554, 659, 880].forEach((f, i) => this.createOscillator(f, 'square', 0.4, 0.05));
  }

  public playFail() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(50, now + 0.5);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1, now);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.5);
  }
}

export const audioService = new AudioService();
