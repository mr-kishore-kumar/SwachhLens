// --- auth.js ---
/**
 * SwachhLens Authentication & RBAC Module (Matching Screenshot 3)
 * Supports Dedicated Dark-Themed Persona Selection & 1-Click Workspace Routing
 */

const Auth = {
  users: {
    officer: {
      id: 'AUT-2341',
      name: 'Priya Sharma',
      role: 'officer',
      roleTitle: 'Municipal Officer',
      avatar: 'PS',
      badgeClass: 'badge-officer',
      ward: 'Ward 14 New Delhi',
      email: 'priya.sharma@mcd.gov.in',
      fieldLabel: 'Municipal Officer Email / Government ID'
    },
    citizen: {
      id: 'CIT-4521',
      name: 'Rajesh Kumar',
      role: 'citizen',
      roleTitle: 'Citizen Reporter',
      avatar: 'RK',
      badgeClass: 'badge-citizen',
      ward: 'Ram Nagar Sector 5',
      email: 'rajesh.kumar@delhi.gov.in',
      fieldLabel: 'Citizen Registered Email / Phone Number'
    },
    crew: {
      id: 'CREW-8802',
      name: 'Ramesh Singh',
      role: 'crew',
      roleTitle: 'Field Crew Lead',
      avatar: 'RS',
      badgeClass: 'badge-crew',
      ward: 'Team-Sector5-A Jetting Unit',
      email: 'ramesh.singh@crew.mcd.gov.in',
      fieldLabel: 'Field Crew Badge / Unit Fleet ID'
    }
  },

  currentUser: null,
  selectedLoginRole: 'officer',

  init() {
    this.currentUser = this.users.officer;
    this.updateNavUI();

    const authPill = document.getElementById('auth-profile-pill');
    const dropdown = document.getElementById('role-menu-dropdown');

    if (authPill && dropdown) {
      authPill.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
      });

      document.addEventListener('click', () => {
        dropdown.classList.add('hidden');
      });
    }
  },

  selectLoginPersona(roleKey) {
    if (!this.users[roleKey]) return;
    this.selectedLoginRole = roleKey;

    // Update row selections and checkmarks matching Screenshot 3
    ['officer', 'citizen', 'crew'].forEach(key => {
      const card = document.getElementById(`persona-card-${key}`);
      if (card) {
        const isSelected = key === roleKey;
        card.classList.toggle('selected', isSelected);
        const checkIcon = card.querySelector('.persona-check-icon');
        if (checkIcon) {
          checkIcon.classList.toggle('hidden', !isSelected);
        }
      }
    });

    const user = this.users[roleKey];
    const usernameInput = document.getElementById('login-username-input');
    const labelEl = document.getElementById('login-role-field-label');

    if (usernameInput) usernameInput.value = user.email;
    if (labelEl) labelEl.textContent = user.fieldLabel;
  },

  submitLogin() {
    this.loginAs(this.selectedLoginRole);
  },

  quickLogin(roleKey) {
    this.selectLoginPersona(roleKey);
    this.loginAs(roleKey);
  },

  loginAs(roleKey) {
    if (this.users[roleKey]) {
      this.currentUser = this.users[roleKey];
      this.updateNavUI();

      // Route directly to that persona's interface
      if (roleKey === 'citizen') {
        App.setViewMode('citizen');
      } else if (roleKey === 'crew') {
        App.setViewMode('crew');
      } else {
        App.setViewMode('portal');
      }

      showToast(`Welcome back, ${this.currentUser.name}! Signed in as ${this.currentUser.roleTitle}.`, 'success');
      DataStore.addAuditLog(this.currentUser.name, 'AUTH-SSO', 'User Authentication Success', 'Privileges Granted', `Logged in with ${roleKey.toUpperCase()} permissions.`);
    }
  },

  switchUser(roleKey) {
    this.loginAs(roleKey);
    document.getElementById('role-menu-dropdown')?.classList.add('hidden');
  },

  logout() {
    document.getElementById('role-menu-dropdown')?.classList.add('hidden');
    App.setViewMode('login');
    showToast('Signed out of session. Please select a user persona to sign in.', 'neutral');
  },

  updateNavUI() {
    const avatarEl = document.getElementById('nav-user-avatar');
    const nameEl = document.getElementById('nav-user-name');
    const roleEl = document.getElementById('nav-user-role');

    if (avatarEl && nameEl && roleEl && this.currentUser) {
      avatarEl.textContent = this.currentUser.avatar;
      avatarEl.className = 'user-avatar ' + (this.currentUser.role === 'officer' ? 'officer-bg' : this.currentUser.role === 'citizen' ? 'citizen-bg' : 'crew-bg');
      nameEl.textContent = this.currentUser.name;
      roleEl.textContent = this.currentUser.roleTitle;
      roleEl.className = 'user-role-badge ' + this.currentUser.badgeClass;
    }
  },

  showLoginModal() {
    this.logout();
  }
};

Auth.init();

