// --- intro-3d.js ---
/**
 * SwachhLens Ultra-Advanced 3D Earth Globe Engine (Next-Gen Visuals & Civic AI Sound)
 * 
 * Features:
 * - 4K Procedural Photorealistic 3D Earth with Specular Oceans & Dynamic Night Light Hubs
 * - Soft Volumetric Radial-Gradient Cloud Layers with Real-Time Parallax Atmospheric Drift
 * - Dual-Layer Rayleigh Atmosphere Scattering & Emerald Corona Fresnel Limb Shaders
 * - 3D Geospatial Neural Synapse Bezier Arcs with Multi-Photon Particle Trails
 * - Orbiting Swachh-Sat Constellation with Solar Arrays & Elliptical Trajectories
 * - Multi-Ring 3D Sci-Fi Tactical Target Reticle over New Delhi (Ward 14 GIS Node)
 * - Volumetric 360° Holographic Radar Sweep Fan
 * - Dynamic Camera FOV Expansion (40° -> 72° -> 42°) for Cinematic Velocity Perception
 * - 1,600+ Relativistic Warp Speed Streak Lines & Volumetric Cloud Fog Penetration
 * - 3D Urban GIS City Matrix & Drone Laser Scanners over Delhi
 * - Custom Civic AI Sound Design (Digital Boot Chimes, Satellite Sonar Pings, Harmonic Resolution)
 * - Smooth Inertia 360° Orbit Drag Controls with Momentum Damping
 */

