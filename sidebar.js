// ==========================================
// 🌟 RIGHT SIDEBAR CONTROLLER (sidebar.js)
// Supports: English (Default) & Hindi Switching
// ==========================================

// साइडबार खोलना
function openRightSidebar() {
  const sb = document.getElementById('rightSidebar');
  const bd = document.getElementById('sidebarBackdrop');
  if (sb && bd) {
    updateSidebarContent();
    bd.classList.add('active');
    sb.classList.add('active');
  }
}

// साइडबार बंद करना
function closeRightSidebar() {
  const sb = document.getElementById('rightSidebar');
  const bd = document.getElementById('sidebarBackdrop');
  if (sb && bd) {
    sb.classList.remove('active');
    bd.classList.remove('active');
  }
}

// साइडबार के डेटा को ताज़ा रखना (Profile, Photo, Theme, Notif, Language, Settings, Login/Logout)
function updateSidebarContent() {
  const isLight = document.body.classList.contains('light-theme');
  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  
  // 1. भाषा का अनुवाद हेल्पर
  const translate = (key, fallback) => (typeof t === 'function' ? t(key, fallback) : fallback);

  // 2. प्रोफाइल विवरण (नाम, खाता व साधक फ़ोटो सिंक)
  const nameEl = document.getElementById('sidebarUserName');
  const accEl = document.getElementById('sidebarUserAcc');
  const sideImg = document.getElementById('sidebarAvatarImg');

  const userPhoto = (typeof userProfile !== 'undefined' && userProfile && userProfile.photo) 
                    || localStorage.getItem('bm_guest_photo') 
                    || 'logo.png';

  if (sideImg) {
    sideImg.src = userPhoto;
  }

  if (typeof userProfile !== 'undefined' && userProfile) {
    if (nameEl) nameEl.innerText = userProfile.name || (isHindi ? 'साधक' : 'Devotee');
    if (accEl) accEl.innerText = `${isHindi ? 'खाता' : 'A/C'}: ${userProfile.accNo || cleanAcc}`;
  } else {
    if (nameEl) nameEl.innerText = translate('sidebar_user_guest', isHindi ? 'अतिथि साधक' : 'Guest Devotee');
    if (accEl) accEl.innerText = translate('sidebar_ac_guest', isHindi ? 'खाता: लॉगिन नहीं है' : 'A/C: Not Logged In');
  }

  // 3. भाषा टॉगल स्थिति बैज (🇬🇧 English | 🇮🇳 हिंदी)
  const langText = document.getElementById('sidebarLangText');
  if (langText) {
    langText.innerText = isHindi ? '🇮🇳 हिंदी' : '🇬🇧 English';
  }

  // 4. थीम स्थिति
  const themeText = document.getElementById('sidebarThemeText');
  if (themeText) {
    if (isHindi) {
      themeText.innerText = isLight ? "☀️ लाइट मोड" : "🌙 डार्क मोड";
    } else {
      themeText.innerText = isLight ? "☀️ Light Mode" : "🌙 Dark Mode";
    }
  }

  // 5. नोटीफिकेशन स्थिति
  const notifText = document.getElementById('sidebarNotifText');
  if (notifText && ('Notification' in window)) {
    if (Notification.permission === 'granted') {
      notifText.innerText = translate('sidebar_notif_active', isHindi ? "सक्रिय ✓" : "Active ✓");
    } else {
      notifText.innerText = translate('sidebar_notif_enable', isHindi ? "चालू करें 🔔" : "Enable 🔔");
    }
  }

  // 6. सेटिंग्स की स्थिति (ध्वनि और कंपन - ON / OFF)
  const soundStatus = document.getElementById('sidebarSoundStatus');
  if (soundStatus) {
    const isSoundOn = (typeof soundEnabled !== 'undefined' && soundEnabled);
    if (isHindi) {
      soundStatus.innerText = isSoundOn ? "चालू" : "बंद";
    } else {
      soundStatus.innerText = isSoundOn ? "ON" : "OFF";
    }
  }

  const vibStatus = document.getElementById('sidebarVibStatus');
  if (vibStatus) {
    const isVibOn = (typeof vibrateEnabled !== 'undefined' && vibrateEnabled);
    if (isHindi) {
      vibStatus.innerText = isVibOn ? "चालू" : "बंद";
    } else {
      vibStatus.innerText = isVibOn ? "ON" : "OFF";
    }
  }

  // 7. नीचे डायनामिक लॉगिन या लॉगआउट बटन
  const authContainer = document.getElementById('sidebarAuthAction');
  if (authContainer) {
    if (typeof userProfile !== 'undefined' && userProfile) {
      const logoutLabel = translate('sidebar_logout_btn', isHindi ? 'लॉगआउट करें' : 'Logout (Exit)');
      authContainer.innerHTML = `
        <button onclick="closeRightSidebar(); logoutUser();" class="w-full py-2.5 px-3 bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow active:scale-95 transition">
          <i data-lucide="log-out" class="w-4 h-4 text-red-300"></i>
          <span>${logoutLabel}</span>
        </button>
      `;
    } else {
      const loginLabel = translate('sidebar_login_btn', isHindi ? 'लॉगिन करें ➔' : 'Login / Open Account ➔');
      authContainer.innerHTML = `
        <button onclick="closeRightSidebar(); openAuthModal('login');" class="w-full py-2.5 px-3 gold-foil text-amber-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition">
          <i data-lucide="log-in" class="w-4 h-4 text-amber-950"></i>
          <span>${loginLabel}</span>
        </button>
      `;
    }
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// साइडबार से किसी टैब पर जाना
function sidebarGoTo(tabId) {
  closeRightSidebar();
  if (typeof switchAppTab === 'function') {
    switchAppTab(tabId);
  }
}

// ESC की दबाने पर साइडबार बंद होना
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeRightSidebar();
});