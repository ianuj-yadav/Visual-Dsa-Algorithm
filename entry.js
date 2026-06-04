// Modular Cyber Blue/Cyan Falling Data Rain Entry Animation for AlgoJudge
(function() {
  // 1. Register global modular hooks
  window.hasEntryAnimation = true;
  
  // Inject style block dynamically
  const style = document.createElement("style");
  style.innerHTML = `
    #entry-overlay {
      position: fixed;
      inset: 0;
      background-color: #030712;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      font-family: 'Inter', sans-serif;
      transition: opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    }
    
    #entry-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
    }
    
    .entry-content-box {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      user-select: none;
    }
    
    .entry-loader-container {
      width: 280px;
      height: 6px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(6, 182, 212, 0.15);
      border-radius: 999px;
      position: relative;
      box-shadow: 0 0 10px rgba(6, 182, 212, 0.05);
      margin-bottom: 1.2rem;
      opacity: 0;
      transform: scale(0.9);
      transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    }
    
    .entry-loader-container.reveal-active {
      opacity: 1;
      transform: scale(1);
      border-color: rgba(6, 182, 212, 0.35);
      box-shadow: 0 0 15px rgba(6, 182, 212, 0.15);
    }
    
    .entry-loader-bar {
      width: 0%;
      height: 100%;
      background: linear-gradient(90deg, #a855f7, #06b6d4);
      box-shadow: 0 0 12px #06b6d4;
      border-radius: 999px;
      transition: width 0.1s linear;
    }
    
    .entry-loader-box {
      width: 12px;
      height: 12px;
      background: #06b6d4;
      border: 1.5px solid rgba(255, 255, 255, 0.9);
      border-radius: 2.5px;
      position: absolute;
      top: 50%;
      left: 0%;
      transform: translate(-50%, -50%) rotate(0deg);
      box-shadow: 0 0 15px #06b6d4, 0 0 6px #a855f7;
      transition: left 0.1s linear, transform 0.1s linear;
      z-index: 10;
      opacity: 0;
    }
    
    .entry-loader-container.reveal-active .entry-loader-box {
      opacity: 1;
    }
    
    .entry-subtitle {
      font-size: 0.9rem;
      font-weight: 700;
      font-family: 'Fira Code', monospace;
      color: #a855f7;
      text-transform: uppercase;
      letter-spacing: 0.35rem;
      margin-top: 1rem;
      opacity: 0;
      text-shadow: 0 0 10px rgba(168, 85, 247, 0.65);
    }
    
    /* Reveal animations */
    .entry-subtitle.reveal-active {
      animation: entrySubReveal 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
    }
    
    @keyframes entrySubReveal {
      0% {
        opacity: 0;
        letter-spacing: 0.8rem;
        filter: blur(5px);
      }
      100% {
        opacity: 1;
        letter-spacing: 0.35rem;
        filter: blur(0);
      }
    }
  `;
  document.head.appendChild(style);
  
  // 2. Web Audio Synthesizer
  function synthesizeSound(type) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    
    if (type === 'hum') {
      // Futuristic cyber charge-up hum
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 1.4);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, now);
      filter.frequency.exponentialRampToValueAtTime(320, now + 1.4);
      
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.9);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 1.55);
    } 
    else if (type === 'glitch_beep') {
      // Futuristic digital glitch blip
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800 + Math.random() * 500, now);
      osc.frequency.setValueAtTime(1100 + Math.random() * 500, now + 0.04);
      
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    }
    else if (type === 'system_online') {
      // Premium "System Online / Shockwave" sound effect
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (major chord)
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.4, now + 0.55);
        
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.65);
      });

      // Digital resonance filter sweep
      const oscLow = ctx.createOscillator();
      const gainLow = ctx.createGain();
      const filterLow = ctx.createBiquadFilter();
      
      oscLow.type = 'sawtooth';
      oscLow.frequency.setValueAtTime(85, now);
      oscLow.frequency.linearRampToValueAtTime(35, now + 0.75);
      
      filterLow.type = 'lowpass';
      filterLow.frequency.setValueAtTime(450, now);
      filterLow.frequency.exponentialRampToValueAtTime(45, now + 0.75);
      filterLow.Q.value = 14;
      
      gainLow.gain.setValueAtTime(0.22, now);
      gainLow.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      
      oscLow.connect(filterLow);
      filterLow.connect(gainLow);
      gainLow.connect(ctx.destination);
      
      oscLow.start(now);
      oscLow.stop(now + 0.85);
    }
  }

  // 3. Page Animation Launcher
  window.playEntryAnimation = function(onComplete) {
    // Construct HTML elements dynamically
    const overlay = document.createElement("div");
    overlay.id = "entry-overlay";
    
    overlay.innerHTML = `
      <canvas id="entry-canvas"></canvas>
      <div class="entry-content-box">
        <div class="entry-loader-container" id="entry-loader-container">
          <div class="entry-loader-bar" id="entry-loader-bar"></div>
          <div class="entry-loader-box" id="entry-loader-box"></div>
        </div>
        <div class="entry-subtitle" id="entry-subtitle">DSA Visualizer Studio (Beta Version)</div>
      </div>
    `;
    document.body.appendChild(overlay);
    
    // Canvas dimensions setup
    const canvas = document.getElementById("entry-canvas");
    const ctx = canvas.getContext("2d");
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    
    // Animation timeline parameters
    let startTime = null;
    let particles = [];
    
    // Classes for Cyber Blue/Cyan Falling Data Rain
    class DataStream {
      constructor(w, h) {
        this.reset(w, h, true);
      }
      reset(w, h, initial = false) {
        this.x = Math.random() * w;
        this.y = initial ? (Math.random() * -h) : (Math.random() * -200 - 50);
        this.speed = Math.random() * 8 + 5;
        this.length = Math.random() * 140 + 50;
        this.width = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.45 + 0.15;
        this.color = Math.random() > 0.35 ? '#06b6d4' : '#a855f7';
      }
      update(w, h) {
        this.y += this.speed;
        if (this.y - this.length > h) {
          this.reset(w, h);
        }
      }
      draw(c) {
        c.save();
        const grad = c.createLinearGradient(this.x, this.y - this.length, this.x, this.y);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, this.color);
        c.strokeStyle = grad;
        c.lineWidth = this.width;
        c.globalAlpha = this.opacity;
        c.beginPath();
        c.moveTo(this.x, this.y - this.length);
        c.lineTo(this.x, this.y);
        c.stroke();
        c.restore();
      }
    }

    // Glowing Single Code Characters falling down
    class GlowingDot {
      constructor(w, h) {
        this.reset(w, h, true);
      }
      reset(w, h, initial = false) {
        this.x = Math.random() * w;
        this.y = initial ? (Math.random() * h) : (Math.random() * -120 - 20);
        this.speed = Math.random() * 5 + 3.5;
        this.size = Math.random() * 5 + 10; // larger text size for code glyph visibility
        this.color = Math.random() > 0.35 ? '#06b6d4' : '#a855f7';
        this.alpha = Math.random() * 0.55 + 0.45;
        
        const glyphs = ['i', 'j', 'x', 'y', 'n', '{', '}', '[', ']', ';', '+', '-', '=', '<', '>', '0', '1'];
        this.char = glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      update(w, h, onHitBottom) {
        this.y += this.speed;
        if (this.y >= h - 10) {
          onHitBottom(this.x, h - 10, this.color);
          this.reset(w, h);
        }
      }
      draw(c) {
        c.save();
        c.globalAlpha = this.alpha;
        c.fillStyle = this.color;
        c.font = `${this.size}px 'Fira Code', monospace`;
        c.shadowBlur = 10;
        c.shadowColor = this.color;
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(this.char, this.x, this.y);
        c.restore();
      }
    }

    // Square sparks instead of circular sparks
    class SplashParticle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 5;
        this.vy = -Math.random() * 6 - 2;
        this.size = Math.random() * 2.5 + 2; // size of square
        this.color = color;
        this.alpha = 1.0;
        this.decay = Math.random() * 0.045 + 0.025;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.22; // gravity pull
        this.alpha -= this.decay;
      }
      draw(c) {
        c.save();
        c.globalAlpha = Math.max(0, this.alpha);
        c.fillStyle = this.color;
        c.shadowBlur = 6;
        c.shadowColor = this.color;
        // Render tiny square instead of circle
        c.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        c.restore();
      }
    }

    // Large Zooming Coding Syntax Symbols that bounce/zoom forward and fade out
    class Particle {
      constructor(x, y, color, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        
        this.size = Math.random() * 10 + 16; // starting size (16px to 26px)
        this.color = color;
        this.alpha = 1.0;
        this.decay = Math.random() * 0.018 + 0.012; // fade rate
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.15; // spin speed
        this.growth = Math.random() * 0.6 + 0.35; // grows larger to simulate zooming towards camera
        
        // Curated set of multi-character coding symbols & keywords
        const symbols = [
          '++', '=>', '&&', '||', '==', '!=', '<<', '>>', '::', '->',
          '{}', '[]', '()', 'const', 'let', 'fn', 'void', 'main()', 'class',
          'struct', 'import', 'return', 'nullptr', 'NULL', 'cout', 'cin',
          'std::', 'vector<int>', 'int', 'char', 'bool', 'double', 'float',
          'malloc', 'new', 'delete', 'push_back', 'insert', 'erase',
          '#include', '#define', 'public:', 'private:'
        ];
        this.text = symbols[Math.floor(Math.random() * symbols.length)];
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Decelerate slightly
        this.vx *= 0.96;
        this.vy *= 0.96;
        
        this.size += this.growth;
        this.angle += this.spin;
        this.alpha -= this.decay;
      }
      draw(c) {
        c.save();
        c.globalAlpha = Math.max(0, this.alpha);
        c.fillStyle = this.color;
        c.font = `bold ${this.size}px 'Fira Code', monospace`;
        c.shadowBlur = 15;
        c.shadowColor = this.color;
        c.textAlign = "center";
        c.textBaseline = "middle";
        
        c.translate(this.x, this.y);
        c.rotate(this.angle);
        c.fillText(this.text, 0, 0);
        c.restore();
      }
    }

    // Initialize rain elements - Reduced for clean layout
    const streamCount = 18;
    const dotCount = 22;
    const streams = [];
    const dots = [];
    let splashParticles = [];

    for (let i = 0; i < streamCount; i++) {
      streams.push(new DataStream(canvas.width, canvas.height));
    }
    for (let i = 0; i < dotCount; i++) {
      dots.push(new GlowingDot(canvas.width, canvas.height));
    }

    // Splash spark callback
    const handleHitBottom = (x, y, color) => {
      const sparksCount = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < sparksCount; i++) {
        splashParticles.push(new SplashParticle(x, y, color));
      }
    };

    // Render loop
    function loop(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // Clean solid canvas clearing to remove fading/ghosting trails
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw ambient grid
      ctx.strokeStyle = "rgba(6, 182, 212, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 45;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Update and Draw Data Streams
      streams.forEach(stream => {
        stream.update(canvas.width, canvas.height);
        stream.draw(ctx);
      });

      // Update and Draw Glowing Code Glyphs
      dots.forEach(dot => {
        dot.update(canvas.width, canvas.height, handleHitBottom);
        dot.draw(ctx);
      });

      // Update and Draw Splash Particles (Squares)
      splashParticles.forEach(sp => {
        sp.update();
        sp.draw(ctx);
      });
      splashParticles = splashParticles.filter(sp => sp.alpha > 0);

      // Render bottom glow haze (matching reference image)
      ctx.save();
      const bottomGrad = ctx.createLinearGradient(0, canvas.height - 140, 0, canvas.height);
      bottomGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      bottomGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.18)');
      bottomGrad.addColorStop(0.85, 'rgba(6, 182, 212, 0.45)');
      bottomGrad.addColorStop(1, 'rgba(6, 182, 212, 0.85)');
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, canvas.height - 140, canvas.width, 140);

      // Bright baseline
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#06b6d4';
      ctx.fillStyle = 'rgba(6, 182, 212, 0.95)';
      ctx.fillRect(0, canvas.height - 5, canvas.width, 5);
      ctx.restore();

      // Update loading bar progress width dynamically
      const progress = Math.min(100, (elapsed / 2800) * 100);
      const loaderBar = document.getElementById("entry-loader-bar");
      if (loaderBar) {
        loaderBar.style.width = progress + "%";
      }

      // Update rolling box position and rotation
      const loaderBox = document.getElementById("entry-loader-box");
      if (loaderBox) {
        loaderBox.style.left = progress + "%";
        const rotation = progress * 7.2; // 720 degrees of rotation (2 full turns)
        loaderBox.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
      }

      // T = 200ms: Charging power-up hum, reveal loading bar and box
      if (elapsed >= 200 && !overlay.humTriggered) {
        synthesizeSound('hum');
        overlay.humTriggered = true;
        document.getElementById("entry-loader-container").classList.add("reveal-active");
      }

      // T = 600ms - 1300ms: Pre-eruption digital glitch blips
      if (elapsed >= 600 && elapsed < 1400) {
        if (!overlay.lastCrackle || elapsed - overlay.lastCrackle > 250) {
          synthesizeSound('glitch_beep');
          overlay.lastCrackle = elapsed;
        }
      }
      
      // T = 1500ms: System Online Eruption!
      if (elapsed >= 1500 && !overlay.blastTriggered) {
        synthesizeSound('system_online');
        overlay.blastTriggered = true;

        // Spawn a burst of particles on the screen edges moving along the perimeter
        for (let i = 0; i < 25; i++) {
          let px, py, pvx, pvy;
          const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
          const margin = 45; // safe margin from screen edge
          const baseSpeed = Math.random() * 4 + 2; // speed along the edge
          
          if (edge === 0) { // Top edge
            px = Math.random() * canvas.width;
            py = margin + Math.random() * 15;
            pvx = (Math.random() > 0.5 ? 1 : -1) * baseSpeed;
            pvy = (Math.random() - 0.5) * 0.5;
          } else if (edge === 1) { // Right edge
            px = canvas.width - margin - Math.random() * 15;
            py = Math.random() * canvas.height;
            pvx = (Math.random() - 0.5) * 0.5;
            pvy = (Math.random() > 0.5 ? 1 : -1) * baseSpeed;
          } else if (edge === 2) { // Bottom edge
            px = Math.random() * canvas.width;
            py = canvas.height - margin - Math.random() * 15;
            pvx = (Math.random() > 0.5 ? 1 : -1) * baseSpeed;
            pvy = (Math.random() - 0.5) * 0.5;
          } else { // Left edge
            px = margin + Math.random() * 15;
            py = Math.random() * canvas.height;
            pvx = (Math.random() - 0.5) * 0.5;
            pvy = (Math.random() > 0.5 ? 1 : -1) * baseSpeed;
          }
          
          const pColor = i % 3 === 0 ? "#06b6d4" : (i % 3 === 1 ? "#a855f7" : "#ffffff");
          particles.push(new Particle(px, py, pColor, pvx, pvy));
        }
        
        // Reveal subtitle label
        document.getElementById("entry-subtitle").classList.add("reveal-active");
      }
      
      // Update & Draw coding syntax particles
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });
      particles = particles.filter(p => p.alpha > 0); // Re-enable filter to allow fading out
      
      if (elapsed < 3400) {
        requestAnimationFrame(loop);
      } else {
        // End animation sequence
        window.removeEventListener("resize", resize);
        overlay.style.opacity = "0";
        setTimeout(() => {
          overlay.remove();
          if (typeof onComplete === "function") {
            onComplete();
          }
        }, 600);
      }
    }
    
    // Start loop
    requestAnimationFrame(loop);
  };
})();
