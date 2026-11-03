// --- data-store.js ---
/**
 * SwachhLens Data Store & Persistence Module
 * Contains pre-populated realistic municipal datasets, sensitive landmarks,
 * incident clusters, field crew fleets, and audit event logs.
 */

const DataStore = {
  // Function to produce bulletproof base64 SVG Data URLs
  createSvgDataUrl(svgString) {
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
  },

  // High-Tech Cybernetic Waste SVG Visual Assets
  get sampleImages() {
    return {
      drain_blockage: this.createSvgDataUrl(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
          <defs>
            <linearGradient id="bgDrain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0f172a"/>
              <stop offset="60%" stop-color="#1e293b"/>
              <stop offset="100%" stop-color="#090d16"/>
            </linearGradient>
            <linearGradient id="waterFlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#0284c7" stop-opacity="0.8"/>
              <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.9"/>
              <stop offset="100%" stop-color="#0284c7" stop-opacity="0.8"/>
            </linearGradient>
          </defs>
          <rect width="600" height="400" fill="url(#bgDrain)"/>
          
          <!-- Asphalt Road & Gutter Structure -->
          <rect y="180" width="600" height="220" fill="#1e293b"/>
          <path d="M0 240 L600 240" stroke="#334155" stroke-width="4"/>
          
          <!-- Storm Drain Grate -->
          <rect x="180" y="220" width="240" height="150" rx="6" fill="#0f172a" stroke="#475569" stroke-width="3"/>
          <line x1="210" y1="230" x2="210" y2="360" stroke="#64748b" stroke-width="6"/>
          <line x1="240" y1="230" x2="240" y2="360" stroke="#64748b" stroke-width="6"/>
          <line x1="270" y1="230" x2="270" y2="360" stroke="#64748b" stroke-width="6"/>
          <line x1="300" y1="230" x2="300" y2="360" stroke="#64748b" stroke-width="6"/>
          <line x1="330" y1="230" x2="330" y2="360" stroke="#64748b" stroke-width="6"/>
          <line x1="360" y1="230" x2="360" y2="360" stroke="#64748b" stroke-width="6"/>
          <line x1="390" y1="230" x2="390" y2="360" stroke="#64748b" stroke-width="6"/>
          
          <!-- Waste Overflow Mound -->
          <ellipse cx="300" cy="270" rx="140" ry="65" fill="#14532d" opacity="0.9"/>
          <path d="M190 280 Q290 200 390 270 Q310 340 190 280" fill="#78350f" opacity="0.95"/>
          <circle cx="270" cy="260" r="18" fill="#ef4444" opacity="0.85"/>
          <rect x="310" y="240" width="55" height="35" rx="5" fill="#3b82f6" opacity="0.8"/>
          <path d="M220 290 Q300 260 380 300" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"/>
          
          <!-- Backed-up Water Pool -->
          <ellipse cx="300" cy="330" rx="190" ry="40" fill="url(#waterFlow)"/>

          <!-- AI Cyber Detection Bounding Box -->
          <rect x="140" y="190" width="320" height="180" rx="8" fill="none" stroke="#10b981" stroke-width="2.5" stroke-dasharray="8 4"/>
          <rect x="140" y="166" width="180" height="24" rx="4" fill="#10b981"/>
          <text x="148" y="182" fill="#ffffff" font-size="12" font-family="monospace" font-weight="bold">AI: DRAIN BLOCKAGE (92%)</text>
          
          <!-- Secondary Tag -->
          <rect x="340" y="166" width="120" height="24" rx="4" fill="#f59e0b"/>
          <text x="348" y="182" fill="#ffffff" font-size="12" font-family="monospace" font-weight="bold">VOL: 1.4 m³ [HIGH]</text>
        </svg>
      `),

      construction_debris: this.createSvgDataUrl(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
          <rect width="600" height="400" fill="#0f172a"/>
          <rect y="200" width="600" height="200" fill="#1e293b"/>
          
          <!-- Concrete & Masonry Rubble Pile -->
          <polygon points="100,380 260,180 440,210 540,380" fill="#475569"/>
          <polygon points="180,380 310,190 480,380" fill="#64748b"/>
          <polygon points="240,280 340,160 410,290" fill="#94a3b8"/>
          <polygon points="140,360 220,290 300,370" fill="#cbd5e1"/>
          <polygon points="340,360 420,260 500,370" fill="#cbd5e1"/>

          <!-- AI Cyber Detection Bounding Box -->
          <rect x="90" y="150" width="460" height="235" rx="8" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="8 4"/>
          <rect x="90" y="126" width="220" height="24" rx="4" fill="#f59e0b"/>
          <text x="98" y="142" fill="#ffffff" font-size="12" font-family="monospace" font-weight="bold">AI: CONCRETE DEBRIS (95%)</text>
          <rect x="320" y="126" width="130" height="24" rx="4" fill="#3b82f6"/>
          <text x="328" y="142" fill="#ffffff" font-size="12" font-family="monospace" font-weight="bold">HEAVY: ~3.5 m³</text>
        </svg>
      `),

      medical_waste: this.createSvgDataUrl(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
          <rect width="600" height="400" fill="#0f172a"/>
          <rect y="220" width="600" height="180" fill="#1e293b"/>
          
          <!-- Red Hazardous Clinical Bags & Sharps -->
          <rect x="180" y="170" width="240" height="190" rx="14" fill="#dc2626" opacity="0.9"/>
          <circle cx="300" cy="255" r="48" fill="#fef2f2"/>
          
          <!-- Biohazard Cross & Sharps -->
          <path d="M285 230 L315 230 L315 280 L285 280 Z M265 250 L335 250 L335 260 L265 260 Z" fill="#dc2626"/>
          <rect x="220" y="210" width="30" height="70" rx="4" fill="#eab308" transform="rotate(20 220 210)"/>

          <!-- AI Cyber Detection Bounding Box -->
          <rect x="160" y="145" width="280" height="225" rx="8" fill="none" stroke="#ef4444" stroke-width="3" stroke-dasharray="8 4"/>
          <rect x="160" y="121" width="240" height="24" rx="4" fill="#ef4444"/>
          <text x="168" y="137" fill="#ffffff" font-size="12" font-family="monospace" font-weight="bold">AI: BIOHAZARD SHARPS (99%)</text>
        </svg>
      `),

      plastic_bottles: this.createSvgDataUrl(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
          <rect width="600" height="400" fill="#042f2e"/>
          <ellipse cx="300" cy="300" rx="260" ry="90" fill="#0369a1"/>
          
          <!-- Plastic Bottles & Packaging -->
          <rect x="200" y="240" width="45" height="90" rx="8" fill="#38bdf8" transform="rotate(28 200 240)"/>
          <rect x="290" y="225" width="45" height="100" rx="8" fill="#7dd3fc" transform="rotate(-18 290 225)"/>
          <rect x="360" y="250" width="50" height="85" rx="8" fill="#bae6fd" transform="rotate(42 360 250)"/>
          <circle cx="260" cy="275" r="22" fill="#facc15" opacity="0.8"/>

          <!-- AI Cyber Detection Bounding Box -->
          <rect x="160" y="195" width="290" height="175" rx="8" fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-dasharray="8 4"/>
          <rect x="160" y="171" width="200" height="24" rx="4" fill="#06b6d4"/>
          <text x="168" y="187" fill="#ffffff" font-size="12" font-family="monospace" font-weight="bold">AI: PLASTIC PET (96%)</text>
        </svg>
      `),

      ambiguous_night: this.createSvgDataUrl(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
          <rect width="600" height="400" fill="#020617"/>
          <circle cx="300" cy="240" r="140" fill="#0f172a"/>
          <rect x="230" y="210" width="140" height="100" rx="10" fill="#1e293b" opacity="0.7"/>

          <!-- AI Low Confidence Warning Box -->
          <rect x="170" y="175" width="260" height="160" rx="8" fill="none" stroke="#eab308" stroke-width="2.5" stroke-dasharray="6 4"/>
          <rect x="170" y="151" width="220" height="24" rx="4" fill="#eab308"/>
          <text x="178" y="167" fill="#000000" font-size="12" font-family="monospace" font-weight="bold">AI: LOW CONFIDENCE (56%)</text>
        </svg>
      `),

      after_clean_drain: this.createSvgDataUrl(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
          <rect width="600" height="400" fill="#064e3b"/>
          <rect y="180" width="600" height="220" fill="#0f172a"/>
          <rect x="180" y="220" width="240" height="150" rx="6" fill="#022c22" stroke="#10b981" stroke-width="3"/>
          <path d="M50 310 L550 310" stroke="#38bdf8" stroke-width="22" stroke-linecap="round"/>
          <circle cx="300" cy="270" r="38" fill="#10b981"/>
          <path d="M288 270 L297 279 L315 261" stroke="#ffffff" stroke-width="5" fill="none" stroke-linecap="round"/>
          
          <rect x="150" y="120" width="300" height="32" rx="6" fill="#10b981"/>
          <text x="300" y="141" fill="#ffffff" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">✓ AI VERIFIED: 96% CLEARANCE</text>
        </svg>
      `)
    };
  },

  // Sensitive municipal landmarks in Ward 14 New Delhi
  sensitiveLandmarks: [
    { id: 'LM-1', name: 'Ram Nagar Municipal School', type: 'school', lat: 28.5360, lng: 77.2152, riskBonus: 20 },
    { id: 'LM-2', name: 'City Civil Hospital Gate 3', type: 'hospital', lat: 28.5410, lng: 77.2180, riskBonus: 15 },
    { id: 'LM-3', name: 'Yamuna Riverbank Zone 2', type: 'water_body', lat: 28.5320, lng: 77.2250, riskBonus: 15 },
    { id: 'LM-4', name: 'Trunk Arterial Storm Drain Line 4', type: 'drain', lat: 28.5356, lng: 77.2147, riskBonus: 25 }
  ],

  // Available municipal crews & fleet resources
  crews: [
    {
      id: 'Team-Sector5-A',
      name: 'Team-Sector5-A (Lead: Ramesh Singh)',
      type: 'manual_jetting',
      members: 4,
      vehicle: 'Mini Truck (DL-1L-8942) + High-Pressure Jetting Unit',
      equipment: ['Drain Hooks', 'Jetting Nozzles', 'Biohazard Gloves', 'Compactor Shovels'],
      status: 'AVAILABLE',
      lat: 28.5370,
      lng: 77.2130
    },
    {
      id: 'Team-Sector5-B',
      name: 'Team-Sector5-B (Lead: Anil Verma)',
      type: 'heavy_debris',
      members: 3,
      vehicle: 'Heavy JCB Loader + 8-Ton Tipper Truck',
      equipment: ['Hydraulic Grabber', 'Concrete Breaker', 'High-Vis Safety Gear'],
      status: 'AVAILABLE',
      lat: 28.5390,
      lng: 77.2160
    },
    {
      id: 'Specialized-Drainage',
      name: 'Specialized Drainage Emergency Unit',
      type: 'drainage_patrol',
      members: 3,
      vehicle: 'Super Sucker Vacuum Tanker + Submersible Sump Pump',
      equipment: ['CCTV Drain Crawler', 'Deep Silt Agitators'],
      status: 'AVAILABLE',
      lat: 28.5340,
      lng: 77.2110
    },
    {
      id: 'GreenRecycle-Partner',
      name: 'GreenRecycle NGO Partner',
      type: 'recycling_partner',
      members: 2,
      vehicle: 'Electric Cargo Trike + Sorting Bins',
      equipment: ['Baler Press', 'PET Shredder Bags'],
      status: 'AVAILABLE',
      lat: 28.5330,
      lng: 77.2210
    }
  ],

  // Configurable Decision Engine Weights (Default matching Technical Docs Section 10.1)
  weights: {
    w1_hazard: 35,
    w2_volume: 25,
    w3_georisk: 20,
    w4_age: 15,
    w5_frequency: 5
  },

  // Initial Municipal Incidents Dataset
  defaultIncidents: [
    {
      id: 'INCIDENT-2024-08-16-0847',
      shortId: 'SW-0847',
      title: 'Gupta Market Approach Road',
      locationName: 'Gupta Market Approach Road, New Delhi',
      lat: 28.5355,
      lng: 77.2146,
      category: 'Organic Waste + Mixed Garbage',
      rawCategory: 'Organic Waste',
      volumeCategory: 'Large',
      volumeEstimate: '~1.2 - 1.5 m³',
      aiConfidence: 91,
      confidenceTier: 'HIGH',
      hasDrainBlockage: true,
      nearestLandmark: 'Ram Nagar Municipal School (85m)',
      landmarkDistanceMeters: 85,
      reportedTime: '2024-08-16 14:30:45 UTC',
      ageHours: 1.2,
      clusterSize: 4,
      clusteredReports: [
        { id: 'RPT-2024-08-16-001805', user: 'CIT-1092', time: '14:15 UTC', lat: 28.5356, lng: 77.2148, similarity: 0.82 },
        { id: 'RPT-2024-08-16-001821', user: 'CIT-3819', time: '14:22 UTC', lat: 28.5354, lng: 77.2145, similarity: 0.79 },
        { id: 'RPT-2024-08-16-001835', user: 'CIT-2291', time: '14:28 UTC', lat: 28.5357, lng: 77.2147, similarity: 0.81 },
        { id: 'RPT-2024-08-16-001847', user: 'Rajesh Kumar (CIT-4521)', time: '14:30 UTC', lat: 28.5355, lng: 77.2146, similarity: 1.0, comment: 'Water backing up into nearby shops. Very urgent!' }
      ],
      detectedTags: ['Plastic bags (89%)', 'Food waste (94%)', 'Silt / Foliage (86%)', 'Drain blockage (92%)'],
      priorityScore: 58,
      priorityLevel: 'HIGH', // Escalated from MEDIUM-HIGH due to drain blockage
      escalationReason: 'Drain blockage detected (+25 location risk, automatic upgrade to HIGH)',
      recommendedTeam: '3 Manual Cleanup Workers + 1 Supervisor',
      recommendedVehicle: '1 Mini Truck + 1 Drainage Jetting Truck',
      recommendedSpecialist: 'Drainage Department Coordination',
      specialInstructions: 'Coordinate with school; avoid peak dismissal time (15:30 - 16:00)',
      status: 'ANALYZED', // REPORTED -> ANALYZING -> ANALYZED -> ASSIGNED -> IN_PROGRESS -> AWAITING_VERIFICATION -> VERIFIED_RESOLVED -> CLOSED
      assignedCrewId: null,
      assignedTime: null,
      beforeImageKey: 'drain_blockage',
      afterImageKey: 'after_clean_drain',
      clearanceScore: null,
      feedback: null
    },
    {
      id: 'INCIDENT-2024-08-16-1041',
      shortId: 'SW-1041',
      title: 'Connaught Place North Service Lane',
      locationName: 'Outer Circle North Lane, New Delhi',
      lat: 28.5385,
      lng: 77.2175,
      category: 'Construction Debris',
      rawCategory: 'Construction Debris',
      volumeCategory: 'Large',
      volumeEstimate: '~3.5 m³',
      aiConfidence: 91,
      confidenceTier: 'HIGH',
      hasDrainBlockage: false,
      nearestLandmark: 'Metro Gate 2 (120m)',
      landmarkDistanceMeters: 120,
      reportedTime: '2024-08-16 13:10:00 UTC',
      ageHours: 2.5,
      clusterSize: 5,
      clusteredReports: [
        { id: 'RPT-1041-A', user: 'CIT-7712', time: '12:45 UTC', lat: 28.5384, lng: 77.2174, similarity: 0.88 },
        { id: 'RPT-1041-B', user: 'CIT-9011', time: '13:00 UTC', lat: 28.5386, lng: 77.2176, similarity: 0.85 }
      ],
      detectedTags: ['Broken concrete (95%)', 'Brick rubble (91%)', 'Cement sacks (84%)'],
      priorityScore: 82,
      priorityLevel: 'HIGH',
      escalationReason: 'Heavy multi-ton pile obstructing major commercial traffic artery',
      recommendedTeam: '2 Heavy Equipment Operators + 1 Traffic Marshal',
      recommendedVehicle: '1 Heavy JCB Loader + 8-Ton Tipper',
      recommendedSpecialist: 'PWD Demolition Waste Contractor',
      specialInstructions: 'Deploy reflective cones to divert traffic during loading',
      status: 'ASSIGNED',
      assignedCrewId: 'Team-Sector5-B',
      assignedTime: '2024-08-16 13:30:00 UTC',
      beforeImageKey: 'construction_debris',
      afterImageKey: null,
      clearanceScore: null,
      feedback: null
    },
    {
      id: 'INCIDENT-2024-08-16-1088',
      shortId: 'SW-1088',
      title: 'Civil Hospital Gate 3 Bio-Waste',
      locationName: 'City Civil Hospital Gate 3, Sector 5',
      lat: 28.5410,
      lng: 77.2180,
      category: 'Hazardous Bio-waste / Sharps',
      rawCategory: 'Hazardous Waste',
      volumeCategory: 'Medium',
      volumeEstimate: '~0.6 m³',
      aiConfidence: 94,
      confidenceTier: 'HIGH',
      hasDrainBlockage: false,
      nearestLandmark: 'Civil Hospital ICU Wing (20m)',
      landmarkDistanceMeters: 20,
      reportedTime: '2024-08-16 14:05:00 UTC',
      ageHours: 0.8,
      clusterSize: 2,
      clusteredReports: [
        { id: 'RPT-1088-A', user: 'CIT-4019', time: '14:00 UTC', lat: 28.5411, lng: 77.2181, similarity: 0.92 }
      ],
      detectedTags: ['Red clinical bags (97%)', 'Needle sharps bin (92%)', 'Biohazard sign detected (99%)'],
      priorityScore: 94,
      priorityLevel: 'CRITICAL',
      escalationReason: 'Infectious clinical waste adjacent to hospital pedestrian entrance',
      recommendedTeam: 'Certified Hazmat Disposal Specialists (2 Handlers)',
      recommendedVehicle: 'Dedicated Bio-Medical Incinerator Van',
      recommendedSpecialist: 'State Pollution Control Board Authorized Handler',
      specialInstructions: 'Wear Grade-A PPE; do not compact on site',
      status: 'IN_PROGRESS',
      assignedCrewId: 'Specialized-Drainage',
      assignedTime: '2024-08-16 14:15:00 UTC',
      beforeImageKey: 'medical_waste',
      afterImageKey: null,
      clearanceScore: null,
      feedback: null
    },
    {
      id: 'INCIDENT-2024-08-16-1092',
      shortId: 'SW-1092',
      title: 'Yamuna Riverfront Promenade',
      locationName: 'Ghat 3 Promenade Walkway',
      lat: 28.5320,
      lng: 77.2250,
      category: 'Plastic Waste / Recyclables',
      rawCategory: 'Plastic Waste',
      volumeCategory: 'Large',
      volumeEstimate: '~1.8 m³',
      aiConfidence: 89,
      confidenceTier: 'HIGH',
      hasDrainBlockage: false,
      nearestLandmark: 'Yamuna River Water Body (35m)',
      landmarkDistanceMeters: 35,
      reportedTime: '2024-08-16 11:20:00 UTC',
      ageHours: 3.5,
      clusterSize: 7,
      clusteredReports: [
        { id: 'RPT-1092-A', user: 'CIT-5511', time: '11:00 UTC', lat: 28.5321, lng: 77.2251, similarity: 0.83 }
      ],
      detectedTags: ['PET water bottles (96%)', 'Polystyrene cups (91%)', 'Food wrappers (88%)'],
      priorityScore: 68,
      priorityLevel: 'HIGH',
      escalationReason: 'Proximity to river water body; high wind dispersion risk',
      recommendedTeam: 'GreenRecycle NGO Partner + 2 Ragpicker Collectives',
      recommendedVehicle: 'Electric Cargo Trike + Segregation Cart',
      recommendedSpecialist: 'GreenRecycle Material Recovery Facility (MRF)',
      specialInstructions: 'Segregate clear PET on-site for immediate recycling credits',
      status: 'ANALYZED',
      assignedCrewId: null,
      assignedTime: null,
      beforeImageKey: 'plastic_bottles',
      afterImageKey: null,
      clearanceScore: null,
      feedback: null
    }
  ],

  // System Audit Trail Entries
  defaultAuditLogs: [
    {
      timestamp: '2024-08-16 14:31:15 UTC',
      actor: 'AI Decision Engine',
      incidentId: 'INCIDENT-0847',
      action: '4-Signal Duplicate Clustering',
      confidence: '100% Match (4 Reports)',
      details: 'Merged RPT-001805, 001821, 001835 into primary incident. Cluster radius: 25m.'
    },
    {
      timestamp: '2024-08-16 14:31:30 UTC',
      actor: 'AI Scoring Engine',
      incidentId: 'INCIDENT-0847',
      action: 'Priority Escalation',
      confidence: '91% Model Confidence',
      details: 'Drain blockage (+25 risk) triggered automatic escalation from MEDIUM-HIGH to HIGH (Score 58).'
    },
    {
      timestamp: '2024-08-16 14:08:12 UTC',
      actor: 'Officer Priya Sharma',
      incidentId: 'INCIDENT-1088',
      action: 'Direct Dispatch Approval',
      confidence: 'Manual Override Accepted',
      details: 'Assigned Biohazard crew with priority ETA 15 mins.'
    },
    {
      timestamp: '2024-08-16 13:30:00 UTC',
      actor: 'Officer Priya Sharma',
      incidentId: 'INCIDENT-1041',
      action: 'Assigned Crew',
      confidence: 'AI Match Approved',
      details: 'Assigned Team-Sector5-B (JCB Loader + Tipper) for heavy concrete rubble removal.'
    }
  ],

  // State Management & LocalStorage
  incidents: [],
  auditLogs: [],

  init() {
    const savedIncidents = localStorage.getItem('swachhlens_incidents');
    const savedLogs = localStorage.getItem('swachhlens_audit');
    const savedWeights = localStorage.getItem('swachhlens_weights');

    if (savedIncidents) {
      try {
        this.incidents = JSON.parse(savedIncidents);
      } catch (e) {
        this.incidents = JSON.parse(JSON.stringify(this.defaultIncidents));
      }
    } else {
      this.incidents = JSON.parse(JSON.stringify(this.defaultIncidents));
    }

    if (savedLogs) {
      try {
        this.auditLogs = JSON.parse(savedLogs);
      } catch (e) {
        this.auditLogs = JSON.parse(JSON.stringify(this.defaultAuditLogs));
      }
    } else {
      this.auditLogs = JSON.parse(JSON.stringify(this.defaultAuditLogs));
    }

    if (savedWeights) {
      try {
        this.weights = JSON.parse(savedWeights);
      } catch (e) {}
    }
  },

  save() {
    localStorage.setItem('swachhlens_incidents', JSON.stringify(this.incidents));
    localStorage.setItem('swachhlens_audit', JSON.stringify(this.auditLogs));
    localStorage.setItem('swachhlens_weights', JSON.stringify(this.weights));
  },

  resetToDefault() {
    this.incidents = JSON.parse(JSON.stringify(this.defaultIncidents));
    this.auditLogs = JSON.parse(JSON.stringify(this.defaultAuditLogs));
    this.weights = { w1_hazard: 35, w2_volume: 25, w3_georisk: 20, w4_age: 15, w5_frequency: 5 };
    this.save();
    if (typeof App !== 'undefined') {
      App.refreshAllViews();
      showToast('Demo dataset reset to initial state!', 'success');
    }
  },

  getIncidentById(id) {
    return this.incidents.find(inc => inc.id === id || inc.shortId === id);
  },

  addAuditLog(actor, incidentId, action, confidence, details) {
    const newLog = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actor,
      incidentId,
      action,
      confidence,
      details
    };
    this.auditLogs.unshift(newLog);
    this.save();
  }
};

// Initialize Store
DataStore.init();

