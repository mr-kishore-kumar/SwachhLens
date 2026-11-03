// --- ai-pipeline.js ---
/**
 * SwachhLens AI Pipeline & Decision Intelligence Engine
 * Implements 5 AI modules:
 * 1. Waste Classification (8 classes)
 * 2. Waste Region & Bounding Box Detection
 * 3. Approximate Volumetric Categorization via Scale Anchoring
 * 4. 4-Signal Geo-Spatial Duplicate Clustering Engine
 * 5. Multi-Factor Explainable Priority Scoring & Smart Resource Matching
 * Plus Closed-Loop Image Clearance Verification
 */

const AIPipeline = {
  // 8 Waste Categories with Base Hazard Ratings (Docs Section 10.1)
  hazardWeightsMap: {
    'Hazardous Waste': 100,
    'Biohazard / Medical': 100,
    'Hazardous Bio-waste / Sharps': 100,
    'Drain Blockage': 90,
    'E-waste': 75,
    'Organic Waste + Mixed Garbage': 70,
    'Organic Waste': 70,
    'Garbage Dump': 70,
    'Construction Debris': 60,
    'Plastic Waste': 40,
    'Plastic Waste / Recyclables': 40,
    'Overflowing Bin': 30,
    'Small Litter': 20
  },

  // 4 Volume Categories with Volume Weights
  volumeWeightsMap: {
    'Very Large': 100,
    'Large': 70,
    'Medium': 40,
    'Small': 20
  },

  /**
   * Module 1: AI Waste Classification Simulation
   */
  classifyWaste(imageKey) {
    switch (imageKey) {
      case 'drain_blockage':
        return {
          primaryCategory: 'Organic Waste + Mixed Garbage',
          rawCategory: 'Organic Waste',
          confidence: 87,
          confidenceTier: 'HIGH',
          hasDrainBlockage: true,
          detectedObjects: ['Plastic bags (89%)', 'Food waste (94%)', 'Silt / Foliage (86%)', 'Drain blockage (92%)']
        };
      case 'construction_debris':
        return {
          primaryCategory: 'Construction Debris',
          rawCategory: 'Construction Debris',
          confidence: 91,
          confidenceTier: 'HIGH',
          hasDrainBlockage: false,
          detectedObjects: ['Broken concrete (95%)', 'Brick rubble (91%)', 'Cement sacks (84%)']
        };
      case 'medical_waste':
        return {
          primaryCategory: 'Hazardous Bio-waste / Sharps',
          rawCategory: 'Hazardous Waste',
          confidence: 94,
          confidenceTier: 'HIGH',
          hasDrainBlockage: false,
          detectedObjects: ['Red clinical bags (97%)', 'Needle sharps (92%)', 'Biohazard warning logo (99%)']
        };
      case 'plastic_bottles':
        return {
          primaryCategory: 'Plastic Waste / Recyclables',
          rawCategory: 'Plastic Waste',
          confidence: 89,
          confidenceTier: 'HIGH',
          hasDrainBlockage: false,
          detectedObjects: ['PET water bottles (96%)', 'Polystyrene cups (91%)', 'Food wrappers (88%)']
        };
      case 'ambiguous_night':
        return {
          primaryCategory: 'Suspected Hazardous / Chemical Drums (Uncertain)',
          rawCategory: 'Hazardous Waste',
          confidence: 56,
          confidenceTier: 'LOW',
          needsReview: true,
          hasDrainBlockage: false,
          detectedObjects: ['Unclear cylinder shape (56%)', 'Low visibility noise (78%)']
        };
      default:
        return {
          primaryCategory: 'Organic Waste + Mixed Garbage',
          rawCategory: 'Organic Waste',
          confidence: 85,
          confidenceTier: 'HIGH',
          hasDrainBlockage: true,
          detectedObjects: ['Mixed Municipal Waste', 'Debris']
        };
    }
  },

  /**
   * Module 2 & 3: Bounding Box & Volumetric Estimation
   */
  estimateVolume(imageKey) {
    switch (imageKey) {
      case 'drain_blockage':
        return {
          category: 'Large',
          cubicMeters: '~1.2 - 1.5 m³',
          confidence: 78,
          confidenceNote: 'Scale anchored against standard 0.3m drain curb'
        };
      case 'construction_debris':
        return {
          category: 'Large',
          cubicMeters: '~3.5 m³',
          confidence: 84,
          confidenceNote: 'Scale anchored against roadway lane width'
        };
      case 'medical_waste':
        return {
          category: 'Medium',
          cubicMeters: '~0.6 m³',
          confidence: 92,
          confidenceNote: 'Scale anchored against standard medical bin height'
        };
      case 'plastic_bottles':
        return {
          category: 'Large',
          cubicMeters: '~1.8 m³',
          confidence: 80,
          confidenceNote: 'Scale anchored against promenade pedestrian bench'
        };
      case 'ambiguous_night':
        return {
          category: 'Medium',
          cubicMeters: '~0.5 m³ (Low Confidence)',
          confidence: 52,
          confidenceNote: 'Low visual evidence; human categorization required'
        };
      default:
        return {
          category: 'Medium',
          cubicMeters: '~0.8 m³',
          confidence: 75,
          confidenceNote: 'General surface estimation'
        };
    }
  },

  /**
   * Draw computer vision bounding boxes and detection overlays on canvas
   */
  drawCVOverlays(canvas, imageKey, isBlurred) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.parentElement.clientWidth || 300;
    const height = canvas.height = canvas.parentElement.clientHeight || 200;
    ctx.clearRect(0, 0, width, height);

    if (imageKey === 'drain_blockage') {
      // Bounding Box 1: Drain Blockage (Red Alert)
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 2]);
      ctx.strokeRect(width * 0.25, height * 0.45, width * 0.5, height * 0.45);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(width * 0.25, height * 0.45 - 20, 140, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText('DRAIN BLOCKAGE 92%', width * 0.25 + 6, height * 0.45 - 6);

      // Bounding Box 2: Mixed Organic / Plastic
      ctx.strokeStyle = '#10b981';
      ctx.setLineDash([]);
      ctx.strokeRect(width * 0.35, height * 0.52, width * 0.3, height * 0.3);
      ctx.fillStyle = '#059669';
      ctx.fillRect(width * 0.35, height * 0.52 - 18, 120, 18);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Organic + Plastic 87%', width * 0.35 + 4, height * 0.52 - 5);
    } else if (imageKey === 'construction_debris') {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(width * 0.15, height * 0.35, width * 0.7, height * 0.55);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(width * 0.15, height * 0.35 - 20, 150, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText('CONSTRUCTION DEBRIS 91%', width * 0.15 + 6, height * 0.35 - 6);
    } else if (imageKey === 'medical_waste') {
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 3;
      ctx.strokeRect(width * 0.3, height * 0.38, width * 0.4, height * 0.5);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(width * 0.3, height * 0.38 - 20, 160, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText('BIOHAZARD SHARPS 94%', width * 0.3 + 6, height * 0.38 - 6);
    } else if (imageKey === 'ambiguous_night') {
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(width * 0.25, height * 0.35, width * 0.5, height * 0.5);
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(width * 0.25, height * 0.35 - 22, 190, 22);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText('⚠️ LOW CONFIDENCE 56% (VERIFY)', width * 0.25 + 6, height * 0.35 - 7);
    }

    // Privacy-by-design Pedestrian Blur indicator if active
    if (isBlurred) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.beginPath();
      ctx.arc(width * 0.88, height * 0.2, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#bae6fd';
      ctx.font = '8px Inter, sans-serif';
      ctx.fillText('BLURRED', width * 0.88 - 18, height * 0.2 + 3);
    }
  },

  /**
   * Module 4: 4-Signal Geo-Spatial Duplicate Clustering Engine
   * Evaluates:
   * 1. GPS Distance (<= 100m -> +25)
   * 2. Time Window (<= 4h -> +25)
   * 3. Category Match (+25)
   * 4. Image Similarity (pHash score >= 0.75 -> +25)
   * Total Score >= 75 points creates / merges cluster!
   */
  evaluateClustering(newReport, existingReports) {
    let bestCluster = null;
    let maxScore = 0;
    let signalBreakdown = null;

    for (const existing of existingReports) {
      const distanceMeters = this.calculateDistance(newReport.lat, newReport.lng, existing.lat, existing.lng);
      const timeDiffHours = Math.abs((new Date(newReport.time || Date.now()) - new Date(existing.reportedTime || Date.now())) / 3600000);
      const categoryMatch = (newReport.rawCategory === existing.rawCategory || existing.category.includes(newReport.rawCategory));
      const imageSim = 0.82; // Simulated robust perceptual hash match

      let score = 0;
      const signals = {
        gpsMatch: false,
        gpsScore: 0,
        distanceMeters: Math.round(distanceMeters),
        timeMatch: false,
        timeScore: 0,
        timeDiffHours: timeDiffHours.toFixed(1),
        categoryMatch: false,
        categoryScore: 0,
        imageMatch: false,
        imageScore: 0,
        imageSimilarity: imageSim
      };

      if (distanceMeters <= 100) {
        score += 25;
        signals.gpsMatch = true;
        signals.gpsScore = 25;
      }
      if (timeDiffHours <= 4) {
        score += 25;
        signals.timeMatch = true;
        signals.timeScore = 25;
      }
      if (categoryMatch) {
        score += 25;
        signals.categoryMatch = true;
        signals.categoryScore = 25;
      }
      if (imageSim >= 0.75) {
        score += 25;
        signals.imageMatch = true;
        signals.imageScore = 25;
      }

      if (score >= 75 && score > maxScore) {
        maxScore = score;
        bestCluster = existing;
        signalBreakdown = signals;
      }
    }

    return {
      isClustered: maxScore >= 75,
      matchedIncident: bestCluster,
      matchScore: maxScore,
      signals: signalBreakdown
    };
  },

  /**
   * Module 5: Multi-Factor Explainable Priority Scoring
   * Formula: Priority = (w1*Hazard + w2*Volume + w3*GeoRisk + w4*Age + w5*Frequency) / 100
   */
  calculatePriorityScore(incidentData, weights = DataStore.weights) {
    const w1 = (weights.w1_hazard || 35) / 100;
    const w2 = (weights.w2_volume || 25) / 100;
    const w3 = (weights.w3_georisk || 20) / 100;
    const w4 = (weights.w4_age || 15) / 100;
    const w5 = (weights.w5_frequency || 5) / 100;

    // 1. Hazard Score (0 - 100)
    let hazardVal = this.hazardWeightsMap[incidentData.category] || this.hazardWeightsMap[incidentData.rawCategory] || 70;
    if (incidentData.hasDrainBlockage) {
      hazardVal = Math.min(100, hazardVal + 15); // +15 hazard bonus for drain block
    }
    const c1 = w1 * hazardVal;

    // 2. Volume Score (0 - 100)
    const volumeVal = this.volumeWeightsMap[incidentData.volumeCategory] || 70;
    const c2 = w2 * volumeVal;

    // 3. Location Risk Score (0 - 100)
    let locationRiskVal = 0;
    if (incidentData.nearestLandmark && incidentData.landmarkDistanceMeters <= 100) {
      if (incidentData.nearestLandmark.includes('School')) locationRiskVal += 20;
      if (incidentData.nearestLandmark.includes('Hospital')) locationRiskVal += 15;
      if (incidentData.nearestLandmark.includes('Yamuna') || incidentData.nearestLandmark.includes('Water')) locationRiskVal += 15;
    }
    if (incidentData.hasDrainBlockage) {
      locationRiskVal += 25; // Proximity to active drain
    }
    locationRiskVal = Math.min(100, locationRiskVal);
    const c3 = w3 * locationRiskVal;

    // 4. Complaint Age Factor (0 - 100)
    const ageHours = incidentData.ageHours || 0.5;
    const ageFactor = Math.min(100, (ageHours / 48) * 100);
    const c4 = w4 * ageFactor;

    // 5. Citizen Report Frequency Factor (0 - 100)
    const clusterSize = incidentData.clusterSize || 1;
    const frequencyFactor = Math.min(100, (clusterSize / 10) * 100);
    const c5 = w5 * frequencyFactor;

    // Total Score Calculation
    let rawScore = c1 + c2 + c3 + c4 + c5;
    let finalScore = Math.round(rawScore);

    // Priority Level Tier (Docs Section 10.1 & 11)
    let priorityLevel = 'LOW';
    if (finalScore >= 80) priorityLevel = 'CRITICAL';
    else if (finalScore >= 60) priorityLevel = 'HIGH';
    else if (finalScore >= 40) priorityLevel = 'MEDIUM-HIGH';
    else if (finalScore >= 20) priorityLevel = 'MEDIUM';
    else priorityLevel = 'LOW';

    // Automatic Escalation Rule: Drain blockage near sensitive area upgrades to HIGH
    let wasEscalated = false;
    if (incidentData.hasDrainBlockage && (priorityLevel === 'MEDIUM' || priorityLevel === 'MEDIUM-HIGH')) {
      priorityLevel = 'HIGH';
      wasEscalated = true;
    }

    return {
      rawScore: rawScore.toFixed(2),
      finalScore,
      priorityLevel,
      wasEscalated,
      contributions: {
        hazard: { weight: weights.w1_hazard, value: hazardVal, contribution: c1.toFixed(2) },
        volume: { weight: weights.w2_volume, value: volumeVal, contribution: c2.toFixed(2) },
        locationRisk: { weight: weights.w3_georisk, value: locationRiskVal, contribution: c3.toFixed(2) },
        age: { weight: weights.w4_age, value: ageFactor.toFixed(1), contribution: c4.toFixed(2) },
        frequency: { weight: weights.w5_frequency, value: frequencyFactor.toFixed(1), contribution: c5.toFixed(2) }
      },
      reasons: [
        `${incidentData.volumeCategory} waste volume accumulation (${volumeVal} pts)`,
        `${clusterSize} citizen reports merged in active cluster (${frequencyFactor.toFixed(0)} pts)`,
        incidentData.hasDrainBlockage ? 'Drain blockage detected (+25 location risk, automatic escalation)' : 'Standard drainage path',
        incidentData.nearestLandmark ? `Within ${incidentData.landmarkDistanceMeters}m of ${incidentData.nearestLandmark}` : 'General municipal zone'
      ]
    };
  },

  /**
   * Decision Engine: Smart Action & Resource Matching Rules
   */
  generateRecommendation(incidentData, priorityResult) {
    const isDrain = incidentData.hasDrainBlockage;
    const cat = incidentData.category;
    const vol = incidentData.volumeCategory;

    if (cat.includes('Hazardous') || cat.includes('Bio-waste')) {
      return {
        team: 'Certified Hazmat Disposal Specialists (2 Handlers)',
        vehicle: 'Dedicated Bio-Medical Incinerator Van (Grade-A PPE)',
        partner: 'State Pollution Control Board Authorized Handler',
        urgency: 'IMMEDIATE DISPATCH (CRITICAL priority)',
        durationMinutes: 45,
        etaMinutes: 15,
        specialInstructions: 'Wear Grade-A PPE; secure sealed biohazard drums before transport'
      };
    }

    if (isDrain) {
      return {
        team: '3 Manual Cleanup Workers + 1 Field Supervisor',
        vehicle: '1 Mini Truck (DL-1L-8942) + 1 High-Pressure Drainage Jetting Unit',
        partner: 'Drainage Department Emergency Coordination',
        urgency: 'IMMEDIATE DISPATCH (HIGH priority)',
        durationMinutes: 90,
        etaMinutes: 15,
        specialInstructions: 'Coordinate with Ram Nagar School; avoid peak dismissal time (15:30 - 16:00)'
      };
    }

    if (cat.includes('Construction')) {
      return {
        team: '2 Heavy Equipment Operators + 1 Traffic Marshal',
        vehicle: '1 Heavy JCB Loader + 8-Ton Tipper Truck',
        partner: 'PWD Demolition Waste Processing Facility',
        urgency: 'STANDARD SHIFT DISPATCH',
        durationMinutes: 120,
        etaMinutes: 30,
        specialInstructions: 'Deploy safety cones to divert traffic during hydraulic grab loading'
      };
    }

    if (cat.includes('Plastic')) {
      return {
        team: 'GreenRecycle NGO Partner + 2 Material Sorters',
        vehicle: 'Electric Cargo Trike + Segregation Cart',
        partner: 'GreenRecycle Material Recovery Facility (MRF)',
        urgency: 'SAME DAY RECYCLING ROUTE',
        durationMinutes: 60,
        etaMinutes: 45,
        specialInstructions: 'Segregate clear PET on-site for immediate recycling credits'
      };
    }

    return {
      team: '2 Manual Sanitation Workers',
      vehicle: '1 Mini Tipper Truck',
      partner: 'Municipal Waste Transfer Station',
      urgency: 'STANDARD COLLECTION',
      durationMinutes: 45,
      etaMinutes: 30,
      specialInstructions: 'Standard sweep and sweep-clean'
    };
  },

  /**
   * Closed-Loop AI Verification Algorithm (Docs Section 14 & Step 9)
   * Compares After vs Before photo, computes clearance % and verifies drain patency.
   */
  verifyCleanupEvidence(beforeImgKey, afterImgKey) {
    // In our benchmark scenario: 96% clearance, 0 waste items detected, drain fully patent.
    return {
      clearanceScore: 96,
      drainPatencyPassed: true,
      wasteItemsRemaining: 0,
      confidence: 94,
      processingTimeSeconds: 12,
      result: 'PASSED', // > 90% threshold met
      verificationStatus: 'VERIFIED_RESOLVED',
      aiSummary: 'After-photo confirms 96% waste clearance; drainage opening fully visible with unobstructed water flow.'
    };
  },

  /**
   * Helper: Haversine distance in meters
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  /**
   * Procedural Audio Feedback via Web Audio API (Zero external audio assets)
   */
  playSound(type = 'scan') {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === 'scan') {
        [523.25, 659.25, 783.99].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.04, ctx.currentTime + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.08 + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.08);
          osc.stop(ctx.currentTime + i * 0.08 + 0.16);
        });
      } else if (type === 'dispatch') {
        [440, 880].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.05, ctx.currentTime + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.1 + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.1);
          osc.stop(ctx.currentTime + i * 0.1 + 0.19);
        });
      } else if (type === 'success') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.09 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.09);
          osc.stop(ctx.currentTime + i * 0.09 + 0.36);
        });
      }
    } catch (e) {}
  }
};


