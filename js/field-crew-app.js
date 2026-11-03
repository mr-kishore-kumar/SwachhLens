// --- field-crew-app.js ---
/**
 * SwachhLens Field Crew Mobile Application Controller
 * Provides field teams with assigned work orders, route directions,
 * before/after evidence capture, and closed-loop AI clearance verification.
 */

const FieldCrewApp = {
  activeJobId: 'INCIDENT-2024-08-16-0847',

  init() {
    this.renderJobsList();
  },

  renderJobsList() {
    const container = document.getElementById('crew-screen-content');
    if (!container) return;

    const assignedIncidents = DataStore.incidents.filter(i => i.assignedCrewId === 'Team-Sector5-A' || i.id === this.activeJobId);
    const job = DataStore.getIncidentById(this.activeJobId) || assignedIncidents[0];

    if (!job) {
      container.innerHTML = `<div class="p-4 text-center text-muted">No active work orders assigned to Team-Sector5-A.</div>`;
      return;
    }

    const isAssigned = job.status === 'ASSIGNED';
    const isInProgress = job.status === 'IN_PROGRESS';
    const isClosed = job.status === 'CLOSED';

    container.innerHTML = `
      <div class="crew-job-card">
        <div class="job-header">
          <div>
            <span class="badge ${job.priorityLevel === 'CRITICAL' ? 'badge-critical' : 'badge-high'}">${job.priorityLevel} WORK ORDER</span>
            <h3 style="font-size:1.1rem; margin-top:4px;">${job.title}</h3>
            <span class="text-xs text-muted"><i data-lucide="map-pin"></i> ${job.locationName}</span>
          </div>
          <span class="incident-id-tag">${job.shortId}</span>
        </div>

        <div class="job-req-box">
          <strong class="text-xs block text-emerald"><i data-lucide="wrench"></i> Required Equipment & Actions:</strong>
          <span class="text-xs text-muted block mt-1">• ${job.recommendedVehicle}</span>
          <span class="text-xs text-muted block">• High-Pressure Jetting Nozzles + Biohazard Safety Gloves</span>
          <span class="text-xs text-danger font-semibold block mt-1">⚠ Special Note: ${job.specialInstructions}</span>
        </div>

        <!-- Before Photo Evidence Reference -->
        <div style="margin-top:0.75rem;">
          <span class="text-xs font-semibold block mb-1">Citizen Reported Evidence (Before):</span>
          <img src="${DataStore.sampleImages[job.beforeImageKey]}" style="width:100%; height:140px; object-fit:cover; border-radius:8px; border:1px solid #cbd5e1;">
        </div>

        <!-- Status Workflow Actions -->
        <div style="margin-top:1rem;">
          ${isAssigned ? `
            <button class="btn btn-emerald btn-block" onclick="FieldCrewApp.startWork('${job.id}')">
              <i data-lucide="play"></i> Arrive on Site & Start Cleanup
            </button>
          ` : isInProgress ? `
            <div style="background:#fef3c7; border:1px solid #fde68a; padding:0.6rem; border-radius:8px; margin-bottom:0.75rem; font-size:0.75rem; color:#92400e;">
              <i data-lucide="clock"></i> Cleanup In Progress • Deployed Jetting Unit
            </div>
            <button class="btn btn-primary btn-block" onclick="FieldCrewApp.submitCleanupEvidence('${job.id}')">
              <i data-lucide="camera"></i> Upload After Photo & Verify
            </button>
          ` : `
            <div class="result-success-badge" style="justify-content:center;">
              <i data-lucide="check-circle-2"></i> Work Order Completed & Verified (96% Clearance)
            </div>
            <div style="margin-top:0.75rem;">
              <span class="text-xs font-semibold block mb-1">Uploaded After-Cleanup Proof:</span>
              <img src="${DataStore.sampleImages[job.afterImageKey]}" style="width:100%; height:130px; object-fit:cover; border-radius:8px; border:1px solid #a7f3d0;">
            </div>
          `}
        </div>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
  },

  startWork(jobId) {
    const job = DataStore.getIncidentById(jobId);
    if (!job) return;

    job.status = 'IN_PROGRESS';
    DataStore.save();
    DataStore.addAuditLog('Field Crew Ramesh Singh', job.id, 'Crew Arrived on Site', 'Status: IN_PROGRESS', 'Team-Sector5-A deployed drainage jetting unit.');

    this.renderJobsList();
    if (typeof MunicipalPortal !== 'undefined') {
      MunicipalPortal.renderQueueTable();
      MunicipalPortal.renderSidebarIncidents();
      MunicipalPortal.renderMapLayers();
    }
    if (typeof CitizenApp !== 'undefined') {
      CitizenApp.renderLifecycleStepper(job);
    }

    showToast('Work marked IN PROGRESS! Citizen notified that cleanup has begun.', 'success');
  },

  submitCleanupEvidence(jobId) {
    const job = DataStore.getIncidentById(jobId);
    if (!job) return;

    // Simulate Crew taking "After" photograph and AI verification
    job.status = 'CLOSED';
    job.clearanceScore = 96;
    DataStore.save();

    DataStore.addAuditLog('Field Crew Ramesh Singh', job.id, 'After Evidence Uploaded', 'AI Verification Passed: 96%', 'Drain blockage cleared, all waste debris removed.');

    if (typeof confetti === 'function') {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    }

    this.renderJobsList();
    if (typeof MunicipalPortal !== 'undefined') {
      MunicipalPortal.renderQueueTable();
      MunicipalPortal.renderSidebarIncidents();
      MunicipalPortal.renderMapLayers();
      MunicipalPortal.renderVerificationHub();
      MunicipalPortal.renderAuditLogs();
      MunicipalPortal.updateKPIs();
    }
    if (typeof CitizenApp !== 'undefined') {
      CitizenApp.renderLifecycleStepper(job);
      CitizenApp.renderHomeReports();
      CitizenApp.renderFullReports();
    }

    showToast('Cleanup Verified: 96% Clearance! Incident Officially Closed.', 'success');
  }
};

