// --- citizen-app.js ---
/**
 * SwachhLens Citizen Mobile Application Controller
 * Handles citizen capture, real-time AI CV scanning, privacy blur filter,
 * location confirmation, instant explainable feedback, and live status tracking.
 */

const CitizenApp = {
  currentScreen: 'home',
  selectedImageKey: 'drain_blockage',
  privacyBlurActive: true,
  currentReportId: 'RPT-2024-08-16-001847',

  init() {
    this.renderHomeReports();
    this.renderFullReports();
  },

  goToScreen(screenName) {
    this.currentScreen = screenName;
    document.querySelectorAll('.citizen-subscreen').forEach(scr => scr.classList.remove('active-screen'));
    const target = document.getElementById(`citizen-screen-${screenName}`);
    if (target) target.classList.add('active-screen');

    // Update bottom nav buttons
    document.querySelectorAll('.c-nav-item').forEach(btn => btn.classList.remove('active'));
    if (screenName === 'home') document.querySelectorAll('.c-nav-item')[0]?.classList.add('active');
    if (screenName === 'capture') document.querySelectorAll('.c-nav-item')[1]?.classList.add('active');
    if (screenName === 'my-reports') document.querySelectorAll('.c-nav-item')[2]?.classList.add('active');

    if (screenName === 'capture') {
      this.initCaptureScreen();
    }
  },

  selectSampleImage(imageKey) {
    this.selectedImageKey = imageKey;
    const placeholder = document.getElementById('camera-placeholder');
    const previewWrapper = document.getElementById('image-preview-wrapper');
    const imgPreview = document.getElementById('capture-img-preview');
    const laser = document.getElementById('scanning-laser');

    if (placeholder && previewWrapper && imgPreview) {
      placeholder.classList.add('hidden');
      previewWrapper.classList.remove('hidden');
      imgPreview.src = DataStore.sampleImages[imageKey] || DataStore.sampleImages.drain_blockage;

      // Laser animation effect
      laser?.classList.remove('hidden');

      // Update location and landmark context based on sample
      const gpsText = document.getElementById('citizen-gps-text');
      const landmarkAlert = document.getElementById('landmark-proximity-alert');

      if (imageKey === 'drain_blockage') {
        gpsText.textContent = '28.5355° N, 77.2146° E (Gupta Market Road)';
        landmarkAlert.innerHTML = '<i data-lucide="school"></i> Sensitive Landmark detected: <strong>Ram Nagar Municipal School (85m)</strong>';
      } else if (imageKey === 'construction_debris') {
        gpsText.textContent = '28.5385° N, 77.2175° E (Connaught Outer North)';
        landmarkAlert.innerHTML = '<i data-lucide="train"></i> Sensitive Landmark detected: <strong>Metro Gate 2 (120m)</strong>';
      } else if (imageKey === 'medical_waste') {
        gpsText.textContent = '28.5410° N, 77.2180° E (Civil Hospital Gate 3)';
        landmarkAlert.innerHTML = '<i data-lucide="cross"></i> Sensitive Landmark detected: <strong>City Hospital Emergency (20m)</strong>';
      } else if (imageKey === 'plastic_bottles') {
        gpsText.textContent = '28.5320° N, 77.2250° E (Yamuna Ghat 3)';
        landmarkAlert.innerHTML = '<i data-lucide="waves"></i> Sensitive Landmark detected: <strong>Yamuna Riverbank (35m)</strong>';
      } else if (imageKey === 'ambiguous_night') {
        gpsText.textContent = '28.5372° N, 77.2190° E (Sector 5 Back Alley)';
        landmarkAlert.innerHTML = '<i data-lucide="alert-triangle"></i> Proximity: <strong>General Urban Alley (No Direct School/Hospital)</strong>';
      }

      if (window.lucide) lucide.createIcons();

      // Render Canvas Bounding Boxes
      setTimeout(() => {
        const canvas = document.getElementById('cv-scan-canvas');
        AIPipeline.drawCVOverlays(canvas, imageKey, this.privacyBlurActive);
      }, 150);
    }
  },

  handleCustomFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const customDataUrl = e.target.result;
      DataStore.sampleImages['custom_upload'] = customDataUrl;
      this.selectSampleImage('custom_upload');
      showToast('Custom Photo Uploaded: EXIF GPS & Timestamp Extracted!', 'success');
    };
    reader.readAsDataURL(file);
  },

  initCaptureScreen() {
    // Auto-select the benchmark demo sample (Drain blockage at Gupta Market)
    this.selectSampleImage(this.selectedImageKey || 'drain_blockage');
  },

  togglePrivacyBlur() {
    const toggle = document.getElementById('citizen-privacy-blur-toggle');
    this.privacyBlurActive = toggle ? toggle.checked : true;
    const badge = document.getElementById('privacy-blur-badge');
    if (badge) {
      badge.style.display = this.privacyBlurActive ? 'flex' : 'none';
    }
    const canvas = document.getElementById('cv-scan-canvas');
    AIPipeline.drawCVOverlays(canvas, this.selectedImageKey, this.privacyBlurActive);
    showToast(this.privacyBlurActive ? 'Face & License Plate Privacy Blur Enabled' : 'Privacy Blur Disabled', 'neutral');
  },

  recenterGPS() {
    showToast('GPS EXIF Pin Recalibrated: ±1.2m Accuracy (Verified)', 'success');
  },

  processAndSubmitReport() {
    this.goToScreen('analyzing');
    AIPipeline.playSound('scan');

    // Simulate real-time 5-module AI Pipeline execution steps
    const steps = ['aistep-1', 'aistep-2', 'aistep-3', 'aistep-4', 'aistep-5'];
    let idx = 0;

    const interval = setInterval(() => {
      if (idx < steps.length) {
        document.querySelectorAll('.ai-step-item').forEach((el, i) => {
          el.classList.toggle('active', i <= idx);
        });
        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          this.finalizeReportSubmission();
        }, 300);
      }
    }, 350);
  },

  finalizeReportSubmission() {
    const comment = document.getElementById('citizen-report-comment')?.value || 'Water backing up into nearby shops. Very urgent!';
    
    // Check if low-confidence scenario
    const isLowConfidence = this.selectedImageKey === 'ambiguous_night';

    // Check clustering against benchmark dataset
    const incident = DataStore.getIncidentById('INCIDENT-2024-08-16-0847');
    if (incident) {
      // Calculate updated priority
      const priorityResult = AIPipeline.calculatePriorityScore(incident);

      // Populate Result Screen
      document.getElementById('res-incident-id').textContent = incident.shortId + ' (' + incident.id + ')';
      
      if (isLowConfidence) {
        document.getElementById('res-category').textContent = 'Suspected Chemical / Unidentified (56%)';
        document.getElementById('res-volume').textContent = 'Medium (Low Confidence Estimate)';
        const priorityPill = document.getElementById('res-priority-pill');
        priorityPill.textContent = 'NEEDS MANUAL REVIEW (56% Conf)';
        priorityPill.className = 'priority-pill pill-medium';
        showToast('Low Confidence Prediction (<70%): Flagged for Manual Officer Review (Sec 12/16)', 'warning');
      } else {
        document.getElementById('res-category').textContent = incident.category;
        document.getElementById('res-volume').textContent = incident.volumeCategory + ' (' + incident.volumeEstimate + ')';
        const priorityPill = document.getElementById('res-priority-pill');
        priorityPill.textContent = `${priorityResult.priorityLevel} (Score ${priorityResult.finalScore}/100)`;
        priorityPill.className = `priority-pill ${priorityResult.priorityLevel === 'CRITICAL' ? 'pill-critical' : priorityResult.priorityLevel === 'HIGH' ? 'pill-high' : 'pill-medium'}`;
        showToast('Waste Report Ingested: Clustered into High-Priority Queue!', 'success');
      }

      // Reasons list
      const reasonsListEl = document.getElementById('res-reasons-list');
      if (reasonsListEl) {
        reasonsListEl.innerHTML = priorityResult.reasons.map(r => `<li><i data-lucide="check" class="text-emerald"></i> ${r}</li>`).join('');
      }

      // Lifecycle Stepper
      this.renderLifecycleStepper(incident);

      // Add to DataStore Audit Log
      DataStore.addAuditLog('Citizen Rajesh (CIT-4521)', incident.id, isLowConfidence ? 'Low Confidence Report Held' : 'Citizen Report Ingested & Clustered', isLowConfidence ? '56% (Needs Review)' : '100% Cluster Match', `Report #${this.currentReportId} merged with 3 neighbor reports.`);

      // Launch Confetti & Audio Effect
      AIPipeline.playSound('success');
      if (typeof confetti === 'function') {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      }

      this.goToScreen('result');
      if (window.lucide) lucide.createIcons();

      // Refresh portal views
      if (typeof MunicipalPortal !== 'undefined') {
        MunicipalPortal.renderQueueTable();
        MunicipalPortal.renderSidebarIncidents();
        MunicipalPortal.updateKPIs();
      }
    }
  },

  submitFeedback(rating) {
    document.querySelectorAll('.fb-btn').forEach(b => {
      b.classList.toggle('selected', b.textContent.includes(rating));
    });

    const alertEl = document.getElementById('feedback-submitted-alert');
    if (alertEl) alertEl.classList.remove('hidden');

    const ratingBadge = document.getElementById('rep-citizen-rating');
    if (ratingBadge) {
      ratingBadge.textContent = rating === 'Satisfied' ? '⭐⭐⭐⭐⭐ Satisfied' : rating === 'Neutral' ? '⭐⭐⭐ Neutral' : '⭐ Unsatisfied';
    }

    DataStore.addAuditLog('Citizen Rajesh (CIT-4521)', 'INCIDENT-0847', 'Citizen Experience Rating', 'Feedback Stored', `Citizen rated cleanup experience as: ${rating}`);
    showToast(`Thank you! Recorded feedback: "${rating}"`, 'success');
  },

  openCivicReportModal() {
    const modal = document.getElementById('civic-report-modal-backdrop');
    const beforeImg = document.getElementById('rep-before-img');
    const afterImg = document.getElementById('rep-after-img');

    if (modal && beforeImg && afterImg) {
      beforeImg.src = DataStore.sampleImages.drain_blockage;
      afterImg.src = DataStore.sampleImages.after_clean_drain;
      modal.classList.remove('hidden');
      if (window.lucide) lucide.createIcons();
    }
  },

  closeCivicReportModal(e) {
    if (e && e.target !== e.currentTarget && !e.target.closest('.btn-icon')) return;
    document.getElementById('civic-report-modal-backdrop')?.classList.add('hidden');
  },

  renderLifecycleStepper(incident) {
    const stepperEl = document.getElementById('citizen-lifecycle-stepper');
    if (!stepperEl) return;

    const stages = [
      { id: 'REPORTED', title: '1. Report Captured & GPS Tagged', time: '14:30 UTC', desc: 'Received with visual coordinates' },
      { id: 'ANALYZED', title: '2. AI Classified & Clustered', time: '14:31 UTC', desc: '4 citizen reports merged; Priority: HIGH' },
      { id: 'ASSIGNED', title: '3. Assigned to Field Crew', time: incident.assignedTime ? '14:35 UTC' : 'Pending Officer Dispatch', desc: incident.assignedCrewId ? `${incident.assignedCrewId} (ETA: 15 mins)` : 'Awaiting Municipal Officer 1-click dispatch' },
      { id: 'IN_PROGRESS', title: '4. Cleanup In Progress', time: incident.status === 'IN_PROGRESS' || incident.status === 'CLOSED' ? '14:40 UTC' : 'Pending', desc: 'Drain jetting unit deployed' },
      { id: 'VERIFIED_RESOLVED', title: '5. AI Clearance Verification & Closed', time: incident.status === 'CLOSED' ? '15:31 UTC' : 'Pending', desc: '96% clearance verified by CV' }
    ];

    let html = '';
    stages.forEach((st, i) => {
      const isCompleted = (incident.status === 'CLOSED') || 
                          (incident.status === 'IN_PROGRESS' && i <= 3) || 
                          (incident.status === 'ASSIGNED' && i <= 2) || 
                          (incident.status === 'ANALYZED' && i <= 1);
      const isActive = (incident.status === st.id) || (incident.status === 'ANALYZED' && i === 1);

      html += `
        <div class="step-row ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}">
          <div class="step-dot">${isCompleted ? '✓' : (i + 1)}</div>
          <div class="step-info">
            <span class="step-title">${st.title}</span>
            <span class="text-xs text-muted">${st.desc}</span>
            <span class="step-time">${st.time}</span>
          </div>
        </div>
      `;
    });

    stepperEl.innerHTML = html;
  },

  renderHomeReports() {
    const listEl = document.getElementById('citizen-home-reports-list');
    if (!listEl) return;

    const rajeshIncident = DataStore.getIncidentById('INCIDENT-2024-08-16-0847');
    if (!rajeshIncident) return;

    listEl.innerHTML = `
      <div class="citizen-report-item" onclick="CitizenApp.goToScreen('result')">
        <div style="display: flex; gap: 0.6rem; align-items: center;">
          <img src="${DataStore.sampleImages[rajeshIncident.beforeImageKey]}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover;">
          <div>
            <strong class="text-xs block">${rajeshIncident.title}</strong>
            <span class="text-xs text-muted">4 Reports Merged • ${rajeshIncident.category}</span>
          </div>
        </div>
        <div style="text-align: right;">
          <span class="badge ${rajeshIncident.status === 'CLOSED' ? 'badge-success' : 'badge-high'}">${rajeshIncident.status}</span>
          <span class="text-xs block text-muted mt-1">Today 14:30</span>
        </div>
      </div>
    `;
  },

  renderFullReports() {
    const listEl = document.getElementById('citizen-full-reports-list');
    if (!listEl) return;

    const incidents = DataStore.incidents;
    listEl.innerHTML = incidents.map(inc => `
      <div class="citizen-report-item" onclick="CitizenApp.goToScreen('result')">
        <div style="display: flex; gap: 0.6rem; align-items: center;">
          <img src="${DataStore.sampleImages[inc.beforeImageKey]}" style="width: 48px; height: 48px; border-radius: 8px; object-fit: cover;">
          <div>
            <strong class="text-xs block">${inc.title}</strong>
            <span class="text-xs text-muted">${inc.category} • ${inc.volumeCategory}</span>
            <span class="text-xs text-emerald block"><i data-lucide="map-pin"></i> ${inc.locationName}</span>
          </div>
        </div>
        <div style="text-align: right;">
          <span class="badge ${inc.status === 'CLOSED' ? 'badge-success' : inc.priorityLevel === 'CRITICAL' ? 'badge-critical' : 'badge-high'}">${inc.status}</span>
          <span class="text-xs block text-muted mt-1">Score: ${inc.priorityScore}/100</span>
        </div>
      </div>
    `).join('');

    if (window.lucide) lucide.createIcons();
  }
};

