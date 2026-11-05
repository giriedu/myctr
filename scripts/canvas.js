/**
 * Cinematic Galaxy Particle & Constellation Engine
 * High-performance 2D Canvas with 3D depth simulation & lightspeed warp mode
 */

class SpaceCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.stars = [];
    this.nodes = [];
    this.numStars = 140;
    this.numNodes = 40;
    
    this.width = 0;
    this.height = 0;
    
    this.mouse = {
      x: null,
      y: null,
      targetX: null,
      targetY: null,
      radius: 160
    };
    
    this.warpMode = false;
    this.warpSpeed = 1;
    this.targetWarpSpeed = 1;
    
    this.init();
  }
  
  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
    });
    
    window.addEventListener('mouseout', () => {
      this.mouse.targetX = null;
      this.mouse.targetY = null;
    });
    
    this.createEntities();
    this.animate(0);
  }
  
  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio || 1;
    this.canvas.height = this.height * window.devicePixelRatio || 1;
    this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }
  
  createEntities() {
    this.stars = [];
    for (let i = 0; i < this.numStars; i++) {
      this.stars.push({
        x: (Math.random() - 0.5) * this.width * 2,
        y: (Math.random() - 0.5) * this.height * 2,
        z: Math.random() * this.width,
        pz: 0,
        size: Math.random() * 1.5 + 0.5,
        color: Math.random() > 0.4 ? '#38bdf8' : (Math.random() > 0.5 ? '#a855f7' : '#ffffff'),
        alpha: Math.random() * 0.7 + 0.3
      });
    }
    
    this.nodes = [];
    for (let i = 0; i < this.numNodes; i++) {
      this.nodes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? 'rgba(6, 182, 212, ' : 'rgba(139, 92, 246, '
      });
    }
  }
  
  toggleWarp() {
    this.warpMode = !this.warpMode;
    this.targetWarpSpeed = this.warpMode ? 18 : 1;
    return this.warpMode;
  }
  
  animate(time) {
    requestAnimationFrame((t) => this.animate(t));
    
    // Smooth mouse interpolation
    if (this.mouse.targetX !== null) {
      if (this.mouse.x === null) {
        this.mouse.x = this.mouse.targetX;
        this.mouse.y = this.mouse.targetY;
      } else {
        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.1;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.1;
      }
    }
    
    // Warp speed interpolation
    this.warpSpeed += (this.targetWarpSpeed - this.warpSpeed) * 0.05;
    
    // Clear screen with translucent trail in warp mode
    if (this.warpSpeed > 2) {
      this.ctx.fillStyle = 'rgba(3, 7, 18, 0.3)';
    } else {
      this.ctx.fillStyle = '#030712';
    }
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Render Constellation Network
    if (this.warpSpeed < 4) {
      this.renderNodes();
    }
    
    // Render 3D Starfield
    this.renderStars();
  }
  
  renderNodes() {
    const maxDist = 140;
    
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      node.x += node.vx;
      node.y += node.vy;
      
      if (node.x < 0 || node.x > this.width) node.vx *= -1;
      if (node.y < 0 || node.y > this.height) node.vy *= -1;
      
      // Mouse interaction
      if (this.mouse.x !== null) {
        const dx = node.x - this.mouse.x;
        const dy = node.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const force = (1 - dist / this.mouse.radius) * 1.5;
          node.x += (dx / dist) * force;
          node.y += (dy / dist) * force;
        }
      }
      
      // Draw Node
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = node.color + '0.7)';
      this.ctx.fill();
      
      // Connect nearby nodes
      for (let j = i + 1; j < this.nodes.length; j++) {
        const other = this.nodes[j];
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.22;
          this.ctx.beginPath();
          this.ctx.moveTo(node.x, node.y);
          this.ctx.lineTo(other.x, other.y);
          this.ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    }
  }
  
  renderStars() {
    const cx = this.width / 2;
    const cy = this.height / 2;
    
    for (let star of this.stars) {
      star.pz = star.z;
      star.z -= 1.2 * this.warpSpeed;
      
      if (star.z <= 0) {
        star.z = this.width;
        star.pz = star.z;
        star.x = (Math.random() - 0.5) * this.width * 2;
        star.y = (Math.random() - 0.5) * this.height * 2;
      }
      
      const k = 250 / star.z;
      const px = star.x * k + cx;
      const py = star.y * k + cy;
      
      if (px < 0 || px >= this.width || py < 0 || py >= this.height) continue;
      
      const pk = 250 / star.pz;
      const prevX = star.x * pk + cx;
      const prevY = star.y * pk + cy;
      
      const size = Math.max(0.5, (1 - star.z / this.width) * star.size * 2.5);
      const alpha = Math.min(1, Math.max(0.1, (1 - star.z / this.width) * star.alpha));
      
      this.ctx.beginPath();
      if (this.warpSpeed > 2) {
        this.ctx.moveTo(prevX, prevY);
        this.ctx.lineTo(px, py);
        this.ctx.strokeStyle = star.color;
        this.ctx.lineWidth = size * 1.5;
        this.ctx.stroke();
      } else {
        this.ctx.arc(px, py, size, 0, Math.PI * 2);
        this.ctx.fillStyle = star.color;
        this.ctx.globalAlpha = alpha;
        this.ctx.fill();
        this.ctx.globalAlpha = 1.0;
      }
    }
  }
}

window.SpaceCanvas = SpaceCanvas;
