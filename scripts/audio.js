/**
 * Procedural Web Audio API Sound Synthesizer
 * Generates futuristic HUD soundscapes dynamically with zero audio assets
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.masterGain = null;
    
    // Check saved preference
    const saved = localStorage.getItem('giri_audio_enabled');
    if (saved === 'true') {
      this.enabled = true;
    }
  }
  
  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return true;
  }
  
  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('giri_audio_enabled', this.enabled ? 'true' : 'false');
    if (this.enabled) {
      this.ensureContext();
      this.playClick();
    }
    return this.enabled;
  }
  
  playHover() {
    if (!this.enabled || !this.ensureContext()) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(1400, t + 0.06);
      
      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(t);
      osc.stop(t + 0.07);
    } catch (e) {}
  }
  
  playClick() {
    if (!this.enabled || !this.ensureContext()) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(400, t + 0.08);
      
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(t);
      osc.stop(t + 0.09);
    } catch (e) {}
  }
  
  playWarp() {
    if (!this.enabled || !this.ensureContext()) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(60, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.5);
      osc.frequency.exponentialRampToValueAtTime(45, t + 1.2);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, t);
      filter.frequency.exponentialRampToValueAtTime(1800, t + 0.6);
      filter.frequency.exponentialRampToValueAtTime(250, t + 1.2);
      
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.3);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(t);
      osc.stop(t + 1.35);
    } catch (e) {}
  }
  
  playKey() {
    if (!this.enabled || !this.ensureContext()) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450 + Math.random() * 200, t);
      
      gain.gain.setValueAtTime(0.02, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(t);
      osc.stop(t + 0.035);
    } catch (e) {}
  }
}

window.SoundEngine = SoundEngine;
