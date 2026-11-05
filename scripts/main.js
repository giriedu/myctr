/**
 * Core Application Controller
 * Handles 3D Card Tilt, Decoder Text FX, Telemetry Clocks, SFX & Toast
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Canvas & Sound Engine
  const spaceCanvas = new SpaceCanvas('space-canvas');
  const soundEngine = new SoundEngine();
  
  // Initialize Terminal
  const terminal = new InteractiveTerminal(
    'hud-terminal',
    'terminal-input',
    'terminal-output',
    soundEngine,
    spaceCanvas
  );
  
  // 2. Sound Toggle UI
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) {
    if (soundEngine.enabled) {
      soundBtn.classList.add('active');
      const label = soundBtn.querySelector('.sound-label');
      if (label) label.innerText = 'AUDIO: ON';
    }
    
    soundBtn.addEventListener('click', () => {
      const active = soundEngine.toggle();
      soundBtn.classList.toggle('active', active);
      const label = soundBtn.querySelector('.sound-label');
      if (label) label.innerText = active ? 'AUDIO: ON' : 'AUDIO: MUTED';
      showToast(active ? '🔊 Procedural Audio Online' : '🔇 Audio Muted');
    });
  }
  
  // 3. Warp Speed Toggle UI
  const warpBtn = document.getElementById('warp-toggle-btn');
  if (warpBtn) {
    warpBtn.addEventListener('click', () => {
      const active = spaceCanvas.toggleWarp();
      soundEngine.playWarp();
      warpBtn.classList.toggle('active', active);
      showToast(active ? '🚀 Warp Drive: 18x Hyperspace' : '🛸 Warp Drive: Cruising 1x');
    });
  }
  
  // 4. Attach Audio Feedback to interactive elements
  const hoverables = document.querySelectorAll('a, button, .project-card, .matrix-card, .cmd-chip');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => soundEngine.playHover());
    el.addEventListener('click', () => soundEngine.playClick());
  });
  
  // 5. 3D Card Tilt & Mouse Coordinates for Glow
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
  });
  
  // 6. Text Decoder / Glitch Effect
  const decodeElements = document.querySelectorAll('[data-decode]');
  decodeElements.forEach(el => {
    const originalText = el.innerText;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%#$@*+';
    
    const runDecoder = () => {
      let iteration = 0;
      const interval = setInterval(() => {
        el.innerText = originalText
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            if (char === ' ') return ' ';
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        
        if (iteration >= originalText.length) {
          clearInterval(interval);
        }
        iteration += 1 / 2;
      }, 30);
    };
    
    el.addEventListener('mouseenter', runDecoder);
    // Initial reveal
    setTimeout(runDecoder, 400);
  });
  
  // 7. Telemetry Clock (Jakarta UTC+7)
  const timeEl = document.getElementById('telemetry-time');
  const updateClock = () => {
    if (!timeEl) return;
    const now = new Date();
    // Jakarta is UTC+7
    const options = {
      timeZone: 'Asia/Jakarta',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    timeEl.innerText = now.toLocaleTimeString('en-US', options) + ' WIB';
  };
  setInterval(updateClock, 1000);
  updateClock();
  
  // 8. Copy Email to Clipboard
  const copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'shalahuddingiripamungkas@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('📋 Email copied to clipboard!');
        soundEngine.playClick();
      }).catch(() => {
        showToast(`Email: ${email}`);
      });
    });
  }
  
  // 9. Toast Helper
  const toast = document.getElementById('cinema-toast');
  let toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    toast.innerText = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
  
  window.showToast = showToast;
});
