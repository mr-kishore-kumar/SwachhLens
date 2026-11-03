// --- walkthrough.js ---
/**
 * SwachhLens 10-Step Interactive Scripted Walkthrough Controller
 * Faithfully demonstrates the exact End-to-End Walkthrough Scenario
 * documented in Sections 20 & 20.1 of the Technical Specification.
 */

const Walkthrough = {
  currentStage: 1,
  totalStages: 10,

  stagesData: [
    {
      stage: 1,
      title: 'Stage 1: Citizen Photo Capture (14:30 UTC)',
      actor: 'Citizen Rajesh Kumar (CIT-4521)',
      view: 'citizen',
      citizenScreen: 'capture',
      description: 'Citizen Rajesh spots an overflowing garbage pile blocking a storm drain along Gupta Market Approach Road, 85m from Ram Nagar Municipal School. He opens SwachhLens and captures visual evidence with auto-GPS EXIF tagging.',
      previewHtml: `
        <div style="display:flex; gap:1rem; align-items:center;">
          <img src="${DataStore.sampleImages.drain_blockage}" style="width:120px; height:80px; border-radius:6px; object-fit:cover;">
          <div class="text-xs">
            <strong>Input Captured:</strong><br>
            • GPS: <code>28.5355° N, 77.2146° E</code> (Auto-confirmed)<br>
            • Timestamp: <code>2024-08-16 14:30:45 UTC</code><br>
            • Note: <em>"Water backing up into nearby shops. Very urgent!"</em><br>
            • Privacy: <strong>Pedestrian Face & License Plate Auto-Blurred</strong>
          </div>
        </div>
      `
    },
    {
      stage: 2,
      title: 'Stage 2: AI Waste Classification (14:31 UTC - 30s Processing)',
      actor: 'AI / Computer Vision Service (YOLOv8 + ResNet)',
      view: 'citizen',
      citizenScreen: 'analyzing',
      description: 'SwachhLens Computer Vision pipeline extracts 15 video frames, executes multi-class object detection, and identifies hazardous risk factors without requiring human inspection.',
      previewHtml: `
        <div class="text-xs">
          <strong>AI Classification Inferences:</strong><br>
          • Primary Category: <span class="text-emerald font-semibold">Organic Waste + Mixed Garbage (87% Confidence)</span><br>
          • Secondary Detection: <span class="text-danger font-semibold">Drain Blockage Detected (92% Confidence)</span><br>
          • Detected Objects: <em>Plastic bags, Food waste, Silt & foliage, Obstructed drain curb</em><br>
          • Confidence Tier: <span class="badge badge-success">HIGH CONFIDENCE (≥ 85%)</span>
        </div>
      `
    },
    {
      stage: 3,
      title: 'Stage 3: Scale-Anchored Volume Estimation (14:31 UTC)',
      actor: 'AI Scale Anchoring Engine',
      view: 'citizen',
      citizenScreen: 'result',
      description: 'The system uses visible environmental references (standard 0.3m road curb & drainage opening) to categorize approximate volume without fabricating false cubic precision.',
      previewHtml: `
        <div class="text-xs">
          <strong>Volumetric Scale Anchoring:</strong><br>
          • Volume Tier: <strong>Large</strong><br>
          • Estimated Extent: <strong>~1.2 - 1.5 cubic meters</strong><br>
          • Anchor Reference: Standard 0.3m concrete drain curb<br>
          • Confidence: <strong>78% (Visible region measurable; surface depth estimated)</strong>
        </div>
      `
    },
    {
      stage: 4,
      title: 'Stage 4: 4-Signal Duplicate Detection & Clustering (14:31 UTC)',
      actor: 'PostGIS & Geo-Spatial Clustering Engine',
      view: 'portal',
      portalTab: 'dashboard',
      description: 'Instead of creating multiple separate tickets, SwachhLens queries the database and clusters 4 citizen complaints filed within 50m and 35 minutes into a single unified incident (INCIDENT-0847).',
      previewHtml: `
        <div class="text-xs">
          <strong>4-Signal Duplicate Matching Score:</strong><br>
          • GPS Proximity (≤ 100m): <strong>15m apart (✓ +25 pts)</strong><br>
          • Temporal Window (≤ 4h): <strong>15 mins apart (✓ +25 pts)</strong><br>
          • Category Match: <strong>Organic ≈ Mixed (✓ +25 pts)</strong><br>
          • Visual pHash Similarity: <strong>Score 0.82 ≥ 0.75 (✓ +25 pts)</strong><br>
          <strong class="text-emerald block mt-1">Total Score: 100/100 → INCIDENT-0847 Created (4 Citizen Reports Merged)</strong>
        </div>
      `
    },
    {
      stage: 5,
      title: 'Stage 5: Multi-Factor Explainable Priority Scoring (14:31 UTC)',
      actor: 'SwachhLens Decision Engine',
      view: 'portal',
      portalTab: 'queue',
      description: 'The engine evaluates 5 weighted factors. While baseline score is 58 (MEDIUM-HIGH), the detected drain blockage triggers an automatic safety escalation to HIGH.',
      previewHtml: `
        <div class="text-xs">
          <strong>Explainable Priority Formula:</strong><br>
          <code>Priority = (0.35×85) + (0.25×70) + (0.20×45) + (0.15×1.11) + (0.05×40)</code><br>
          • Hazard (35% × 85) = 29.75 pts &nbsp;|&nbsp; Volume (25% × 70) = 17.50 pts<br>
          • Location (20% × 45) = 9.00 pts &nbsp;|&nbsp; Age = 0.17 pts &nbsp;|&nbsp; Frequency = 2.00 pts<br>
          <strong>Base Score: 58/100 → Automatic Upgrade to HIGH (Drain Blockage Escalation)</strong>
        </div>
      `
    },
    {
      stage: 6,
      title: 'Stage 6: Decision Engine & Action Recommendation (14:32 UTC)',
      actor: 'Smart Resource Matching Engine',
      view: 'portal',
      portalTab: 'queue',
      description: 'SwachhLens moves beyond "There is garbage here" to "This is the recommended municipal response", matching the exact crew, vehicle, and coordination requirements.',
      previewHtml: `
        <div class="text-xs">
          <strong>Recommended Action Plan:</strong><br>
          • Crew: <strong>3 Manual Cleanup Workers + 1 Supervisor</strong><br>
          • Fleet: <strong>1 Mini Truck (debris transport) + 1 Drainage Jetting Truck</strong><br>
          • Specialist: <strong>Drainage Department Emergency Coordination</strong><br>
          • Special Note: <em>Coordinate with Ram Nagar School; avoid 15:30 peak dismissal</em>
        </div>
      `
    },
    {
      stage: 7,
      title: 'Stage 7: Municipal Authority Review & 1-Click Assignment (14:35 UTC)',
      actor: 'Officer Priya Sharma (AUT-2341)',
      view: 'portal',
      portalTab: 'dashboard',
      description: 'Municipal Officer Priya Sharma reviews the explainability card, accepts the AI recommendation with 1 click, and dispatches Team-Sector5-A. Citizen Rajesh receives an immediate SMS notification with ETA.',
      previewHtml: `
        <div class="text-xs">
          <strong>Assignment Dispatched:</strong><br>
          • Assigned Team: <strong>Team-Sector5-A (Available • Equipped with Jetting Unit)</strong><br>
          • Assignment ID: <code>ASSIGN-2024-08-16-4521</code> (Logged in Immutable Audit Trail)<br>
          • Citizen Alert: <em>"Your waste report (INCIDENT-0847) is assigned to Team A. ETA: 15 mins."</em>
        </div>
      `
    },
    {
      stage: 8,
      title: 'Stage 8: Field Crew Response & Cleanup (14:40 - 15:30 UTC)',
      actor: 'Team-Sector5-A (Lead: Ramesh Singh)',
      view: 'crew',
      description: 'Field Crew arrives at Gupta Market, marks status IN_PROGRESS, unblocks the storm drain using high-pressure jetting, sweeps the roadway, and captures after-cleanup evidence.',
      previewHtml: `
        <div class="text-xs">
          <strong>Field Execution Timeline:</strong><br>
          • 14:40 UTC: Crew arrives on-site; marks <code>IN_PROGRESS</code><br>
          • 14:45 UTC: Jetting unit unblocks silt & plastic obstruction from drain<br>
          • 15:15 UTC: 1.4 m³ waste removed and loaded into Mini Truck<br>
          • 15:30 UTC: Supervisor Ramesh captures After-cleanup photo
        </div>
      `
    },
    {
      stage: 9,
      title: 'Stage 9: AI Closed-Loop Cleanup Verification (15:31 UTC)',
      actor: 'AI Verification & Clearance CV Engine',
      view: 'portal',
      portalTab: 'verification',
      description: 'SwachhLens compares Before & After imagery. Computer vision detects 0 residual waste items and confirms drain patency with 96% clearance (>90% threshold passed), officially closing the loop.',
      previewHtml: `
        <div style="display:flex; gap:1rem; align-items:center;">
          <img src="${DataStore.sampleImages.after_clean_drain}" style="width:120px; height:80px; border-radius:6px; object-fit:cover;">
          <div class="text-xs">
            <strong class="text-emerald">AI Verification: PASSED (96% Clearance)</strong><br>
            • Residual Waste Items: <strong>0 items detected</strong><br>
            • Drain Patency: <strong>Drain opening fully clear; unobstructed flow</strong><br>
            • Processing Time: <strong>12 seconds (94% Model Confidence)</strong>
          </div>
        </div>
      `
    },
    {
      stage: 10,
      title: 'Stage 10: Incident Closure & Citizen Feedback (15:32 UTC)',
      actor: 'Citizen Rajesh Kumar & Municipal System',
      view: 'citizen',
      citizenScreen: 'home',
      description: 'Incident SW-0847 is marked CLOSED. Citizen Rajesh receives a resolution SMS and in-app rating prompt. Municipal analytics are updated in real time (Total end-to-end time: 62 minutes).',
      previewHtml: `
        <div class="text-xs">
          <strong>Closure & Resource Efficiency Summary:</strong><br>
          • Total End-to-End Time: <strong class="text-emerald">62 minutes (vs 24-48h traditional)</strong><br>
          • Duplicate Efficiency: <strong>4 citizen complaints → 1 unified dispatch</strong><br>
          • Citizen Feedback: <span class="badge badge-success">⭐⭐⭐⭐⭐ Satisfied</span><br>
          <strong class="text-emerald block mt-1">✓ One Citizen Photograph → One Actionable, Tracked, and Verified Municipal Decision!</strong>
        </div>
      `
    }
  ],

  start() {
    this.currentStage = 1;
    const modal = document.getElementById('walkthrough-modal-backdrop');
    if (modal) modal.classList.remove('hidden');
    this.renderStage();
  },

  stop() {
    const modal = document.getElementById('walkthrough-modal-backdrop');
    if (modal) modal.classList.add('hidden');
  },

  renderStage() {
    const data = this.stagesData[this.currentStage - 1];
    if (!data) return;

    // Header & Stage info
    document.getElementById('wt-step-title').textContent = data.title;
    document.getElementById('wt-stage-num').textContent = `STAGE ${data.stage} OF ${this.totalStages} • ${data.actor}`;
    document.getElementById('wt-step-description').textContent = data.description;
    document.getElementById('wt-data-preview').innerHTML = data.previewHtml;

    // Progress bar
    const progressPercent = (data.stage / this.totalStages) * 100;
    const fillEl = document.getElementById('wt-progress-fill');
    if (fillEl) fillEl.style.width = `${progressPercent}%`;

    // Step dots
    const dotsEl = document.getElementById('wt-step-dots');
    if (dotsEl) {
      dotsEl.innerHTML = Array.from({ length: this.totalStages }, (_, i) => `
        <div class="wt-dot ${i + 1 === data.stage ? 'active' : ''}"></div>
      `).join('');
    }

    // Previous / Next buttons
    const prevBtn = document.getElementById('wt-btn-prev');
    const nextBtn = document.getElementById('wt-btn-next');
    if (prevBtn) prevBtn.disabled = data.stage === 1;
    if (nextBtn) {
      nextBtn.innerHTML = data.stage === this.totalStages ? 'Finish Tour <i data-lucide="check"></i>' : 'Next Stage <i data-lucide="arrow-right"></i>';
    }

    // Automatically navigate the background view to match the stage!
    if (data.view === 'citizen') {
      App.setViewMode('citizen');
      if (data.citizenScreen) CitizenApp.goToScreen(data.citizenScreen);
    } else if (data.view === 'portal') {
      App.setViewMode('portal');
      if (data.portalTab) {
        document.querySelector(`.portal-tab[data-portal-tab="${data.portalTab}"]`)?.click();
      }
    } else if (data.view === 'crew') {
      App.setViewMode('crew');
    }

    if (window.lucide) lucide.createIcons();
  },

  nextStep() {
    if (this.currentStage < this.totalStages) {
      this.currentStage++;
      this.renderStage();
    } else {
      this.stop();
      showToast('10-Stage Walkthrough Complete! Explore any view interactively.', 'success');
      if (typeof confetti === 'function') {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      }
    }
  },

  prevStep() {
    if (this.currentStage > 1) {
      this.currentStage--;
      this.renderStage();
    }
  }
};

// Initialize Walkthrough click trigger
document.getElementById('start-walkthrough-btn')?.addEventListener('click', () => {
  Walkthrough.start();
});

