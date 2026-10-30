// ========================================================
// 📱 MAIN APP ROUTER & LIFECYCLE BOOT LOADER (app.js)
// Zero Data Loss + Smart Background Sync + Midnight Rollover
// ========================================================

if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}

// ==========================================
// 1. नेविगेशन कंट्रोलर (Tab Switching)
// ==========================================
function switchAppTab(tabId) {
  // 1. सभी स्क्रीन्स और बॉटम नेविगेशन बटन्स को निष्क्रिय करें
  ['mala', 'account', 'services', 'passbook', 'profile'].forEach(t => {
    const scr = document.getElementById(`screen-${t}`);
    if (scr) scr.classList.add('hidden');
    
    const btn = document.getElementById(`nav-btn-${t}`);
    if (btn) {
      btn.classList.remove('text-amber-400');
      btn.classList.add('text-amber-300/60');
    }
  });

  // 2. चुने हुए स्क्रीन और बटन को सक्रिय करें
  const activeScr = document.getElementById(`screen-${tabId}`);
  if (activeScr) activeScr.classList.remove('hidden');
  
  const activeBtn = document.getElementById(`nav-btn-${tabId}`);
  if (activeBtn) {
    activeBtn.classList.remove('text-amber-300/60');
    activeBtn.classList.add('text-amber-400');
  }

  // 🎯 अगर कोई नया जप पेंडिंग है, तो टैब बदलते ही तुरंत क्लाउड में सुरक्षित करें
  if (typeof pendingSyncCount !== 'undefined' && pendingSyncCount > 0) {
    if (typeof syncFullDayJapaToCloud === 'function') {
      syncFullDayJapaToCloud();
    }
  }

  // 3. लोकल स्टोरेज से नवीनतम यूज़र डेटा रीलोड करें
  if (cleanAcc || activeAcc) {
    userProfile = JSON.parse(localStorage.getItem(`bm_user_${cleanAcc}`)) || 
                  JSON.parse(localStorage.getItem(`bm_user_${activeAcc}`)) || userProfile;
  }
  
  if (typeof renderProfileData === 'function') {
    renderProfileData();
  }

  // 4. विशेष टैब लॉजिक
  if (tabId === 'profile' && typeof openProfileScreen === 'function') {
    openProfileScreen();
  }
  
  if (tabId === 'passbook') {
    if (typeof activePassbookView !== 'undefined' && activePassbookView === 'calendar') {
      if (typeof renderSadhanaCalendar === 'function') {
        renderSadhanaCalendar(currentCalYear, currentCalMonth);
      }
    } else {
      if (typeof renderPassbookLedger === 'function') {
        renderPassbookLedger();
      }
    }
  }
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// ==========================================
// 2. सेवा सब-टैब स्विचिंग (प्रभु सेवा टैब)
// ==========================================
function switchServiceSubTab(subId) {
  ['sub-slip', 'sub-transfer', 'sub-cheque'].forEach(s => {
    const el = document.getElementById(s);
    if (el) el.classList.add('hidden');
    
    const btn = document.getElementById(`btn-${s}`);
    if (btn) btn.className = "py-2 px-1 rounded-xl text-amber-300/80 hover:bg-amber-900/30 text-center";
  });

  const activeSub = document.getElementById(subId);
  if (activeSub) activeSub.classList.remove('hidden');
  
  const activeBtn = document.getElementById(`btn-${subId}`);
  if (activeBtn) activeBtn.className = "py-2 px-1 rounded-xl font-semibold text-center bg-amber-500/20 text-amber-200 border border-amber-500/40";
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// ==========================================
// 3. ऑनलाइन / ऑफ़लाइन नेटवर्क स्थिति लिसनर्स
// ==========================================
window.addEventListener('online', () => { 
  if (typeof updateNetworkStatus === 'function') updateNetworkStatus(); 
  if (typeof syncOfflineQueueToFirebase === 'function') syncOfflineQueueToFirebase();
  if (typeof syncFullDayJapaToCloud === 'function') syncFullDayJapaToCloud();
});

window.addEventListener('offline', () => {
  if (typeof updateNetworkStatus === 'function') updateNetworkStatus();
});

// ==========================================
// 4. स्मार्ट बैकग्राउंड सिंक गार्ड (Anti-Duplicate Debounce)
// ==========================================
let lastBackgroundSyncTime = 0;

function triggerSafeBackgroundSync() {
  const now = Date.now();
  // यदि पिछले 2.5 सेकंड के भीतर पहले ही सिंक ट्रिगर हो चुका है, तो दोबारा न चलाएं
  if (now - lastBackgroundSyncTime < 2500) return;
  lastBackgroundSyncTime = now;

  if (typeof syncFullDayJapaToCloud === 'function') {
    syncFullDayJapaToCloud();
  }
}

// ==========================================
// 5. मोबाइल लाइफसाइकिल इवेंट्स (Background / Lock / Wakeup)
// ==========================================

// जब ऐप बैकग्राउंड में जाए या स्क्रीन पर वापस आए
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    // 🌙 साधक ने फ़ोन लॉक किया या दूसरी ऐप खोली -> दिनभर का सारा जप तुरंत सुरक्षित करें
    triggerSafeBackgroundSync();
  } else if (document.visibilityState === 'visible') {
    // 🌅 साधक वापस ऐप में आया -> चेक करें कि क्या रात के 12 बज चुके हैं (Day Rollover)
    if (typeof checkDayChangeOnStartup === 'function') {
      checkDayChangeOnStartup();
    }
    if (typeof scheduleMidnightSync === 'function') {
      scheduleMidnightSync();
    }
    if (typeof loadUserData === 'function') {
      loadUserData();
    }
  }
});

// जब ब्राउज़र टैब, PWA या विंडो बंद हो रही हो
window.addEventListener('pagehide', () => {
  triggerSafeBackgroundSync();
});

window.addEventListener('beforeunload', () => {
  triggerSafeBackgroundSync();
});

// ==========================================
// 6. PWA सर्विस वर्कर ऑटो-रजिस्ट्रेशन
// ==========================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('firebase-messaging-sw.js').then((reg) => {
      console.log('Bhajan Marg Bank PWA Active:', reg.scope);
    }).catch((err) => {
      console.warn('PWA Worker Registration Failed:', err);
    });
  });
}

// ==========================================
// 7. ग्लोबल बूट सीक्वेंस (App Initialization)
// ==========================================
if (typeof initTheme === 'function') initTheme();
if (typeof loadUserData === 'function') loadUserData();

// ऐप शुरू होते ही तारीख और मिडनाइट टाइमर चेक करें
if (typeof checkDayChangeOnStartup === 'function') {
  checkDayChangeOnStartup();
}
if (typeof scheduleMidnightSync === 'function') {
  scheduleMidnightSync();
}