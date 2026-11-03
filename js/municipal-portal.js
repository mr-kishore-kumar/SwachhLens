// --- municipal-portal.js ---
/**
 * SwachhLens Municipal Command Center Portal Controller
 * Implements GIS Map (Leaflet), Priority Triage Queue, Explainability Inspector Drawer,
 * Decision Engine Studio, Closed-Loop Verification Hub, and Audit Trail.
 */

const MunicipalPortal = {
  map: null,
  mapMarkers: [],
  mapCircles: [],
  landmarkMarkers: [],
  activeDrawerIncidentId: null,

  init() {
    this.initSubtabs();
    this.initGISMap();
    if (typeof City3DMap !== 'undefined') {
      setTimeout(() => City3DMap.init(), 100);
    }
    this.renderSidebarIncidents();
    this.renderQueueTable();
    this.renderVerificationHub();
    this.renderAuditLogs();
    this.updateKPIs();
    this.initFilterListeners();
  },

  toggle3DMode(is3D) {
    const wrapper3D = document.getElementById('gis-3d-city-wrapper');
    const wrapper2D = document.getElementById('gis-map');
    const tiltBar = document.getElementById('map-tilt-controls');
    const btn3D = document.getElementById('btn-mode-3d');
    const btn2D = document.getElementById('btn-mode-2d');

    if (is3D) {
      if (wrapper3D) wrapper3D.classList.remove('hidden');
      if (wrapper2D) wrapper2D.classList.add('hidden');
      if (tiltBar) tiltBar.style.display = 'flex';
      if (btn3D) btn3D.classList.add('active');
      if (btn2D) btn2D.classList.remove('active');
      if (typeof City3DMap !== 'undefined') {
        if (!City3DMap.isInitialized) City3DMap.init();
        City3DMap.onResize();
      }
    } else {
      if (wrapper3D) wrapper3D.classList.add('hidden');
      if (wrapper2D) wrapper2D.classList.remove('hidden');
      if (tiltBar) tiltBar.style.display = 'none';
      if (btn3D) btn3D.classList.remove('active');
      if (btn2D) btn2D.classList.add('active');
      if (this.map) {
        setTimeout(() => this.map.invalidateSize(), 50);
      }
    }
  },

  initSubtabs() {
    document.querySelectorAll('.portal-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabKey = tab.getAttribute('data-portal-tab');
        document.querySelectorAll('.portal-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.portal-tab-content').forEach(c => c.classList.remove('active-content'));

        tab.classList.add('active');
        const contentEl = document.getElementById(`tab-${tabKey}`);
        if (contentEl) contentEl.classList.add('active-content');

        if (tabKey === 'dashboard') {
          setTimeout(() => {
            if (this.map) this.map.invalidateSize();
            if (typeof City3DMap !== 'undefined') City3DMap.onResize();
          }, 200);
        }
      });
    });
  },

  tileLayer: null,
  drainagePolyline: null,

  initGISMap() {
    const mapContainer = document.getElementById('gis-map');
    if (!mapContainer || typeof L === 'undefined') return;

    // Centered on Sector-5 / Ram Nagar Ward 14 New Delhi
    this.map = L.map('gis-map', {
      center: [28.5365, 77.2185],
      zoom: 15,
      zoomControl: true
    });

    this.updateMapTiles();

    this.renderMapLayers();

    // Layer toggle checkboxes
    document.getElementById('layer-clusters-chk')?.addEventListener('change', () => this.renderMapLayers());
    document.getElementById('layer-sensitive-chk')?.addEventListener('change', () => this.renderMapLayers());
    document.getElementById('layer-drainage-chk')?.addEventListener('change', () => this.renderMapLayers());
  },

  updateMapTiles() {
    if (!this.map) return;
    const isDark = document.body.classList.contains('theme-dark');
    const tileUrl = isDark 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    if (this.tileLayer) {
      this.map.removeLayer(this.tileLayer);
    }

    this.tileLayer = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> | SwachhLens AI Geo-Engine',
      maxZoom: 19
    }).addTo(this.map);
  },

  renderMapLayers() {
    if (!this.map || typeof L === 'undefined') return;

    // Clear existing markers, circles, and drainage lines
    this.mapMarkers.forEach(m => this.map.removeLayer(m));
    this.mapCircles.forEach(c => this.map.removeLayer(c));
    this.landmarkMarkers.forEach(lm => this.map.removeLayer(lm));
    if (this.drainagePolyline) this.map.removeLayer(this.drainagePolyline);
    
    this.mapMarkers = [];
    this.mapCircles = [];
    this.landmarkMarkers = [];

    const showClusters = document.getElementById('layer-clusters-chk')?.checked !== false;
    const showSensitive = document.getElementById('layer-sensitive-chk')?.checked !== false;
    const showDrainage = document.getElementById('layer-drainage-chk')?.checked !== false;

    // 1. Glowing Animated Drainage Network Polyline
    if (showDrainage) {
      const drainageCoords = [
        [28.5410, 77.2140],
        [28.5385, 77.2150],
        [28.5356, 77.2147], // Gupta Market Drain Node
        [28.5340, 77.2180],
        [28.5320, 77.2250]  // Yamuna Outfall
      ];
      this.drainagePolyline = L.polyline(drainageCoords, {
        color: '#06b6d4',
        weight: 5,
        opacity: 0.85,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(this.map);
      this.drainagePolyline.bindPopup('<strong>Trunk Arterial Storm Drain Line 4</strong><br><span class="text-xs text-muted">Real-time Silt & Flow Monitoring Active</span>');
    }

    // 2. Sensitive Landmarks (Schools, Hospitals, River)
    if (showSensitive) {
      DataStore.sensitiveLandmarks.forEach(lm => {
        const iconColor = lm.type === 'school' ? '#8b5cf6' : lm.type === 'hospital' ? '#dc2626' : '#0284c7';
        const lmIcon = L.divIcon({
          className: 'custom-landmark-icon',
          html: `<div class="landmark-cyber-badge" style="background:${iconColor};">${lm.type === 'school' ? '🏫' : lm.type === 'hospital' ? '🏥' : '🌊'}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const marker = L.marker([lm.lat, lm.lng], { icon: lmIcon }).addTo(this.map);
        marker.bindPopup(`<strong>${lm.name}</strong><br><span class="text-xs text-muted">Sensitive Zone (+${lm.riskBonus} Location Risk Multiplier)</span>`);
        this.landmarkMarkers.push(marker);
      });
    }

    // 3. High-Tech Animated Radar Incident Markers
    if (showClusters) {
      DataStore.incidents.forEach(inc => {
        const isCritical = inc.priorityLevel === 'CRITICAL';
        const isHigh = inc.priorityLevel === 'HIGH';
        const markerClass = isCritical ? 'radar-marker-critical' : isHigh ? 'radar-marker-high' : 'radar-marker-medium';
        const markerColor = isCritical ? '#ef4444' : isHigh ? '#f59e0b' : '#3b82f6';

        // 100m Clustering Radius Circle with Neon Glow
        const circle = L.circle([inc.lat, inc.lng], {
          radius: 100,
          color: markerColor,
          fillColor: markerColor,
          fillOpacity: 0.16,
          weight: 2,
          dashArray: '6, 6'
        }).addTo(this.map);
        this.mapCircles.push(circle);

        // Custom Cyber Radar Sonar Marker
        const icon = L.divIcon({
          className: 'custom-cyber-marker',
          html: `
            <div class="cyber-radar-pin ${markerClass}">
              <div class="sonar-ring"></div>
              <div class="sonar-dot">${inc.priorityScore}</div>
              <div class="sonar-tag">${inc.shortId}</div>
            </div>
          `,
          iconSize: [44, 44],
          iconAnchor: [22, 22]
        });

        const marker = L.marker([inc.lat, inc.lng], { icon }).addTo(this.map);
        marker.bindPopup(`
          <div style="font-family:var(--font-sans); min-width:220px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <strong style="font-size:13px;">${inc.shortId}</strong>
              <span class="badge ${isCritical ? 'badge-critical' : isHigh ? 'badge-high' : 'badge-neutral'}">${inc.priorityLevel}</span>
            </div>
            <strong style="font-size:13px; display:block; color:#0f172a;">${inc.title}</strong>
            <p style="font-size:11px; color:#64748b; margin:4px 0;">${inc.category} • ${inc.volumeCategory}</p>
            <div style="font-size:11px; margin-bottom:6px; color:#10b981; font-weight:600;">✓ ${inc.clusterSize} Citizen Reports Merged</div>
            <button class="btn btn-primary btn-xs btn-block" onclick="MunicipalPortal.openDrawer('${inc.id}')">Inspect & Dispatch Crew</button>
          </div>
        `);

        marker.on('click', () => {
          this.highlightSidebarCard(inc.id);
        });

        this.mapMarkers.push(marker);
      });
    }
  },

  renderSidebarIncidents() {
    const listEl = document.getElementById('sidebar-incidents-list');
    if (!listEl) return;

    const filterVal = document.getElementById('sidebar-priority-filter')?.value || 'ALL';
    let incidents = [...DataStore.incidents];

    // Sort by priority score descending
    incidents.sort((a, b) => b.priorityScore - a.priorityScore);

    if (filterVal === 'CRITICAL') incidents = incidents.filter(i => i.priorityLevel === 'CRITICAL');
    if (filterVal === 'HIGH') incidents = incidents.filter(i => i.priorityLevel === 'HIGH');
    if (filterVal === 'UNASSIGNED') incidents = incidents.filter(i => i.status === 'ANALYZED' || i.status === 'REPORTED');

    listEl.innerHTML = incidents.map(inc => `
      <div class="incident-sidebar-card" id="sidebar-card-${inc.id}" onclick="MunicipalPortal.openDrawer('${inc.id}')">
        <div class="card-top-row">
          <span class="incident-id-tag">${inc.shortId}</span>
          <span class="badge ${inc.priorityLevel === 'CRITICAL' ? 'badge-critical' : inc.priorityLevel === 'HIGH' ? 'badge-high' : 'badge-medium'}">
            ${inc.priorityLevel} (Score ${inc.priorityScore})
          </span>
        </div>
        <span class="incident-loc-title">${inc.title}</span>
        <div class="card-meta-chips">
          <span class="badge badge-neutral text-xs"><i data-lucide="layers"></i> ${inc.clusterSize} Reports</span>
          <span class="badge badge-neutral text-xs">${inc.volumeCategory}</span>
          ${inc.hasDrainBlockage ? '<span class="badge badge-critical text-xs">Drain Blockage</span>' : ''}
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
          <span class="text-xs text-muted">${inc.status}</span>
          <span class="text-xs text-emerald font-semibold">Inspect →</span>
        </div>
      </div>
    `).join('');

    if (window.lucide) lucide.createIcons();
  },

  highlightSidebarCard(incidentId) {
    document.querySelectorAll('.incident-sidebar-card').forEach(c => c.classList.remove('active-selected'));
    const targetCard = document.getElementById(`sidebar-card-${incidentId}`);
    if (targetCard) {
      targetCard.classList.add('active-selected');
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  },

  renderQueueTable() {
    const tbody = document.getElementById('priority-queue-tbody');
    if (!tbody) return;

    const searchTerm = document.getElementById('queue-search-input')?.value.toLowerCase() || '';
    const catFilter = document.getElementById('queue-category-filter')?.value || 'ALL';
    const statusFilter = document.getElementById('queue-status-filter')?.value || 'ALL';

    let incidents = [...DataStore.incidents];
    incidents.sort((a, b) => b.priorityScore - a.priorityScore);

    if (searchTerm) {
      incidents = incidents.filter(i => i.title.toLowerCase().includes(searchTerm) || i.category.toLowerCase().includes(searchTerm) || i.shortId.toLowerCase().includes(searchTerm));
    }
    if (catFilter !== 'ALL') {
      incidents = incidents.filter(i => i.category.includes(catFilter) || i.rawCategory.includes(catFilter));
    }
    if (statusFilter !== 'ALL') {
      incidents = incidents.filter(i => i.status === statusFilter);
    }

    tbody.innerHTML = incidents.map((inc, rank) => `
      <tr>
        <td>
          <strong>#${rank + 1}</strong>
          <span class="incident-id-tag block">${inc.shortId}</span>
        </td>
        <td>
          <img src="${DataStore.sampleImages[inc.beforeImageKey]}" class="table-thumbnail" alt="Evidence">
        </td>
        <td>
          <strong>${inc.title}</strong>
          <span class="text-xs text-muted block"><i data-lucide="map-pin"></i> ${inc.locationName}</span>
          <span class="text-xs text-emerald font-semibold block">${inc.nearestLandmark}</span>
        </td>
        <td>
          <strong>${inc.category}</strong>
          <span class="text-xs text-muted block">Volume: ${inc.volumeCategory} (${inc.volumeEstimate})</span>
        </td>
        <td>
          <span class="badge badge-primary"><i data-lucide="git-merge"></i> ${inc.clusterSize} Reports Merged</span>
        </td>
        <td>
          <span class="badge ${inc.priorityLevel === 'CRITICAL' ? 'badge-critical' : inc.priorityLevel === 'HIGH' ? 'badge-high' : 'badge-medium'}">
            ${inc.priorityLevel} (${inc.priorityScore}/100)
          </span>
          <span class="text-xs text-muted block mt-1">${inc.escalationReason || 'Standard multi-factor score'}</span>
        </td>
        <td>
          <span class="badge badge-success"><i data-lucide="shield-check"></i> ${inc.aiConfidence}% (${inc.confidenceTier})</span>
        </td>
        <td>
          <span class="text-xs font-semibold block">${inc.recommendedTeam}</span>
          <span class="text-xs text-muted">${inc.recommendedVehicle}</span>
        </td>
        <td>
          <span class="badge ${inc.status === 'CLOSED' ? 'badge-success' : inc.status === 'IN_PROGRESS' ? 'badge-warning' : 'badge-neutral'}">
            ${inc.status}
          </span>
        </td>
        <td>
          <button class="btn btn-primary btn-xs" onclick="MunicipalPortal.openDrawer('${inc.id}')">
            <i data-lucide="send"></i> Dispatch
          </button>
        </td>
      </tr>
    `).join('');

    if (window.lucide) lucide.createIcons();
  },

  openInspector(incidentId) {
    this.openDrawer(incidentId);
  },

  openDrawer(incidentId) {
    this.activeDrawerIncidentId = incidentId;
    if (typeof City3DMap !== 'undefined') {
      City3DMap.focusIncident(incidentId);
    }
    const incident = DataStore.getIncidentById(incidentId);
    if (!incident) return;

    const drawerBackdrop = document.getElementById('incident-drawer-backdrop');
    if (!drawerBackdrop) return;

    document.getElementById('drawer-incident-badge-id').textContent = incident.shortId + ' (' + incident.id + ')';
    document.getElementById('drawer-incident-title').textContent = incident.title;
    document.getElementById('drawer-incident-time').textContent = `Reported: ${incident.reportedTime} • Location: ${incident.locationName}`;
    document.getElementById('drawer-cv-confidence').textContent = `${incident.aiConfidence}% AI Confidence (${incident.confidenceTier})`;
    document.getElementById('drawer-incident-img').src = DataStore.sampleImages[incident.beforeImageKey];

    // Tags
    const tagsEl = document.getElementById('drawer-cv-tags');
    if (tagsEl && incident.detectedTags) {
      tagsEl.innerHTML = incident.detectedTags.map(t => `<span class="badge badge-neutral text-xs">${t}</span>`).join('');
    }

    // Cluster count
    document.getElementById('drawer-cluster-count').textContent = `${incident.clusterSize} Citizen Reports Merged (Cluster Radius: 25m)`;

    // Priority Math
    const priorityResult = AIPipeline.calculatePriorityScore(incident);
    document.getElementById('drawer-priority-score').textContent = `${priorityResult.finalScore}/100 → ${priorityResult.priorityLevel} Priority`;
    document.getElementById('drawer-escalation-tag').style.display = priorityResult.wasEscalated ? 'inline-flex' : 'none';

    // Formula Step Math
    const formulaStepsEl = document.getElementById('drawer-formula-steps');
    if (formulaStepsEl) {
      formulaStepsEl.innerHTML = `
        <div>• Hazard (${DataStore.weights.w1_hazard}% × ${priorityResult.contributions.hazard.value}) = <strong>${priorityResult.contributions.hazard.contribution} pts</strong></div>
        <div>• Volume (${DataStore.weights.w2_volume}% × ${priorityResult.contributions.volume.value}) = <strong>${priorityResult.contributions.volume.contribution} pts</strong></div>
        <div>• Location Risk (${DataStore.weights.w3_georisk}% × ${priorityResult.contributions.locationRisk.value}) = <strong>${priorityResult.contributions.locationRisk.contribution} pts</strong></div>
        <div>• Lingering Age (${DataStore.weights.w4_age}% × ${priorityResult.contributions.age.value}) = <strong>${priorityResult.contributions.age.contribution} pts</strong></div>
        <div>• Public Frequency (${DataStore.weights.w5_frequency}% × ${priorityResult.contributions.frequency.value}) = <strong>${priorityResult.contributions.frequency.contribution} pts</strong></div>
        <div style="border-top:1px dashed #cbd5e1; padding-top:4px; margin-top:2px;">= <strong>${priorityResult.rawScore} / 100 → Rounded ${priorityResult.finalScore}/100</strong></div>
      `;
    }

    // Recommendation card
    const rec = AIPipeline.generateRecommendation(incident, priorityResult);
    document.getElementById('drawer-rec-team').textContent = rec.team;
    document.getElementById('drawer-rec-vehicle').textContent = rec.vehicle;
    document.getElementById('drawer-rec-coord').textContent = rec.specialInstructions;
    document.getElementById('drawer-rec-eta').textContent = `${rec.durationMinutes} min cleanup (ETA: ${rec.etaMinutes} min)`;

    drawerBackdrop.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();

    // Render Canvas CV Bounding Boxes
    setTimeout(() => {
      const canvas = document.getElementById('drawer-cv-canvas');
      AIPipeline.drawCVOverlays(canvas, incident.beforeImageKey, true);
    }, 150);
  },

  closeDrawer(e) {
    if (e && e.target !== e.currentTarget && !e.target.closest('.btn-icon')) return;
    document.getElementById('incident-drawer-backdrop')?.classList.add('hidden');
  },

  assignIncidentFromDrawer() {
    if (!this.activeDrawerIncidentId) return;
    const incident = DataStore.getIncidentById(this.activeDrawerIncidentId);
    if (!incident) return;

    const selectedTeam = document.getElementById('drawer-assign-team-select')?.value || 'Team-Sector5-A';
    const officerNote = document.getElementById('drawer-officer-note')?.value || 'Coordinated timing';

    incident.status = 'ASSIGNED';
    incident.assignedCrewId = selectedTeam;
    incident.assignedTime = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    DataStore.save();
    DataStore.addAuditLog('Officer Priya Sharma (AUT-2341)', incident.id, 'One-Click Team Assignment', 'Manual Confirmation', `Assigned to ${selectedTeam}. Note: "${officerNote}"`);

    AIPipeline.playSound('dispatch');
    this.closeDrawer();
    this.renderQueueTable();
    this.renderSidebarIncidents();
    this.renderMapLayers();
    this.updateKPIs();
    this.renderVerificationHub();

    if (typeof FieldCrewApp !== 'undefined') {
      FieldCrewApp.renderJobsList();
    }

    showToast(`Assigned ${incident.shortId} to ${selectedTeam}! Citizen notified via SMS.`, 'success');
  },

  reassignIncident() {
    showToast('Decision Rule Overrides Unlocked for Officer Priya Sharma', 'neutral');
  },

  renderVerificationHub() {
    const grid = document.getElementById('verification-work-grid');
    if (!grid) return;

    const benchmarkIncident = DataStore.getIncidentById('INCIDENT-2024-08-16-0847');
    if (!benchmarkIncident) return;

    const isClosed = benchmarkIncident.status === 'CLOSED';
    const isFailed = benchmarkIncident.status === 'VERIFICATION_FAILED';

    grid.innerHTML = `
      <div class="verify-card card">
        <div class="verify-header">
          <div>
            <span class="incident-id-tag">${benchmarkIncident.shortId}</span>
            <h4 style="margin:2px 0;">${benchmarkIncident.title}</h4>
            <span class="text-xs text-muted">Field Crew: Team-Sector5-A (Lead: Ramesh Singh)</span>
          </div>
          <span class="badge ${isClosed ? 'badge-success' : isFailed ? 'badge-critical' : 'badge-warning'}">
            ${isClosed ? 'VERIFIED CLOSED' : isFailed ? 'VERIFICATION FAILED (RE-ASSIGNED)' : 'AWAITING VERIFICATION'}
          </span>
        </div>

        <div class="compare-images-grid">
          <div class="compare-box">
            <span class="text-danger">1. Before Cleanup (Citizen Report)</span>
            <img src="${DataStore.sampleImages[benchmarkIncident.beforeImageKey]}" class="compare-img" alt="Before">
          </div>
          <div class="compare-box">
            <span class="text-emerald">2. After Cleanup (Crew Submission)</span>
            <img src="${DataStore.sampleImages[benchmarkIncident.afterImageKey]}" class="compare-img" alt="After">
          </div>
        </div>

        <div class="ai-verification-scorecard">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong><i data-lucide="cpu"></i> AI Computer Vision Clearance Engine</strong>
            <span class="badge badge-success">96% Clearance Verified</span>
          </div>
          <p class="text-xs text-muted mt-2">
            • Object Detection: 0 residual waste items detected.<br>
            • Drain Patency: Unobstructed storm drain opening verified (>90% threshold PASSED).<br>
            • Visual EXIF Matching: Location confirmed within 1.4m of original incident coordinates.
          </p>
        </div>

        <div style="display:flex; gap:0.75rem; margin-top:1rem; flex-wrap:wrap;">
          ${!isClosed ? `
            <button class="btn btn-primary flex-1" onclick="MunicipalPortal.verifyAndCloseIncident('${benchmarkIncident.id}')">
              <i data-lucide="check-check"></i> Approve AI Verification & Close Incident
            </button>
            <button class="btn btn-outline text-danger" onclick="MunicipalPortal.rejectVerification('${benchmarkIncident.id}')" title="Test Alternative Failure Path (Section 13.2)">
              <i data-lucide="x-circle"></i> Reject (<90% Clean)
            </button>
          ` : `
            <div class="result-success-badge flex-1">
              <i data-lucide="check-circle-2"></i> Incident Officially Closed & Citizen Rajesh Notified!
            </div>
            <button class="btn btn-outline btn-xs" onclick="CitizenApp.openCivicReportModal()">
              <i data-lucide="award"></i> View Civic Resolution Certificate
            </button>
          `}
        </div>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
  },

  rejectVerification(incidentId) {
    const incident = DataStore.getIncidentById(incidentId);
    if (!incident) return;

    incident.status = 'VERIFICATION_FAILED';
    DataStore.save();
    DataStore.addAuditLog('Officer Priya Sharma', incident.id, 'Verification Rejected', 'Clearance <90%', 'Incident flagged for secondary sweep and re-assigned to field crew.');

    this.renderVerificationHub();
    this.renderQueueTable();
    this.renderSidebarIncidents();
    showToast('Verification Marked Incomplete: Sent back for re-cleanup (Section 13.2 / 18)', 'warning');
  },

  verifyAndCloseIncident(incidentId) {
    const incident = DataStore.getIncidentById(incidentId);
    if (!incident) return;

    incident.status = 'CLOSED';
    incident.clearanceScore = 96;
    DataStore.save();

    AIPipeline.playSound('success');
    DataStore.addAuditLog('Officer Priya Sharma (AUT-2341)', incident.id, 'Cleanup Verified & Closed', '96% AI Clearance Validated', 'Closed loop complete. Citizen SMS & in-app feedback trigger dispatched.');

    if (typeof confetti === 'function') {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    }

    this.renderVerificationHub();
    this.renderQueueTable();
    this.renderSidebarIncidents();
    this.renderMapLayers();
    this.updateKPIs();
    this.renderAuditLogs();

    if (typeof CitizenApp !== 'undefined') {
      CitizenApp.renderHomeReports();
      CitizenApp.renderFullReports();
      CitizenApp.renderLifecycleStepper(incident);
    }
    if (typeof FieldCrewApp !== 'undefined') {
      FieldCrewApp.renderJobsList();
    }

    showToast(`Incident ${incident.shortId} Closed! Resolution notification sent to Citizen Rajesh.`, 'success');
  },

  renderAuditLogs() {
    const tbody = document.getElementById('audit-log-tbody');
    if (!tbody) return;

    tbody.innerHTML = DataStore.auditLogs.slice(0, 10).map(log => `
      <tr>
        <td><code>${log.timestamp}</code></td>
        <td><strong>${log.actor}</strong></td>
        <td><code>${log.incidentId}</code></td>
        <td><span class="badge badge-neutral">${log.action}</span></td>
        <td><span class="text-xs text-emerald">${log.confidence}</span></td>
        <td><span class="text-xs text-muted">${log.details}</span></td>
      </tr>
    `).join('');
  },

  updateKPIs() {
    const incidents = DataStore.incidents;
    const criticalCount = incidents.filter(i => i.priorityLevel === 'CRITICAL').length;
    const highCount = incidents.filter(i => i.priorityLevel === 'HIGH').length;
    const medLowCount = incidents.filter(i => i.priorityLevel === 'MEDIUM' || i.priorityLevel === 'LOW' || i.priorityLevel === 'MEDIUM-HIGH').length;

    const critEl = document.getElementById('kpi-critical-val');
    const highEl = document.getElementById('kpi-high-val');
    const medEl = document.getElementById('kpi-med-val');
    const queueBadge = document.getElementById('queue-badge-count');

    if (critEl) critEl.textContent = criticalCount;
    if (highEl) highEl.textContent = highCount;
    if (medEl) medEl.textContent = medLowCount;
    if (queueBadge) queueBadge.textContent = criticalCount + highCount;
  },

  initFilterListeners() {
    document.getElementById('sidebar-priority-filter')?.addEventListener('change', () => this.renderSidebarIncidents());
    document.getElementById('queue-search-input')?.addEventListener('input', () => this.renderQueueTable());
    document.getElementById('queue-category-filter')?.addEventListener('change', () => this.renderQueueTable());
    document.getElementById('queue-status-filter')?.addEventListener('change', () => this.renderQueueTable());
  }
};

/**
 * Decision Engine Studio Configuration Controller
 */
const DecisionEngine = {
  updateWeightPreview() {
    const w1 = parseInt(document.getElementById('slider-w1')?.value || 35);
    const w2 = parseInt(document.getElementById('slider-w2')?.value || 25);
    const w3 = parseInt(document.getElementById('slider-w3')?.value || 20);
    const w4 = parseInt(document.getElementById('slider-w4')?.value || 15);
    const w5 = parseInt(document.getElementById('slider-w5')?.value || 5);

    document.getElementById('val-w1').textContent = `${w1}%`;
    document.getElementById('val-w2').textContent = `${w2}%`;
    document.getElementById('val-w3').textContent = `${w3}%`;
    document.getElementById('val-w4').textContent = `${w4}%`;
    document.getElementById('val-w5').textContent = `${w5}%`;

    const total = w1 + w2 + w3 + w4 + w5;
    const totalEl = document.getElementById('total-weight-sum');
    const statusEl = document.getElementById('weight-total-status');

    if (totalEl) totalEl.textContent = `${total}%`;
    if (statusEl) {
      if (total === 100) {
        statusEl.innerHTML = `<span>Total Weight Sum: <strong id="total-weight-sum">100%</strong></span><span class="text-emerald font-semibold">✓ Balanced</span>`;
      } else {
        statusEl.innerHTML = `<span>Total Weight Sum: <strong id="total-weight-sum" class="text-danger">${total}%</strong></span><span class="text-danger font-semibold">⚠ Must equal 100%</span>`;
      }
    }
  },

  saveWeights() {
    const w1 = parseInt(document.getElementById('slider-w1')?.value || 35);
    const w2 = parseInt(document.getElementById('slider-w2')?.value || 25);
    const w3 = parseInt(document.getElementById('slider-w3')?.value || 20);
    const w4 = parseInt(document.getElementById('slider-w4')?.value || 15);
    const w5 = parseInt(document.getElementById('slider-w5')?.value || 5);

    if (w1 + w2 + w3 + w4 + w5 !== 100) {
      showToast('Error: Weight multipliers must sum to exactly 100%', 'error');
      return;
    }

    DataStore.weights = { w1_hazard: w1, w2_volume: w2, w3_georisk: w3, w4_age: w4, w5_frequency: w5 };
    DataStore.save();

    // Recalculate priority scores across all incidents
    DataStore.incidents.forEach(inc => {
      const res = AIPipeline.calculatePriorityScore(inc, DataStore.weights);
      inc.priorityScore = res.finalScore;
      inc.priorityLevel = res.priorityLevel;
    });
    DataStore.save();

    DataStore.addAuditLog('Officer Priya Sharma', 'Global', 'Decision Weights Updated', 'Configured', `w1:${w1}%, w2:${w2}%, w3:${w3}%, w4:${w4}%, w5:${w5}%`);

    MunicipalPortal.renderQueueTable();
    MunicipalPortal.renderSidebarIncidents();
    MunicipalPortal.renderMapLayers();
    MunicipalPortal.updateKPIs();
    MunicipalPortal.renderAuditLogs();

    showToast('Decision engine weights updated! All incident scores recomputed.', 'success');
  }
};

