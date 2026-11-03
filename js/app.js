// --- app.js ---
/**
 * SwachhLens Main Orchestrator & View Controller
 * Coordinates cross-platform view modes, dark/light theme switching,
 * toast notifications, and global event listeners.
 */

const App = {
  currentView: 'portal',
  currentTheme: 'light',

  init() {
    this.initTheme();
    this.initViewModeTabs();
    this.initGlobalShortcuts();

    // Initialize all sub-modules
    if (typeof CitizenApp !== 'undefined') CitizenApp.init();
    if (typeof MunicipalPortal !== 'undefined') MunicipalPortal.init();
    if (typeof FieldCrewApp !== 'undefined') FieldCrewApp.init();
    if (typeof Auth !== 'undefined') Auth.init();

    if (window.lucide) {
      lucide.createIcons();
    }

    console.log('SwachhLens AI Waste Response Decision Support System Initialized.');
  },

  initTheme() {
    const savedTheme = localStorage.getItem('swachhlens-theme') || 'light';
    this.setTheme(savedTheme);
  },

  setTheme(theme) {
    this.currentTheme = theme;
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('swachhlens-theme', theme);

    const moonIcon = document.getElementById('theme-icon-moon');
    const sunIcon = document.getElementById('theme-icon-sun');
    const modeText = document.getElementById('theme-mode-text');

    if (theme === 'dark') {
      if (moonIcon) moonIcon.classList.add('hidden');
      if (sunIcon) sunIcon.classList.remove('hidden');
      if (modeText) modeText.textContent = 'Light';
    } else {
      if (moonIcon) moonIcon.classList.remove('hidden');
      if (sunIcon) sunIcon.classList.add('hidden');
      if (modeText) modeText.textContent = 'Dark';
    }

    if (window.lucide) {
      lucide.createIcons();
    }

    // Refresh GIS Map Tiles if initialized
    if (typeof MunicipalPortal !== 'undefined' && MunicipalPortal.updateMapTiles) {
      MunicipalPortal.updateMapTiles();
    }
  },

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}`, 'info');
  },

  initViewModeTabs() {
    document.querySelectorAll('.view-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const viewMode = btn.getAttribute('data-view');
        this.setViewMode(viewMode);
      });
    });
  },

  setViewMode(viewMode) {
    this.currentView = viewMode;

    // Manage Full-Page Login mode vs Authenticated Application mode
    if (viewMode === 'login') {
      document.body.classList.add('login-mode-active');
    } else {
      document.body.classList.remove('login-mode-active');
    }

    document.querySelectorAll('.view-tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-view') === viewMode);
    });

    document.querySelectorAll('.app-view').forEach(v => {
      v.classList.remove('active-view');
    });

    const targetView = document.getElementById(`${viewMode}-view`);
    if (targetView) {
      targetView.classList.add('active-view');
    }

    // Refresh layout-specific widgets
    if (viewMode === 'portal') {
      setTimeout(() => {
        if (typeof MunicipalPortal !== 'undefined' && MunicipalPortal.map) {
          MunicipalPortal.map.invalidateSize();
        }
      }, 150);
    } else if (viewMode === 'citizen') {
      if (typeof CitizenApp !== 'undefined') CitizenApp.initCaptureScreen();
    } else if (viewMode === 'crew') {
      if (typeof FieldCrewApp !== 'undefined') FieldCrewApp.renderJobsList();
    } else if (viewMode === 'login') {
      if (typeof Auth !== 'undefined' && Auth.selectLoginPersona) {
        Auth.selectLoginPersona(Auth.selectedLoginRole || 'officer');
      }
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  },

  refreshAllViews() {
    if (typeof MunicipalPortal !== 'undefined') {
      MunicipalPortal.renderQueueTable();
      MunicipalPortal.renderSidebarIncidents();
      MunicipalPortal.renderMapLayers();
      MunicipalPortal.renderVerificationHub();
      MunicipalPortal.renderAuditLogs();
      MunicipalPortal.updateKPIs();
    }

    if (typeof CitizenApp !== 'undefined') {
      CitizenApp.renderHomeReports();
      CitizenApp.renderFullReports();
    }

    if (typeof FieldCrewApp !== 'undefined') {
      FieldCrewApp.renderJobsList();
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  },

  initGlobalShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (typeof MunicipalPortal !== 'undefined') MunicipalPortal.closeDrawer();
        if (typeof Auth !== 'undefined') Auth.closeLoginModal();
        if (typeof Walkthrough !== 'undefined') Walkthrough.stop();
        if (typeof AIAssistant !== 'undefined' && AIAssistant.isOpen) AIAssistant.toggle();
      }
    });

    // Initialize Ambient Background Grid
    AmbientCyberGrid.init();
  }
};

/**
 * Universal Global Toast Notification Helper
 */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconName = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-octagon' : type === 'warning' ? 'alert-triangle' : 'info';
  toast.innerHTML = `<i data-lucide="${iconName}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  if (window.lucide) lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 200ms ease';
    setTimeout(() => toast.remove(), 200);
  }, 3200);
}

/**
 * ============================================================================
 * AMBIENT CYBERNETIC 3D PARTICLE MESH (BACKGROUND FX)
 * Creates a subtle, high-tech floating particle constellation in the background.
 * ============================================================================
 */
const AmbientCyberGrid = {
  canvas: null,
  ctx: null,
  particles: [],
  mouse: { x: -1000, y: -1000 },

  init() {
    if (document.getElementById('ambient-cyber-canvas')) return;

    this.canvas = document.createElement('canvas');
    this.canvas.id = 'ambient-cyber-canvas';
    this.canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.35;';
    document.body.prepend(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.resize();
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.createParticles();
    this.animate();
  },

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  createParticles() {
    this.particles = [];
    const count = Math.floor(window.innerWidth / 30);
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 1.2 + Math.random() * 1.8,
        baseAlpha: 0.2 + Math.random() * 0.5
      });
    }
  },

  animate() {
    requestAnimationFrame(() => this.animate());
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const isDark = document.body.classList.contains('theme-dark');
    const color = isDark ? '56, 189, 248' : '16, 185, 129';

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      // Mouse repulsion/interaction
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        p.x -= (dx / dist) * 1.5;
        p.y -= (dy / dist) * 1.5;
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${color}, ${p.baseAlpha})`;
      this.ctx.fill();

      // Connect near particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const distP = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (distP < 95) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(${color}, ${(1 - distP / 95) * 0.18})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    }
  }
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

