/* ==========================================================================
   VELUME STUDIOS - CALM LIQUID METAL RIPPLE ENGINE (T-1000)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAuroraBackground();
});

/* ==========================================================================
   1. HIGH-PERFORMANCE INTERACTIVE AURORA CANVAS
   ========================================================================== */

function initAuroraBackground() {
  const canvas = document.getElementById('aurora-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;

  // Track pointer state (handles mouse & touch events natively)
  const pointer = { 
    x: -1000, 
    y: -1000, 
    down: false, 
    lastX: -1000, 
    lastY: -1000 
  };
  
  // Floating Color Clouds (Liquid Metal Surface Nodes)
  const clouds = [];
  const cloudCount = 6;
  
  // Ultra-subtle, deep metallic purply-pink color spectrum (very low base alphas)
  const colors = [
    { r: 167, g: 139, b: 250, a: 0.12 },   /* Violet Sheen */
    { r: 244, g: 114, b: 182, a: 0.09 },   /* Pink Sheen */
    { r: 139, g: 92, b: 246, a: 0.11 },    /* Deep Indigo */
    { r: 192, g: 132, b: 252, a: 0.10 },   /* Soft Orchid */
    { r: 236, g: 72, b: 153, a: 0.13 },    /* Magenta Glow */
    { r: 79, g: 70, b: 229, a: 0.08 }      /* Slate Indigo */
  ];

  let lastWidth = 0;
  let lastHeight = 0;

  // Setup Responsive Canvas size
  function resize() {
    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;

    // Mobile optimization: Bypass canvas recreations for address bar toolbar collapses
    if (currentWidth === lastWidth && Math.abs(currentHeight - lastHeight) < 120) {
      return;
    }

    lastWidth = currentWidth;
    lastHeight = currentHeight;

    width = currentWidth;
    height = currentHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Re-initialize nodes on start/resize
    if (clouds.length === 0) {
      for (let i = 0; i < cloudCount; i++) {
        const baseColor = colors[i % colors.length];
        clouds.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.08,
          radius: Math.random() * (width * 0.28) + width * 0.2,
          baseRadius: Math.random() * (width * 0.28) + width * 0.2,
          color: baseColor,
          alpha: baseColor.a,
          angle: Math.random() * Math.PI * 2,
          pulseSpeed: 0.0005 + Math.random() * 0.001,
          stretchFactor: 1.0,
          stretchAngle: 0
        });
      }
    } else {
      clouds.forEach(cloud => {
        if (!cloud.isTemporary) {
          cloud.radius = Math.random() * (width * 0.28) + width * 0.2;
          cloud.baseRadius = cloud.radius;
        }
      });
    }
  }

  // Inject a temporary, ghostly mercury smudge trail on drag
  function injectMercuryTrail(x, y, isSingularityCore = false) {
    const isPink = Math.random() > 0.45;
    const color = isPink 
      ? { r: 244, g: 114, b: 182 }  // Faint Pink smear
      : { r: 167, g: 139, b: 250 }; // Faint Violet smear

    clouds.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 0.05,
      vy: (Math.random() - 0.5) * 0.05,
      radius: isSingularityCore ? width * 0.04 : width * 0.02,
      targetRadius: isSingularityCore ? width * 0.12 : width * 0.08,
      color: color,
      alpha: isSingularityCore ? 0.08 : 0.025, // Faint, ghostly alphas
      decay: isSingularityCore ? 0.0025 : 0.0045,
      isTemporary: true,
      isGravityCenter: isSingularityCore,
      stretchFactor: 1.0,
      stretchAngle: 0
    });
  }

  // Render Loop
  function animate() {
    // Clean Liquid Metal Base
    ctx.fillStyle = '#030008';
    ctx.fillRect(0, 0, width, height);

    // Draw alignment grid coordinates (extremely faint)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.004)';
    const spacing = 120;
    for (let x = spacing; x < width; x += spacing) {
      for (let y = spacing; y < height; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 0.75, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Dynamic Physics Calculations
    if (pointer.down) {
      // 1. Gentle, liquid surface tension pull on background nodes
      clouds.forEach(cloud => {
        if (cloud.isTemporary) return;

        const dx = pointer.x - cloud.x; // Vector pointing TOWARDS cursor/finger
        const dy = pointer.y - cloud.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxGravityDist = Math.max(width, height) * 0.65;

        if (dist < maxGravityDist) {
          const proximity = 1 - dist / maxGravityDist;
          
          // T-1000 Ripple: very subtle, slow surface shift (force 0.45 max)
          const force = proximity * 0.45;
          const angle = Math.atan2(dy, dx);
          cloud.vx += Math.cos(angle) * force;
          cloud.vy += Math.sin(angle) * force;
          
          // Gentle surface viscosity (high fluid drag)
          const drag = 0.96 - (proximity * 0.06); // ranges down to 0.90
          cloud.vx *= drag;
          cloud.vy *= drag;

          // Subtle organic stretch (max 6% elongation)
          cloud.stretchAngle = angle;
          cloud.stretchFactor += (1.0 + (proximity * 0.06) - cloud.stretchFactor) * 0.08;
        }
      });

      // 2. Periodically inject subtle trail smudges as pointer moves
      const travelDist = Math.sqrt(
        Math.pow(pointer.x - pointer.lastX, 2) + 
        Math.pow(pointer.y - pointer.lastY, 2)
      );
      if (travelDist > 20) {
        injectMercuryTrail(pointer.x, pointer.y, false);
        pointer.lastX = pointer.x;
        pointer.lastY = pointer.y;
      }
    }

    // Move, stretch, and Draw all clouds (including temporary trail nodes)
    for (let i = clouds.length - 1; i >= 0; i--) {
      const cloud = clouds[i];
      
      cloud.x += cloud.vx;
      cloud.y += cloud.vy;

      // Dampen velocity back to drift speed
      cloud.vx *= 0.97;
      cloud.vy *= 0.97;

      // Extremely slow and smooth float drift
      const speed = Math.sqrt(cloud.vx * cloud.vx + cloud.vy * cloud.vy);
      if (speed < 0.04 && !cloud.isTemporary) {
        cloud.vx += (Math.random() - 0.5) * 0.008;
        cloud.vy += (Math.random() - 0.5) * 0.008;
      }

      // Elastic border bounds
      const buffer = 180;
      if (cloud.x < -buffer) cloud.vx += 0.015;
      if (cloud.x > width + buffer) cloud.vx -= 0.015;
      if (cloud.y < -buffer) cloud.vy += 0.015;
      if (cloud.y > height + buffer) cloud.vy -= 0.015;

      // Handle pulsing or implosion decays
      if (!cloud.isTemporary) {
        cloud.angle += cloud.pulseSpeed;
        
        // Relax back to circle shape slowly
        cloud.stretchFactor += (1.0 - cloud.stretchFactor) * 0.02;
        
        // Faint rhythmic pulse
        const targetBRadius = cloud.baseRadius + Math.sin(cloud.angle) * 15;
        cloud.radius += (targetBRadius - cloud.radius) * 0.01;
      } else {
        if (cloud.isGravityCenter) {
          cloud.targetRadius *= 0.985;
          cloud.radius += (cloud.targetRadius - cloud.radius) * 0.04;
        } else {
          cloud.radius += (cloud.targetRadius - cloud.radius) * 0.015;
        }
        
        cloud.alpha -= cloud.decay;
        if (cloud.alpha <= 0 || (cloud.isGravityCenter && cloud.radius < 2)) {
          clouds.splice(i, 1);
          continue;
        }
      }

      // Physics variables for volume-preserving stretching
      const rx = cloud.radius * cloud.stretchFactor; // Stretch major axis
      const ry = cloud.radius / cloud.stretchFactor; // Compress minor axis
      const rotation = cloud.stretchAngle;
      
      const currentAlpha = cloud.alpha;
      const c = cloud.color;

      // ==========================================================================
      // THREE-LAYER ULTRA-SUBTLE VOLUMETRIC METALLIC SHADING
      // ==========================================================================

      // Layer 1: Draw Main Gaseous Base
      const grad = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, rx);
      grad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, ${currentAlpha})`);
      grad.addColorStop(0.7, `rgba(${c.r - 20}, ${c.g - 30}, ${c.b + 10}, ${currentAlpha * 0.4})`);
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cloud.x, cloud.y, rx, ry, rotation, 0, Math.PI * 2);
      ctx.fill();

      // Layer 2: Reflective Metallic Mid-Core (very soft, shifted top-left)
      const cx = cloud.x - rx * 0.08;
      const cy = cloud.y - ry * 0.08;
      const crx = rx * 0.65;
      const cry = ry * 0.65;
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, crx);
      coreGrad.addColorStop(0, `rgba(255, 180, 245, ${currentAlpha * 0.28})`); // Soft pink rim glow
      coreGrad.addColorStop(0.6, `rgba(${c.r + 20}, ${c.g}, ${c.b}, ${currentAlpha * 0.12})`);
      coreGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, crx, cry, rotation, 0, Math.PI * 2);
      ctx.fill();

      // Layer 3: Faint Specular Highlight (very soft, shifted top-left chrome reflection)
      const hx = cloud.x - rx * 0.22;
      const hy = cloud.y - ry * 0.22;
      const hrx = rx * 0.22;
      const hry = ry * 0.22;
      const highlightGrad = ctx.createRadialGradient(hx, hy, 0, hx, hy, hrx);
      highlightGrad.addColorStop(0, `rgba(255, 255, 255, ${currentAlpha * 0.35})`); // 35% max opacity specular flash
      highlightGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = highlightGrad;
      ctx.beginPath();
      ctx.ellipse(hx, hy, hrx, hry, rotation, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  // Pointer Interaction Bindings
  window.addEventListener('pointerdown', (e) => {
    // Prevent dragging canvas nodes when manipulating the corner widgets
    if (e.target.closest('#soundscape-widget-wrapper') || e.target.closest('#project-widget-wrapper')) return;
    
    pointer.down = true;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.lastX = e.clientX;
    pointer.lastY = e.clientY;
    
    // Inject gentle gravity core on click
    injectMercuryTrail(e.clientX, e.clientY, true);
  });

  window.addEventListener('pointermove', (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  });

  window.addEventListener('pointerup', () => {
    pointer.down = false;
  });

  window.addEventListener('pointercancel', () => {
    pointer.down = false;
  });

  // Initialize
  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(animate);
}

/* ==========================================================================
   2. BOUTIQUE SOUNDSCAPE AUDIO SYSTEM (NOSNIKWAH ECOSYSTEM)
   ========================================================================== */

const SOUNDSCAPE_TRACKS = {
  marigold: {
    id: 'marigold',
    name: 'Marigold Lofi',
    file: './nosnikwah/marigold_lofi.mp3'
  },
  notmysun: {
    id: 'notmysun',
    name: 'Not My Sun (Smokey Jazz)',
    file: './nosnikwah/Not My Sun (LowFi Smokey Jazz Mix).mp3'
  },
  wetpavement: {
    id: 'wetpavement',
    name: 'Wet Pavement Zen',
    file: './nosnikwah/Wet Pavement Zen.mp3'
  },
  stonewater: {
    id: 'stonewater',
    name: 'Stonewater Hymn',
    file: './nosnikwah/Stonewater Hymn.mp3'
  },
  velvet: {
    id: 'velvet',
    name: 'Velvet Pressure',
    file: './nosnikwah/Velvet Pressure.mp3'
  },
  harmonic: {
    id: 'harmonic',
    name: 'Harmonic Safety',
    file: './nosnikwah/Harmonic Safety.mp3'
  }
};

let activeTrack = null;
let audioPlayer = null;
let isPlayingMusic = false;
let musicVolume = 0.15; // Cozy default volume (15%) matching Lumora

function updateWidgetPlayingState(isPlaying) {
  const toggleBtn = document.getElementById('soundscape-toggle');
  if (!toggleBtn) return;

  if (isPlaying) {
    toggleBtn.classList.add('playing');
  } else {
    toggleBtn.classList.remove('playing');
  }
}

function toggleWidgetMenu() {
  const wrapper = document.getElementById('soundscape-widget-wrapper');
  const menu = document.getElementById('soundscape-menu');
  if (!wrapper) return;

  const isExpanded = wrapper.classList.contains('expanded');
  if (!isExpanded) {
    // Collapse project widget menu
    const projectWrapper = document.getElementById('project-widget-wrapper');
    const projectMenu = document.getElementById('project-menu');
    if (projectWrapper && projectWrapper.classList.contains('expanded')) {
      projectWrapper.classList.remove('expanded');
      if (projectMenu) projectMenu.setAttribute('aria-hidden', 'true');
    }

    wrapper.classList.add('expanded');
    if (menu) menu.removeAttribute('aria-hidden');
  } else {
    wrapper.classList.remove('expanded');
    if (menu) menu.setAttribute('aria-hidden', 'true');
  }
}

function toggleProjectMenu() {
  const wrapper = document.getElementById('project-widget-wrapper');
  const menu = document.getElementById('project-menu');
  if (!wrapper) return;

  const isExpanded = wrapper.classList.contains('expanded');
  if (!isExpanded) {
    // Collapse soundscape widget menu
    const soundscapeWrapper = document.getElementById('soundscape-widget-wrapper');
    const soundscapeMenu = document.getElementById('soundscape-menu');
    if (soundscapeWrapper && soundscapeWrapper.classList.contains('expanded')) {
      soundscapeWrapper.classList.remove('expanded');
      if (soundscapeMenu) soundscapeMenu.setAttribute('aria-hidden', 'true');
    }

    wrapper.classList.add('expanded');
    if (menu) menu.removeAttribute('aria-hidden');
  } else {
    wrapper.classList.remove('expanded');
    if (menu) menu.setAttribute('aria-hidden', 'true');
  }
}

function toggleProjectDetail(projectId) {
  const targetItem = document.getElementById(`item-${projectId}`);
  if (!targetItem) return;

  const isExpanded = targetItem.classList.contains('expanded');
  
  // Collapse all project items first
  document.querySelectorAll('.project-item').forEach(item => {
    item.classList.remove('expanded');
    const btn = item.querySelector('.project-item-title');
    const detail = item.querySelector('.project-detail');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (detail) detail.setAttribute('aria-hidden', 'true');
  });

  // Toggle state of clicked item
  if (!isExpanded) {
    targetItem.classList.add('expanded');
    const btn = targetItem.querySelector('.project-item-title');
    const detail = targetItem.querySelector('.project-detail');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    if (detail) detail.setAttribute('aria-hidden', 'false');
  }
}

// Close menus if clicked outside
document.addEventListener('click', (e) => {
  const soundscapeWrapper = document.getElementById('soundscape-widget-wrapper');
  if (soundscapeWrapper && !soundscapeWrapper.contains(e.target) && soundscapeWrapper.classList.contains('expanded')) {
    toggleWidgetMenu();
  }

  const projectWrapper = document.getElementById('project-widget-wrapper');
  if (projectWrapper && !projectWrapper.contains(e.target) && projectWrapper.classList.contains('expanded')) {
    toggleProjectMenu();
  }
});

function selectTrack(trackId) {
  const track = SOUNDSCAPE_TRACKS[trackId];
  if (!track) return;

  // Toggle play/pause if the same track is clicked
  if (activeTrack && activeTrack.id === trackId) {
    toggleMusic();
    return;
  }

  // Clear visual states for all buttons
  document.querySelectorAll('.soundscape-btn').forEach(btn => {
    btn.classList.remove('active', 'playing', 'error');
  });
  document.querySelectorAll('.soundscape-btn-dot').forEach(dot => {
    dot.style.display = 'none';
  });

  if (audioPlayer) {
    audioPlayer.pause();
  }
  updateWidgetPlayingState(false);

  activeTrack = track;
  const btn = document.getElementById(`sbtn-${trackId}`);
  if (btn) btn.classList.add('active');
  
  // Create and launch audio stream
  audioPlayer = new Audio(track.file);
  audioPlayer.loop = true;
  audioPlayer.volume = musicVolume;

  audioPlayer.addEventListener('canplay', () => {
    if (btn) {
      btn.classList.remove('error');
      btn.classList.add('playing');
    }
    const dot = document.getElementById(`dot-${trackId}`);
    if (dot) dot.style.display = 'flex';
    isPlayingMusic = true;
    updateWidgetPlayingState(true);
  });

  audioPlayer.addEventListener('error', (e) => {
    console.warn("Audio load error:", e);
    if (btn) btn.classList.remove('playing', 'active');
    if (btn) btn.classList.add('error');
    const dot = document.getElementById(`dot-${trackId}`);
    if (dot) dot.style.display = 'none';
    isPlayingMusic = false;
    updateWidgetPlayingState(false);
  });

  audioPlayer.play().then(() => {
    // Play resolved
  }).catch(err => {
    console.warn("Autoplay blocked:", err);
    if (btn) btn.classList.add('error');
    isPlayingMusic = false;
    updateWidgetPlayingState(false);
  });
}

function toggleMusic() {
  if (!audioPlayer || !activeTrack) return;
  const btn = document.getElementById(`sbtn-${activeTrack.id}`);

  if (isPlayingMusic) {
    audioPlayer.pause();
    if (btn) btn.classList.remove('playing');
    isPlayingMusic = false;
    updateWidgetPlayingState(false);
  } else {
    audioPlayer.play().then(() => {
      if (btn) btn.classList.add('playing');
      isPlayingMusic = true;
      updateWidgetPlayingState(true);
    }).catch(err => {
      console.warn("Trigger failed:", err);
      if (btn) btn.classList.add('error');
      updateWidgetPlayingState(false);
    });
  }
}

