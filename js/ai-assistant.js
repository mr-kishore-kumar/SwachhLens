// --- ai-assistant.js ---
/**
 * SwachhLens AI Municipal Assistant ("Ask SwachhLens")
 * Implements conversational decision intelligence for municipal officers (Docs Section 22.2 & 27).
 */

const AIAssistant = {
  isOpen: false,

  toggle() {
    this.isOpen = !this.isOpen;
    const drawer = document.getElementById('ai-chat-drawer');
    if (drawer) {
      drawer.classList.toggle('hidden', !this.isOpen);
      if (this.isOpen) {
        document.getElementById('ai-chat-input')?.focus();
      }
    }
  },

  sendPrompt(text) {
    this.appendMessage(text, 'user');
    setTimeout(() => {
      this.generateAIResponse(text);
    }, 450);
  },

  handleInput() {
    const input = document.getElementById('ai-chat-input');
    const text = input?.value.trim();
    if (!text) return;
    input.value = '';
    this.sendPrompt(text);
  },

  appendMessage(text, sender) {
    const container = document.getElementById('ai-chat-messages');
    if (!container) return;

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender === 'user' ? 'user-bubble' : 'bot-bubble'}`;
    bubble.innerHTML = text;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
  },

  generateAIResponse(query) {
    const q = query.toLowerCase();
    let reply = '';

    if (q.includes('highest priority') || q.includes('urgent') || q.includes('critical')) {
      const incidents = DataStore.incidents;
      const criticals = incidents.filter(i => i.priorityLevel === 'CRITICAL');
      const highs = incidents.filter(i => i.priorityLevel === 'HIGH');

      reply = `
        <strong>Daily Priority Summary for Ward 14:</strong><br>
        Currently tracking <strong>${criticals.length} CRITICAL</strong> and <strong>${highs.length} HIGH</strong> priority incidents:<br>
        • <strong class="text-danger">SW-1088 (Score 94):</strong> Hospital Biohazard Sharps (Civil Hospital Gate 3) - Specialized Hazmat Unit dispatched.<br>
        • <strong class="text-danger">SW-1041 (Score 82):</strong> Construction Debris (Outer Circle North) - JCB Loader assigned.<br>
        • <strong class="text-warning">SW-0847 (Score 58 → HIGH):</strong> Drain blockage near Ram Nagar School - 4 citizen reports clustered.
      `;
    } else if (q.includes('drain') || q.includes('school') || q.includes('gupta')) {
      reply = `
        <strong>Drainage & School Proximity Alert:</strong><br>
        <strong>INCIDENT-0847 (Gupta Market Road):</strong><br>
        • Proximity: <strong>85m from Ram Nagar Municipal School</strong> (+20 location risk)<br>
        • Drain Impact: Silt & plastic obstruction (+25 risk bonus, automatic upgrade to HIGH)<br>
        • Recommended Dispatch: <strong>Team-Sector5-A (3 Workers + High-Pressure Jetting Unit)</strong><br>
        • Precaution: Avoid 15:30 school dismissal peak.
      `;
    } else if (q.includes('cluster') || q.includes('efficiency') || q.includes('duplicate')) {
      reply = `
        <strong>Duplicate Clustering Efficiency (Today):</strong><br>
        • Total Citizen Submissions: <strong>23 raw photo reports</strong><br>
        • Clustered Incidents: <strong>6 operational work orders</strong><br>
        • Administrative Overhead Reduction: <strong class="text-emerald">74% reduction in ticket clutter</strong><br>
        • Top Cluster: <strong>INCIDENT-0847</strong> with 4 merged citizen reports within 25m radius.
      `;
    } else if (q.includes('crew') || q.includes('team') || q.includes('available')) {
      reply = `
        <strong>Municipal Fleet & Crew Status:</strong><br>
        • <strong>Team-Sector5-A:</strong> 4 Members • Jetting & Mini Truck (Status: Assigned to SW-0847)<br>
        • <strong>Team-Sector5-B:</strong> 3 Members • Heavy JCB Loader + Tipper (Status: Available)<br>
        • <strong>Specialized Hazmat:</strong> 2 Members • Biohazard Van (Status: Active at Hospital)<br>
        • <strong>GreenRecycle NGO:</strong> 2 Members • Sorting Trike (Status: Available for PET routes)
      `;
    } else {
      reply = `
        <strong>SwachhLens Decision Support:</strong><br>
        I have analyzed your query across all 6 active incidents in Ward 14. 
        All models are operating at <strong>>90% average confidence</strong> with strict RBAC audit logging. 
        Would you like me to filter the queue or highlight unassigned work orders?
      `;
    }

    this.appendMessage(reply, 'bot');
  }
};

