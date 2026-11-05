/**
 * Interactive HUD Command Terminal
 */

class InteractiveTerminal {
  constructor(containerId, inputId, outputId, soundEngine, spaceCanvas) {
    this.container = document.getElementById(containerId);
    this.input = document.getElementById(inputId);
    this.output = document.getElementById(outputId);
    this.sound = soundEngine;
    this.canvas = spaceCanvas;
    
    this.history = [];
    this.historyIndex = -1;
    
    this.commands = {
      help: () => this.cmdHelp(),
      whoami: () => this.cmdWhoami(),
      about: () => this.cmdWhoami(),
      skills: () => this.cmdSkills(),
      projects: () => this.cmdProjects(),
      contact: () => this.cmdContact(),
      warp: () => this.cmdWarp(),
      sound: () => this.cmdSound(),
      matrix: () => this.cmdMatrix(),
      clear: () => this.cmdClear(),
      cls: () => this.cmdClear()
    };
    
    this.init();
  }
  
  init() {
    if (!this.input || !this.output) return;
    
    this.input.addEventListener('keydown', (e) => {
      this.sound?.playKey();
      
      if (e.key === 'Enter') {
        const val = this.input.value.trim();
        if (val) {
          this.history.push(val);
          this.historyIndex = this.history.length;
          this.execute(val);
          this.input.value = '';
        }
      } else if (e.key === 'ArrowUp') {
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      }
    });
    
    // Wire up chips
    document.querySelectorAll('.cmd-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd') || chip.innerText.trim();
        this.sound?.playClick();
        this.input.value = cmd;
        this.execute(cmd);
        this.input.value = '';
      });
    });
  }
  
  execute(rawCmd) {
    const cmd = rawCmd.toLowerCase().trim();
    this.appendLine(`<span class="term-prompt">guest@giri:~$</span> <span class="term-highlight">${this.escape(rawCmd)}</span>`);
    
    if (this.commands[cmd]) {
      this.commands[cmd]();
    } else {
      this.appendLine(`<span class="term-output" style="color:#ef4444;">Command not recognized: "${this.escape(cmd)}". Type <b style="color:var(--cyan)">help</b> for a list of directives.</span>`);
    }
    
    this.output.scrollTop = this.output.scrollHeight;
  }
  
  appendLine(html) {
    const div = document.createElement('div');
    div.className = 'terminal-line';
    div.innerHTML = html;
    this.output.appendChild(div);
  }
  
  escape(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  
  cmdHelp() {
    this.appendLine(`
<div class="term-output">
  <span class="term-highlight">AVAILABLE COMMAND DIRECTIVES:</span><br/>
  &nbsp;&nbsp;<b style="color:var(--cyan)">whoami</b>&nbsp;&nbsp;&nbsp;&nbsp;- Engineering profile & mission<br/>
  &nbsp;&nbsp;<b style="color:var(--cyan)">skills</b>&nbsp;&nbsp;&nbsp;&nbsp;- Technical architecture & domain mastery<br/>
  &nbsp;&nbsp;<b style="color:var(--cyan)">projects</b>&nbsp;&nbsp;- Core open-source & enterprise deliverables<br/>
  &nbsp;&nbsp;<b style="color:var(--cyan)">warp</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Toggle hyper-space warp speed canvas<br/>
  &nbsp;&nbsp;<b style="color:var(--cyan)">sound</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Toggle Web Audio procedural synthesizer<br/>
  &nbsp;&nbsp;<b style="color:var(--cyan)">contact</b>&nbsp;&nbsp;&nbsp;- Get encrypted / direct channels<br/>
  &nbsp;&nbsp;<b style="color:var(--cyan)">matrix</b>&nbsp;&nbsp;&nbsp;&nbsp;- Telemetry HUD & ASCII display<br/>
  &nbsp;&nbsp;<b style="color:var(--cyan)">clear</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Wipe terminal buffer
</div>`);
  }
  
  cmdWhoami() {
    this.appendLine(`
<div class="term-output">
  <span class="term-highlight">GIRIEDU</span> (@giriedu)<br/>
  &bull; <b style="color:var(--cyan)">Role:</b> AI Systems Architect & Creative Software Engineer<br/>
  &bull; <b style="color:var(--violet)">Focus:</b> Autonomous Agent Orchestration, Executable Knowledge Graphs, High-Frequency Trading Risk Engines & Motion-Driven Web Experiences.<br/>
  &bull; <b style="color:var(--emerald)">Philosophy:</b> Verifiable proof over unconstrained promises. Stdlib-first, AST-accurate, zero fluff.
</div>`);
  }
  
  cmdSkills() {
    this.appendLine(`
<div class="term-output">
  <span class="term-highlight">CORE COMPETENCIES:</span><br/>
  &bull; <b style="color:var(--cyan)">AI Engineering:</b> Multi-Agent Waves, AST Scanners, Knowledge Graph, Purity Gates<br/>
  &bull; <b style="color:var(--violet)">Frontend & Motion:</b> WebGL, Three.js, Canvas 2D/3D, OKLCH Design Systems, Spring Choreography<br/>
  &bull; <b style="color:var(--emerald)">Quantitative & Backend:</b> Python Stdlib Architectures, Async I/O, Execution Risk Orchestrators
</div>`);
  }
  
  cmdProjects() {
    this.appendLine(`
<div class="term-output">
  <span class="term-highlight">FEATURED REPOSITORIES:</span><br/>
  1. <b style="color:var(--cyan)">MAXILUN</b>: 18-Specialist AI engineering co-pilot & autonomous agent runtime.<br/>
  &nbsp;&nbsp;&nbsp;<a href="https://github.com/giriedu/maxilun" target="_blank" style="color:var(--cyan);text-decoration:underline;">github.com/giriedu/maxilun</a><br/>
  2. <b style="color:var(--violet)">MAXILUN-TRADE</b>: Quantitative day trading & algorithmic risk execution orchestrator.<br/>
  3. <b style="color:var(--emerald)">SIFORMA</b>: Interactive dynamic form builder & state management engine.<br/>
  4. <b style="color:var(--pink)">RUANG DIGITAL & SMPN 17</b>: Public digital service architectures.
</div>`);
  }
  
  cmdContact() {
    this.appendLine(`
<div class="term-output">
  <span class="term-highlight">DIRECT CHANNELS:</span><br/>
  &bull; <b style="color:var(--cyan)">Email:</b> <a href="mailto:info@maxilun.com" style="color:var(--cyan);text-decoration:underline;">info@maxilun.com</a><br/>
  &bull; <b style="color:var(--violet)">GitHub:</b> <a href="https://github.com/giriedu" target="_blank" style="color:var(--violet);text-decoration:underline;">github.com/giriedu</a>
</div>`);
  }
  
  cmdWarp() {
    if (this.canvas) {
      const active = this.canvas.toggleWarp();
      this.sound?.playWarp();
      this.appendLine(`<span class="term-success">WARP DRIVE: ${active ? 'ENGAGED [HYPERSPACE 18X]' : 'DISENGAGED [CRUISE 1X]'}</span>`);
    }
  }
  
  cmdSound() {
    if (this.sound) {
      const active = this.sound.toggle();
      const soundBtn = document.getElementById('sound-toggle-btn');
      if (soundBtn) {
        soundBtn.classList.toggle('active', active);
        const label = soundBtn.querySelector('.sound-label');
        if (label) label.innerText = active ? 'AUDIO: ON' : 'AUDIO: MUTED';
      }
      this.appendLine(`<span class="term-success">AUDIO ENGINE: ${active ? 'ONLINE (PROCEDURAL SYNTHESIS)' : 'MUTED'}</span>`);
    }
  }
  
  cmdMatrix() {
    this.appendLine(`
<pre style="color:var(--cyan);font-size:0.75rem;line-height:1.2;margin:8px 0;">
   ____ _____ ____  ___ _____ ____  _   _ 
  / ___|_   _|  _ \\|_ _| ____|  _ \\| | | |
 | |  _  | | | |_) || ||  _| | | | | | | |
 | |_| | | | |  _ < | || |___| |_| | |_| |
  \\____| |_| |_| \\_\\___|_____|____/ \\___/ 
</pre>
<div class="term-output">
  [NODE: JAKARTA UTC+7] [STATUS: ONLINE] [ENCRYPTION: ACTIVE]
</div>`);
  }
  
  cmdClear() {
    this.output.innerHTML = '';
  }
}

window.InteractiveTerminal = InteractiveTerminal;