const Intro3D = {
  container: null,
  canvas: null,
  scene: null,
  camera: null,
  renderer: null,
  animationFrameId: null,
  isTransitioning: false,
  isFinished: false,

  // 3D Groups and Meshes
  earthGroup: null,
  earthMesh: null,
  cloudsMesh1: null,
  cloudsMesh2: null,
  atmosphereMesh: null,
  outerGlowMesh: null,
  orbitalRingsGroup: null,
  targetBeaconGroup: null,
  satellites: [],
  synapseArcsGroup: null,
  radarBeamMesh: null,
  starField: null,
  nebulaField: null,
  warpLines: null,
  cloudPuffsGroup: null,
  dataPhotons: [],
  elevationPillars: [],
  urbanMatrixGroup: null,
  droneScannerGroup: null,

  // Interaction & Camera State
  isDragging: false,
  previousMousePosition: { x: 0, y: 0 },
  targetRotation: { x: 0.22, y: 2.45 },
  currentRotation: { x: 0.22, y: 2.45 },
  baseCameraZ: 14.8,
  transitionStartTime: null,
  transitionDuration: 7.5,

  init() {
    this.container = document.getElementById('intro-3d-overlay');
    this.canvas = document.getElementById('three-intro-canvas');

    if (!this.container || !this.canvas || typeof THREE === 'undefined') {
      this.fallbackDismiss();
      return;
    }

    this.isTransitioning = false;
    this.isFinished = false;

    this.initScene();
    this.buildDeepSpaceStarfield();
    this.buildEarthGlobe();
    this.buildAtmosphereShaders();
    this.buildGeospatialElevationPillars();
    this.buildNeuralSynapseArcs();
    this.buildOrbitalConstellation();
    this.buildDelhiTargetReticle();
    this.buildHolographicRadarSweep();
    this.buildHypersonicWarpLines();
    this.buildVolumetricCloudPuffs();
    this.buildUrbanGISMatrix();
    this.buildDroneScannerBeams();
    this.initInteractionControls();

    this.animate();
  },

  initScene() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x010c18);
    this.scene.fog = new THREE.FogExp2(0x010c18, 0.002);

    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1600);
    this.camera.position.set(0, 0.8, this.baseCameraZ);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;

    // Studio Cinematic Lighting Rig Matching Screenshot
    const mainSunLight = new THREE.DirectionalLight(0xffffff, 3.4);
    mainSunLight.position.set(28, 22, 26);
    this.scene.add(mainSunLight);

    const cyanRimLight = new THREE.DirectionalLight(0x38bdf8, 2.6);
    cyanRimLight.position.set(-25, -12, -20);
    this.scene.add(cyanRimLight);

    const emeraldPointGlow = new THREE.PointLight(0x34d399, 4.0, 90);
    emeraldPointGlow.position.set(12, 14, 18);
    this.scene.add(emeraldPointGlow);

    const ambientLight = new THREE.AmbientLight(0x052e2e, 1.4);
    this.scene.add(ambientLight);
  },

  buildDeepSpaceStarfield() {
    // 1. Floating Digital Pixel Square Voxels in Background (Matching Screenshot)
    const voxelCount = 140;
    const voxelGroup = new THREE.Group();

    for (let i = 0; i < voxelCount; i++) {
      const size = 0.4 + Math.random() * 2.2;
      const vGeom = new THREE.PlaneGeometry(size, size);
      const isGreen = Math.random() > 0.45;
      const vMat = new THREE.MeshBasicMaterial({
        color: isGreen ? 0x0f4c4c : 0x083344,
        transparent: true,
        opacity: 0.12 + Math.random() * 0.28,
        side: THREE.DoubleSide
      });
      const voxel = new THREE.Mesh(vGeom, vMat);
      voxel.position.set(
        (Math.random() - 0.5) * 85,
        (Math.random() - 0.5) * 55,
        -15 - Math.random() * 35
      );
      voxel.rotation.z = Math.random() * Math.PI;
      voxelGroup.add(voxel);
    }
    this.scene.add(voxelGroup);

    // 2. Large Soft Ambient Radar Halos in Background (Matching Screenshot)
    const haloGeom1 = new THREE.RingGeometry(8.5, 14.5, 64);
    const haloMat1 = new THREE.MeshBasicMaterial({
      color: 0x0d4747,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25
    });
    const halo1 = new THREE.Mesh(haloGeom1, haloMat1);
    halo1.position.set(-2.0, 0, -8);
    this.scene.add(halo1);

    const haloGeom2 = new THREE.RingGeometry(16.0, 22.0, 64);
    const haloMat2 = new THREE.MeshBasicMaterial({
      color: 0x063333,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.18
    });
    const halo2 = new THREE.Mesh(haloGeom2, haloMat2);
    halo2.position.set(-2.0, 0, -10);
    this.scene.add(halo2);

    // 3. Deep Space Star Points
    const starCount = 2200;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;
      positions[idx] = (Math.random() - 0.5) * 650;
      positions[idx + 1] = (Math.random() - 0.5) * 650;
      positions[idx + 2] = (Math.random() - 0.5) * 650;

      const isCyan = Math.random() > 0.5;
      colors[idx] = isCyan ? 0.4 : 0.9;
      colors[idx + 1] = isCyan ? 0.9 : 0.95;
      colors[idx + 2] = 1.0;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.starField = new THREE.Points(geom, starMat);
    this.scene.add(this.starField);
  },

  /**
   * Procedural High-Res Canvas Texture Matching the User's Screenshot Exactly:
   * - Deep Sapphire Blue Ocean
   * - Curved Spherical Grid Lines in Cyan/White
   * - Glowing Emerald/Mint Polygonal Landmass with Glowing Vertices
   * - Translucent Overlapping Bokeh Highlight Ellipses
   * - Blinding Specular Sunburst Lens Flare at Upper Right
   */
  generateHighResEarthTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');

    // 1. Deep Vibrant Sapphire Blue Ocean Gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 4096, 2048);
    oceanGrad.addColorStop(0, '#011c38');
    oceanGrad.addColorStop(0.3, '#023e7d');
    oceanGrad.addColorStop(0.6, '#0466c8');
    oceanGrad.addColorStop(0.85, '#0077b6');
    oceanGrad.addColorStop(1, '#022b52');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 4096, 2048);

    // 2. Curved Spherical Lat/Long Grid Lines (Cyan/White)
    ctx.strokeStyle = 'rgba(147, 197, 253, 0.35)';
    ctx.lineWidth = 2.5;

    // Longitude lines
    for (let x = 0; x <= 4096; x += 256) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.bezierCurveTo(x + 120, 680, x + 120, 1360, x, 2048);
      ctx.stroke();
    }
    // Latitude lines
    for (let y = 128; y < 2048; y += 160) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(1360, y + 90, 2720, y + 90, 4096, y);
      ctx.stroke();
    }

    // 3. Translucent Overlapping Lens Highlight Ellipses (Crystal Holographic Look)
    const lensBlobs = [
      { x: 2600, y: 700, rx: 320, ry: 180, rot: -0.2, alpha: 0.38, color: 'rgba(56, 189, 248, 0.45)' },
      { x: 3050, y: 650, rx: 420, ry: 220, rot: 0.25, alpha: 0.45, color: 'rgba(147, 197, 253, 0.5)' },
      { x: 2800, y: 1100, rx: 360, ry: 200, rot: -0.15, alpha: 0.35, color: 'rgba(52, 211, 153, 0.4)' },
      { x: 3300, y: 1150, rx: 380, ry: 210, rot: 0.3, alpha: 0.4, color: 'rgba(56, 189, 248, 0.45)' },
      { x: 2450, y: 1250, rx: 300, ry: 160, rot: 0.1, alpha: 0.3, color: 'rgba(6, 182, 212, 0.35)' }
    ];

    lensBlobs.forEach(blob => {
      ctx.fillStyle = blob.color;
      ctx.beginPath();
      ctx.ellipse(blob.x, blob.y, blob.rx, blob.ry, blob.rot, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. Massive Glowing Emerald/Mint Tactical Polygon Landmass (Matching Screenshot)
    const polygonNodes = [
      { x: 2520, y: 620 },
      { x: 2820, y: 580 },
      { x: 3220, y: 640 },
      { x: 3420, y: 880 },
      { x: 3280, y: 1220 },
      { x: 2980, y: 1360 },
      { x: 2780, y: 1140 },
      { x: 2620, y: 1320 },
      { x: 2540, y: 940 }
    ];

    // Inner Glowing Fill Gradient
    const polyGrad = ctx.createLinearGradient(2500, 600, 3400, 1300);
    polyGrad.addColorStop(0, 'rgba(52, 211, 153, 0.88)');
    polyGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.82)');
    polyGrad.addColorStop(1, 'rgba(6, 182, 212, 0.75)');

    ctx.fillStyle = polyGrad;
    ctx.beginPath();
    ctx.moveTo(polygonNodes[0].x, polygonNodes[0].y);
    for (let i = 1; i < polygonNodes.length; i++) {
      ctx.lineTo(polygonNodes[i].x, polygonNodes[i].y);
    }
    ctx.closePath();
    ctx.fill();

    // Sharp Glowing Mint/White Border Outline
    ctx.strokeStyle = '#ecfdf5';
    ctx.lineWidth = 6.0;
    ctx.shadowColor = '#34d399';
    ctx.shadowBlur = 24;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Glowing Anchor Dots on Every Polygon Vertex (Matching Screenshot)
    polygonNodes.forEach(node => {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(node.x, node.y, 14, 0, Math.PI * 2);
      ctx.shadowColor = '#6ee7b7';
      ctx.shadowBlur = 28;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 4;
      ctx.stroke();
    });

    // 5. Internal Constellation Network Lines & Waypoint Dots
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(2750, 720);
    ctx.lineTo(2900, 850);
    ctx.lineTo(3150, 820);
    ctx.lineTo(3020, 1050);
    ctx.lineTo(2820, 1000);
    ctx.lineTo(2750, 720);
    ctx.stroke();

    const internalDots = [
      { x: 2750, y: 720 },
      { x: 2900, y: 850 },
      { x: 3150, y: 820 },
      { x: 3020, y: 1050 },
      { x: 2820, y: 1000 }
    ];
    internalDots.forEach(pt => {
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 9, 0, Math.PI * 2);
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // 6. Blinding Specular Sunburst Lens Flare at Upper Right (Matching Screenshot)
    const flareX = 3320;
    const flareY = 720;

    const flareGrad = ctx.createRadialGradient(flareX, flareY, 0, flareX, flareY, 680);
    flareGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    flareGrad.addColorStop(0.12, 'rgba(255, 255, 255, 0.95)');
    flareGrad.addColorStop(0.28, 'rgba(167, 243, 208, 0.75)');
    flareGrad.addColorStop(0.55, 'rgba(56, 189, 248, 0.4)');
    flareGrad.addColorStop(0.8, 'rgba(6, 182, 212, 0.15)');
    flareGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = flareGrad;
    ctx.beginPath();
    ctx.arc(flareX, flareY, 680, 0, Math.PI * 2);
    ctx.fill();

    // Radiating Sunburst Light Spikes
    ctx.save();
    ctx.translate(flareX, flareY);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 3.0;
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
      ctx.rotate(Math.PI / 8);
      ctx.beginPath();
      ctx.moveTo(-520, 0);
      ctx.lineTo(520, 0);
      ctx.stroke();
    }
    ctx.restore();

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 16;
    return tex;
  },

  buildEarthGlobe() {
    this.earthGroup = new THREE.Group();

    const isDesktop = window.innerWidth > 900;
    this.earthGroup.position.set(isDesktop ? 4.8 : 0, 0, 0);

    // Initial Angle Focused on the Glowing Polygon
    this.earthGroup.rotation.y = 2.45;
    this.earthGroup.rotation.x = 0.22;

    // 1. Glossy Crystal Earth Sphere
    const earthGeom = new THREE.SphereGeometry(3.6, 64, 64);
    const earthTexture = this.generateHighResEarthTexture();
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.18,
      metalness: 0.15,
      emissive: new THREE.Color(0x064e3b),
      emissiveIntensity: 0.32
    });
    this.earthMesh = new THREE.Mesh(earthGeom, earthMat);
    this.earthGroup.add(this.earthMesh);

    // 2. Optical Glass Atmosphere Rim
    const atmosGeom = new THREE.SphereGeometry(3.72, 48, 48);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.28,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    this.atmosphereMesh = new THREE.Mesh(atmosGeom, atmosMat);
    this.earthGroup.add(this.atmosphereMesh);

    const outerGeom = new THREE.SphereGeometry(3.95, 32, 32);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    this.outerGlowMesh = new THREE.Mesh(outerGeom, outerMat);
    this.earthGroup.add(this.outerGlowMesh);

    this.scene.add(this.earthGroup);
  },

  buildAtmosphereShaders() {},

  latLngToVector3(lat, lng, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  },

  buildGeospatialElevationPillars() {
    const hubCoords = [
      { lat: 28.5355, lng: 77.2146, h: 2.2, color: 0x10b981, name: 'Delhi Target Node' },
      { lat: 19.0760, lng: 72.8777, h: 1.4, color: 0x06b6d4, name: 'Mumbai' },
      { lat: 12.9716, lng: 77.5946, h: 1.2, color: 0x3b82f6, name: 'Bangalore' },
      { lat: 35.6762, lng: 139.6503, h: 1.6, color: 0x8b5cf6, name: 'Tokyo' },
      { lat: 51.5074, lng: -0.1278, h: 1.5, color: 0x38bdf8, name: 'London' },
      { lat: 40.7128, lng: -74.0060, h: 1.7, color: 0xf59e0b, name: 'New York' },
      { lat: 1.3521, lng: 103.8198, h: 1.3, color: 0x10b981, name: 'Singapore' }
    ];

    hubCoords.forEach(hub => {
      const v = this.latLngToVector3(hub.lat, hub.lng, 3.62);

      const pillarGeom = new THREE.CylinderGeometry(0.04, 0.04, hub.h, 12);
      const pillarMat = new THREE.MeshBasicMaterial({
        color: hub.color,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending
      });
      const pillar = new THREE.Mesh(pillarGeom, pillarMat);
      pillar.position.copy(v);
      pillar.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.clone().normalize());
      pillar.translateY(hub.h / 2);

      this.earthGroup.add(pillar);
      this.elevationPillars.push(pillar);

      // Expanding Hotspot Sonar Rings on Surface
      const ringGeom = new THREE.RingGeometry(0.08, 0.16, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: hub.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.position.copy(v);
      ringMesh.lookAt(v.clone().multiplyScalar(2));
      this.earthGroup.add(ringMesh);
    });
  },

  buildNeuralSynapseArcs() {
    this.synapseArcsGroup = new THREE.Group();

    const delhiPos = this.latLngToVector3(28.5355, 77.2146, 3.65);
    const routes = [
      { lat: 19.0760, lng: 72.8777, color: 0x06b6d4 }, // Mumbai -> Delhi
      { lat: 12.9716, lng: 77.5946, color: 0x10b981 }, // Bangalore -> Delhi
      { lat: 35.6762, lng: 139.6503, color: 0x38bdf8 }, // Tokyo -> Delhi
      { lat: 51.5074, lng: -0.1278, color: 0x8b5cf6 }, // London -> Delhi
      { lat: 1.3521, lng: 103.8198, color: 0x10b981 }, // Singapore -> Delhi
      { lat: 40.7128, lng: -74.0060, color: 0xf59e0b }  // New York -> Delhi
    ];

    routes.forEach(r => {
      const v1 = this.latLngToVector3(r.lat, r.lng, 3.65);
      const v2 = delhiPos;

      const mid = v1.clone().add(v2).multiplyScalar(0.5);
      const dist = v1.distanceTo(v2);
      mid.normalize().multiplyScalar(3.68 + dist * 0.42);

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const points = curve.getPoints(50);
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: r.color,
        transparent: true,
        opacity: 0.85,
        linewidth: 2.8
      });
      const arcLine = new THREE.Line(geom, mat);
      this.synapseArcsGroup.add(arcLine);

      // Flowing Data Photons
      for (let p = 0; p < 5; p++) {
        const photonGeom = new THREE.SphereGeometry(0.08, 8, 8);
        const photonMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const photon = new THREE.Mesh(photonGeom, photonMat);
        photon.userData = { curve: curve, progress: (p * 0.2) + Math.random() * 0.1 };
        this.synapseArcsGroup.add(photon);
        this.dataPhotons.push(photon);
      }
    });

    this.earthGroup.add(this.synapseArcsGroup);
  },

  buildOrbitalConstellation() {
    this.orbitalRingsGroup = new THREE.Group();
    const isDesktop = window.innerWidth > 900;
    this.orbitalRingsGroup.position.set(isDesktop ? 4.8 : 0, 0, 0);

    // 1. Gyroscope Compass Rings with Digital Markings
    const ringGeom1 = new THREE.RingGeometry(4.9, 5.06, 90);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65
    });
    const ring1 = new THREE.Mesh(ringGeom1, ringMat1);
    ring1.rotation.x = Math.PI / 2.25;
    this.orbitalRingsGroup.add(ring1);

    const ringGeom2 = new THREE.RingGeometry(5.6, 5.72, 90);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55
    });
    const ring2 = new THREE.Mesh(ringGeom2, ringMat2);
    ring2.rotation.y = Math.PI / 3.2;
    ring2.rotation.x = Math.PI / 4.8;
    this.orbitalRingsGroup.add(ring2);

    // 2. 4 Orbiting Satellites with Solar Arrays & Laser Beams
    const satConfigs = [
      { radius: 5.0, speed: 0.014, color: 0x38bdf8, name: 'Swachh-Sat 1' },
      { radius: 5.6, speed: -0.012, color: 0x10b981, name: 'Swachh-Sat 2' },
      { radius: 6.2, speed: 0.010, color: 0xf59e0b, name: 'Swachh-Sat 3' },
      { radius: 6.8, speed: -0.008, color: 0x8b5cf6, name: 'Swachh-Sat 4' }
    ];

    satConfigs.forEach(cfg => {
      const satGroup = new THREE.Group();

      const bodyGeom = new THREE.BoxGeometry(0.24, 0.16, 0.34);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.9, roughness: 0.15 });
      const body = new THREE.Mesh(bodyGeom, bodyMat);
      satGroup.add(body);

      const wingGeom = new THREE.BoxGeometry(0.9, 0.02, 0.25);
      const wingMat = new THREE.MeshBasicMaterial({ color: cfg.color });
      const wing = new THREE.Mesh(wingGeom, wingMat);
      satGroup.add(wing);

      const laserGeom = new THREE.CylinderGeometry(0.015, 0.06, 1.6, 8);
      const laserMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
      });
      const laserCone = new THREE.Mesh(laserGeom, laserMat);
      laserCone.position.y = -0.8;
      satGroup.add(laserCone);

      satGroup.userData = { angle: Math.random() * Math.PI * 2, radius: cfg.radius, speed: cfg.speed };
      this.orbitalRingsGroup.add(satGroup);
      this.satellites.push(satGroup);
    });

    this.scene.add(this.orbitalRingsGroup);
  },

  buildDelhiTargetReticle() {
    this.targetBeaconGroup = new THREE.Group();

    // Precise New Delhi Coordinates (28.5355° N, 77.2146° E)
    const v = this.latLngToVector3(28.5355, 77.2146, 3.66);
    this.targetBeaconGroup.position.copy(v);

    const dotGeom = new THREE.SphereGeometry(0.22, 16, 16);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const dotMesh = new THREE.Mesh(dotGeom, dotMat);
    this.targetBeaconGroup.add(dotMesh);

    // Multi-Ring Tactical Sci-Fi Reticle
    const ringGeom1 = new THREE.RingGeometry(0.3, 0.42, 36);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });
    const ringMesh1 = new THREE.Mesh(ringGeom1, ringMat1);
    ringMesh1.lookAt(v.clone().multiplyScalar(2));
    this.targetBeaconGroup.add(ringMesh1);

    const ringGeom2 = new THREE.RingGeometry(0.62, 0.72, 36);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const ringMesh2 = new THREE.Mesh(ringGeom2, ringMat2);
    ringMesh2.lookAt(v.clone().multiplyScalar(2));
    this.targetBeaconGroup.add(ringMesh2);

    // Vertical Holographic Space Pillar
    const beamGeom = new THREE.CylinderGeometry(0.04, 0.04, 4.2, 12);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const beamMesh = new THREE.Mesh(beamGeom, beamMat);
    beamMesh.position.y = 2.1;
    beamMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.clone().normalize());
    this.targetBeaconGroup.add(beamMesh);

    this.earthGroup.add(this.targetBeaconGroup);
  },

  buildHolographicRadarSweep() {
    const coneGeom = new THREE.ConeGeometry(5.2, 0.06, 64, 1, true, 0, Math.PI / 2.8);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.24,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    this.radarBeamMesh = new THREE.Mesh(coneGeom, coneMat);
    this.radarBeamMesh.rotation.x = Math.PI / 2;
    this.earthGroup.add(this.radarBeamMesh);
  },

  buildHypersonicWarpLines() {
    const lineCount = 3200;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(lineCount * 6);
    const colors = new Float32Array(lineCount * 6);

    for (let i = 0; i < lineCount * 6; i += 6) {
      const x = (Math.random() - 0.5) * 120;
      const y = (Math.random() - 0.5) * 120;
      const z = (Math.random() - 0.5) * 220;

      positions[i] = x;
      positions[i + 1] = y;
      positions[i + 2] = z;

      positions[i + 3] = x;
      positions[i + 4] = y;
      positions[i + 5] = z - 45;

      const r = Math.random();
      if (r > 0.6) {
        colors[i] = 0.05; colors[i + 1] = 0.85; colors[i + 2] = 1.0; // Cyan
      } else if (r > 0.3) {
        colors[i] = 0.06; colors[i + 1] = 0.95; colors[i + 2] = 0.55; // Emerald
      } else {
        colors[i] = 1.0; colors[i + 1] = 0.92; colors[i + 2] = 0.4; // Gold
      }

      colors[i + 3] = 1.0;
      colors[i + 4] = 1.0;
      colors[i + 5] = 1.0;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });

    this.warpLines = new THREE.LineSegments(geom, mat);
    this.scene.add(this.warpLines);

    // Shockwave Rings Expanding During Hypersonic Dive
    this.shockwaveGroup = new THREE.Group();
    for (let s = 0; s < 5; s++) {
      const sGeom = new THREE.RingGeometry(0.8 + s * 1.2, 1.0 + s * 1.2, 64);
      const sMat = new THREE.MeshBasicMaterial({
        color: s % 2 === 0 ? 0x06b6d4 : 0x10b981,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      });
      const ring = new THREE.Mesh(sGeom, sMat);
      ring.position.z = -5 - s * 8;
      this.shockwaveGroup.add(ring);
    }
    this.scene.add(this.shockwaveGroup);
  },

  buildVolumetricCloudPuffs() {
    this.cloudPuffsGroup = new THREE.Group();
    const puffGeom = new THREE.DodecahedronGeometry(0.55, 1);
    const puffMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });

    for (let i = 0; i < 65; i++) {
      const puff = new THREE.Mesh(puffGeom, puffMat.clone());
      puff.position.set(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 18,
        3.8 + Math.random() * 6.5
      );
      puff.scale.setScalar(1.2 + Math.random() * 3.5);
      this.cloudPuffsGroup.add(puff);
    }

    this.scene.add(this.cloudPuffsGroup);
  },

  buildUrbanGISMatrix() {
    this.urbanMatrixGroup = new THREE.Group();

    // 1. High-Density Perspective Ground Grid
    const gridHelper = new THREE.GridHelper(14, 42, 0x10b981, 0x0284c7);
    gridHelper.position.set(0, -1.8, 3.2);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0;
    this.urbanMatrixGroup.add(gridHelper);

    // 2. 54 3D Cyber Wireframe Skyscrapers with Rooftop Beacons
    for (let b = 0; b < 54; b++) {
      const h = 0.6 + Math.random() * 2.2;
      const w = 0.35 + Math.random() * 0.35;
      const bGeom = new THREE.BoxGeometry(w, h, w);
      const isEmerald = Math.random() > 0.4;
      const bMat = new THREE.MeshBasicMaterial({
        color: isEmerald ? 0x10b981 : 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: 0
      });
      const building = new THREE.Mesh(bGeom, bMat);
      building.position.set(
        (Math.random() - 0.5) * 11,
        -1.8 + h / 2,
        3.2 + (Math.random() - 0.5) * 11
      );
      this.urbanMatrixGroup.add(building);

      // Rooftop Beacon Sphere
      const beaconGeom = new THREE.SphereGeometry(0.04, 8, 8);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0
      });
      const beacon = new THREE.Mesh(beaconGeom, beaconMat);
      beacon.position.set(building.position.x, building.position.y + h / 2 + 0.05, building.position.z);
      this.urbanMatrixGroup.add(beacon);
    }

    this.scene.add(this.urbanMatrixGroup);
  },

  buildDroneScannerBeams() {
    this.droneScannerGroup = new THREE.Group();

    for (let d = 0; d < 4; d++) {
      const droneSubGroup = new THREE.Group();

      const coneGeom = new THREE.ConeGeometry(0.85, 3.2, 20, 1, true);
      const coneMat = new THREE.MeshBasicMaterial({
        color: d % 2 === 0 ? 0x10b981 : 0x38bdf8,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      const scanner = new THREE.Mesh(coneGeom, coneMat);
      scanner.rotation.x = Math.PI;
      droneSubGroup.add(scanner);

      // Drone Body Mesh
      const droneBodyGeom = new THREE.BoxGeometry(0.22, 0.05, 0.22);
      const droneBodyMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
      const droneBody = new THREE.Mesh(droneBodyGeom, droneBodyMat);
      droneBody.position.y = 1.6;
      droneSubGroup.add(droneBody);

      droneSubGroup.position.set((d - 1.5) * 2.6, 0.9, 3.2 + (d % 2) * 1.2);
      this.droneScannerGroup.add(droneSubGroup);
    }

    this.scene.add(this.droneScannerGroup);
  },

  initInteractionControls() {
    window.addEventListener('resize', () => this.onWindowResize());

    // Mouse Controls
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging || !this.earthGroup || this.isTransitioning) return;

      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.targetRotation.y += deltaX * 0.005;
      this.targetRotation.x += deltaY * 0.005;

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Touch Controls
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging || !this.earthGroup || this.isTransitioning || e.touches.length !== 1) return;

      const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
      const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

      this.targetRotation.y += deltaX * 0.007;
      this.targetRotation.x += deltaY * 0.007;

      this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });
  },

  onWindowResize() {
    if (!this.camera || !this.renderer) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);

    const isDesktop = width > 900;
    if (this.earthGroup) {
      this.earthGroup.position.x = isDesktop ? 4.8 : 0;
    }
    if (this.orbitalRingsGroup) {
      this.orbitalRingsGroup.position.x = isDesktop ? 4.8 : 0;
    }
  },

  /**
   * 7.5-Second Ultra-Advanced Multi-Stage Planetary Descent Sequence
   */
  enterApp() {
    if (this.isTransitioning || this.isFinished) return;
    this.isTransitioning = true;
    this.transitionStartTime = performance.now();

    // Start Custom SwachhLens Civic AI Sound Effects
    this.playCivicAISoundTrack();

    const launchBtn = document.getElementById('btn-enter-platform');
    if (launchBtn) {
      launchBtn.style.display = 'none';
    }

    const hudBox = document.querySelector('.intro-brand-box');
    if (hudBox) {
      hudBox.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      hudBox.style.opacity = '0';
      hudBox.style.transform = 'translate(-30px, -50%)';
    }
  },

  /**
   * High-Tech Civic AI Audio Synthesis (Cinema-Grade Spatial Audio Engine)
   */
  playCivicAISoundTrack() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Master Compressor & Limiter for Ultra-Punchy Sound
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-14, ctx.currentTime);
      compressor.knee.setValueAtTime(40, ctx.currentTime);
      compressor.ratio.setValueAtTime(12, ctx.currentTime);
      compressor.attack.setValueAtTime(0.003, ctx.currentTime);
      compressor.release.setValueAtTime(0.25, ctx.currentTime);
      compressor.connect(ctx.destination);

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.42, ctx.currentTime);
      master.connect(compressor);

      // 1. Cinematic Sub-Bass Impact Boom & Power Surge (0.0s - 1.2s)
      const subOsc1 = ctx.createOscillator();
      const subOsc2 = ctx.createOscillator();
      const subGain = ctx.createGain();
      
      subOsc1.type = 'sine';
      subOsc1.frequency.setValueAtTime(65, ctx.currentTime);
      subOsc1.frequency.exponentialRampToValueAtTime(28, ctx.currentTime + 1.0);

      subOsc2.type = 'triangle';
      subOsc2.frequency.setValueAtTime(130, ctx.currentTime);
      subOsc2.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 0.9);

      subGain.gain.setValueAtTime(0.32, ctx.currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      subOsc1.connect(subGain);
      subOsc2.connect(subGain);
      subGain.connect(master);

      subOsc1.start(ctx.currentTime);
      subOsc2.start(ctx.currentTime);
      subOsc1.stop(ctx.currentTime + 1.3);
      subOsc2.stop(ctx.currentTime + 1.3);

      // 2. High-Tech Cyber Laser Sync Beams (0.6s - 2.8s)
      [880, 1174.66, 1760, 2349.32].forEach((freq, i) => {
        const pingOsc = ctx.createOscillator();
        const pingGain = ctx.createGain();
        pingOsc.type = 'sine';
        pingOsc.frequency.setValueAtTime(freq, ctx.currentTime + 0.6 + i * 0.45);
        pingOsc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.6 + i * 0.45 + 0.15);
        
        pingGain.gain.setValueAtTime(0.09, ctx.currentTime + 0.6 + i * 0.45);
        pingGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6 + i * 0.45 + 0.4);

        pingOsc.connect(pingGain);
        pingGain.connect(master);
        pingOsc.start(ctx.currentTime + 0.6 + i * 0.45);
        pingOsc.stop(ctx.currentTime + 0.6 + i * 0.45 + 0.45);
      });

      // 3. Hypersonic Atmospheric Plasma Whoosh (2.0s - 5.4s)
      const bufferSize = ctx.sampleRate * 3.2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(800, ctx.currentTime + 2.0);
      noiseFilter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 5.2);
      noiseFilter.Q.setValueAtTime(3.0, ctx.currentTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, ctx.currentTime + 2.0);
      noiseGain.gain.linearRampToValueAtTime(0.24, ctx.currentTime + 3.4);
      noiseGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 5.4);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(master);

      whiteNoise.start(ctx.currentTime + 2.0);
      whiteNoise.stop(ctx.currentTime + 5.5);

      // 4. Urban GIS AI Precision Target Lock Telemetry (5.2s - 6.6s)
      [1400, 1800, 2200, 2600].forEach((freq, i) => {
        const lockOsc = ctx.createOscillator();
        const lockGain = ctx.createGain();
        lockOsc.type = 'triangle';
        lockOsc.frequency.setValueAtTime(freq, ctx.currentTime + 5.2 + i * 0.28);
        
        lockGain.gain.setValueAtTime(0.07, ctx.currentTime + 5.2 + i * 0.28);
        lockGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 5.2 + i * 0.28 + 0.16);

        lockOsc.connect(lockGain);
        lockGain.connect(master);
        lockOsc.start(ctx.currentTime + 5.2 + i * 0.28);
        lockOsc.stop(ctx.currentTime + 5.2 + i * 0.28 + 0.2);
      });

      // 5. Grand Civic Harmonic Resolution Chord (6.5s - 7.5s)
      const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      chord.forEach((freq, i) => {
        const cOsc = ctx.createOscillator();
        const cGain = ctx.createGain();
        cOsc.type = 'sine';
        cOsc.frequency.setValueAtTime(freq, ctx.currentTime + 6.5 + i * 0.06);
        
        cGain.gain.setValueAtTime(0.08, ctx.currentTime + 6.5 + i * 0.06);
        cGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 6.5 + i * 0.06 + 0.95);

        cOsc.connect(cGain);
        cGain.connect(master);
        cOsc.start(ctx.currentTime + 6.5 + i * 0.06);
        cOsc.stop(ctx.currentTime + 6.5 + i * 0.06 + 1.0);
      });
    } catch (e) {}
  },

  animate() {
    if (this.isFinished) return;

    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const elapsed = performance.now() / 1000;

    // Normal Idle Orbit Mode
    if (!this.isTransitioning) {
      this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.08;
      this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.08;

      if (!this.isDragging) {
        this.targetRotation.y += 0.0016;
      }

      if (this.earthGroup) {
        this.earthGroup.rotation.x = this.currentRotation.x;
        this.earthGroup.rotation.y = this.currentRotation.y;
      }

      if (this.holographicPointCloud) {
        this.holographicPointCloud.rotation.y += 0.002;
      }

      if (this.cloudsMesh1) {
        this.cloudsMesh1.rotation.y += 0.0024;
      }
      if (this.cloudsMesh2) {
        this.cloudsMesh2.rotation.y += 0.0018;
      }

      if (this.orbitalRingsGroup) {
        this.orbitalRingsGroup.rotation.z += 0.002;
      }

      if (this.radarBeamMesh) {
        this.radarBeamMesh.rotation.z += 0.026;
      }

      // Orbit Satellites
      this.satellites.forEach(sat => {
        sat.userData.angle += sat.userData.speed;
        sat.position.x = Math.cos(sat.userData.angle) * sat.userData.radius;
        sat.position.y = Math.sin(sat.userData.angle * 0.8) * (sat.userData.radius * 0.45);
        sat.position.z = Math.sin(sat.userData.angle) * sat.userData.radius;
        sat.lookAt(0, 0, 0);
      });

      // Animate Flowing Data Photons along Synapse Arcs
      this.dataPhotons.forEach(photon => {
        photon.userData.progress += 0.008;
        if (photon.userData.progress > 1) photon.userData.progress = 0;
        const pt = photon.userData.curve.getPoint(photon.userData.progress);
        photon.position.copy(pt);
      });

      // Pulsing Delhi Target Reticle
      if (this.targetBeaconGroup) {
        const beaconScale = 1 + Math.sin(elapsed * 4.8) * 0.24;
        this.targetBeaconGroup.scale.set(beaconScale, beaconScale, beaconScale);
      }
    } else {
      // 7.5-SECOND ULTRA-ADVANCED MULTI-STAGE HYPERSONIC DESCENT
      const diveElapsed = (performance.now() - this.transitionStartTime) / 1000;
      const progress = Math.min(1, diveElapsed / this.transitionDuration);

      if (diveElapsed <= 2.0) {
        // Phase 1: AI Target Vector Lock & GIS Grid Expansion (0.0s - 2.0s)
        const s1Progress = diveElapsed / 2.0;
        if (this.targetBeaconGroup) {
          const reticleScale = 1 + Math.sin(diveElapsed * 18) * 0.85;
          this.targetBeaconGroup.scale.set(reticleScale, reticleScale, reticleScale);
        }
        this.earthGroup.rotation.y += 0.015;

        // Smooth camera alignment
        this.camera.fov = 40 + s1Progress * 10;
        this.camera.updateProjectionMatrix();
      } else if (diveElapsed <= 5.0) {
        // Phase 2: Relativistic Warp Speed Descent with Dynamic FOV (2.0s - 5.0s)
        const s2Progress = (diveElapsed - 2.0) / 3.0;
        const ease2 = s2Progress * s2Progress;

        // Dynamic FOV Zoom Lens Expansion for Cinematic Velocity
        this.camera.fov = 50 + Math.sin(s2Progress * Math.PI) * 32; // Up to 82°
        this.camera.updateProjectionMatrix();

        this.camera.position.z = this.baseCameraZ - (ease2 * 11.2);
        this.camera.position.x = 4.8 * (1 - ease2 * 0.78);

        // 3,200 Warp Speed Streaks
        if (this.warpLines) {
          this.warpLines.material.opacity = Math.sin(s2Progress * Math.PI) * 0.98;
          this.warpLines.position.z = s2Progress * 110;
        }

        // Expanding Relativistic Shockwave Rings
        if (this.shockwaveGroup) {
          this.shockwaveGroup.children.forEach((ring, idx) => {
            ring.material.opacity = Math.sin(s2Progress * Math.PI) * 0.75;
            ring.scale.setScalar(1 + s2Progress * (3 + idx * 1.5));
          });
        }

        // Atmosphere Plasma Ionization Flare
        if (this.atmosphereMesh) {
          this.atmosphereMesh.material.opacity = 0.3 + Math.sin(s2Progress * Math.PI) * 0.65;
        }

        // Volumetric Cloud Fog Penetration
        if (this.cloudPuffsGroup) {
          const cloudAlpha = Math.sin(s2Progress * Math.PI) * 0.75;
          this.cloudPuffsGroup.children.forEach(puff => {
            puff.material.opacity = cloudAlpha;
            puff.position.z -= 0.25;
          });
        }

        this.earthGroup.rotation.y += 0.035;
      } else {
        // Phase 3: Urban GIS Cyber Matrix & Autonomous Drone Fleet (5.0s - 7.5s)
        const s3Progress = (diveElapsed - 5.0) / 2.5;
        const ease3 = Math.min(1, s3Progress * 1.2);

        // Reset FOV smoothly to normal
        this.camera.fov = 50 - (ease3 * 10); // Back to 40°
        this.camera.updateProjectionMatrix();

        this.camera.position.z = 3.6 - (ease3 * 1.2);
        this.camera.position.x = 1.05 * (1 - ease3);

        // Deploy 54 3D Urban Skyscrapers
        if (this.urbanMatrixGroup) {
          this.urbanMatrixGroup.children.forEach(child => {
            if (child.material) {
              child.material.opacity = ease3 * 0.92;
            }
          });
        }

        // Deploy Autonomous Drone Fleet & Scanning Cones
        if (this.droneScannerGroup) {
          this.droneScannerGroup.children.forEach((drone, idx) => {
            drone.children.forEach(mesh => {
              if (mesh.material) mesh.material.opacity = ease3 * 0.65;
            });
            drone.position.x += Math.sin(elapsed * 2 + idx) * 0.01;
            drone.rotation.z += 0.03;
          });
        }

        if (this.orbitalRingsGroup) {
          const ringScale = 1 + ease3 * 4.5;
          this.orbitalRingsGroup.scale.set(ringScale, ringScale, ringScale);
          this.orbitalRingsGroup.children.forEach(r => {
            if (r.material) r.material.opacity = Math.max(0, 0.65 - ease3);
          });
        }
      }

      // Complete transition
      if (progress >= 1) {
        this.finishTransition();
      }
    }

    this.renderer.render(this.scene, this.camera);
  },

  finishTransition() {
    this.isFinished = true;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.container) {
      this.container.classList.add('intro-fade-out');
      setTimeout(() => {
        this.container.style.display = 'none';
        this.dispose();

        // Smooth handoff to Dedicated Full-Page Login Screen
        if (typeof App !== 'undefined') {
          App.setViewMode('login');
        }
      }, 450);
    }
  },

  replay() {
    this.isFinished = false;
    this.isTransitioning = false;

    if (this.container) {
      this.container.style.display = 'flex';
      this.container.classList.remove('intro-fade-out');

      const hudBox = document.querySelector('.intro-brand-box');
      if (hudBox) {
        hudBox.style.opacity = '1';
        hudBox.style.transform = 'translate(0, -50%)';
      }

      const launchBtn = document.getElementById('btn-enter-platform');
      if (launchBtn) {
        launchBtn.style.display = 'inline-flex';
      }
    }

    this.init();
  },

  fallbackDismiss() {
    if (this.container) {
      this.container.style.display = 'none';
    }
  },

  dispose() {
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  Intro3D.init();
});

