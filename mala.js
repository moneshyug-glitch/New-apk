// ========================================================
// 📿 108 DIGITAL BEAD COUNTER & JAPA ENGINE (mala.js)
// Zero Data Loss + Anti-Inflation Offline Sync + Midnight Rollover
// ========================================================

var midnightTimerId = null;

// ==========================================
// 1. किसी भी तारीख (आज या पुरानी) का जप निकालना
// ==========================================
function getTodayJaap(targetDateKey = null) {
  const dateK = targetDateKey || getTodayKey();

  let countFromLogs = 0;
  if (userProfile && userProfile.dailyLogs && userProfile.dailyLogs[dateK] !== undefined) {
    countFromLogs = Number(userProfile.dailyLogs[dateK]) || 0;
  }

  const key = cleanAcc ? `bm_today_${cleanAcc}_${dateK}` : `bm_today_guest_${dateK}`;
  const countFromLS = parseInt(localStorage.getItem(key), 10) || 0;

  return Math.max(countFromLogs, countFromLS);
}

// ==========================================
// 2. आज के जप में संख्या जोड़ना (Local Memory First)
// ==========================================
function addTodayJaap(count) {
  if (count <= 0) return;
  const todayK = getTodayKey();
  const key = cleanAcc ? `bm_today_${cleanAcc}_${todayK}` : `bm_today_guest_${todayK}`;
  const current = getTodayJaap(todayK);
  const updated = current + count;

  localStorage.setItem(key, updated.toString());

  if (userProfile) {
    if (!userProfile.dailyLogs) userProfile.dailyLogs = {};
    userProfile.dailyLogs[todayK] = updated;
    if (cleanAcc) {
      localStorage.setItem(`bm_user_${cleanAcc}`, JSON.stringify(userProfile));
    }
  }
}

// ==========================================
// 3. मणका टैप एक्शन (Bead Count Action)
// ==========================================
function triggerBeadCountAction(count = 1, fromVoice = false) {
  if (count <= 0) return;

  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const numLocale = isHindi ? 'hi-IN' : 'en-IN';

  const prevMalas = Math.floor(sessionTaps / 108);
  sessionTaps += count;
  const newMalas = Math.floor(sessionTaps / 108);
  const malasCompleted = newMalas - prevMalas;

  if (typeof triggerVibrate === 'function') triggerVibrate(fromVoice ? 50 : 30);
  const bead = sessionTaps % 108;
  const currentBead = (bead === 0 && sessionTaps > 0) ? 108 : bead;

  // सेंटर बीड काउंटर डिस्प्ले
  const sessionEl = document.getElementById('sessionCounter');
  if (sessionEl) {
    sessionEl.innerText = sessionTaps;
    if (sessionTaps >= 100000) {
      sessionEl.className = "text-3xl sm:text-4xl font-black font-mono my-0.5 tracking-tight text-amber-950 drop-shadow";
    } else if (sessionTaps >= 10000) {
      sessionEl.className = "text-4xl sm:text-5xl font-black font-mono my-0.5 tracking-tight text-amber-950 drop-shadow";
    } else {
      sessionEl.className = "text-5xl sm:text-6xl font-black font-mono my-0.5 tracking-tight text-amber-950 drop-shadow";
    }
  }

  safeSet('malaCountBadge', currentBead);
  safeSet('sessionMalaTotalDisplay', isHindi ? `वर्तमान बैठक: ${newMalas} माला पूर्ण` : `Current Session: ${newMalas} Mala completed`);

  const circle = document.getElementById('beadCircle');
  if (circle) circle.style.setProperty('--p', Math.round((currentBead / 108) * 100) + '%');

  const btn = document.getElementById('tapCounterBtn');
  if (btn) { btn.classList.remove('tap-animate'); void btn.offsetWidth; btn.classList.add('tap-animate'); }

  // आज के जप में जोड़ें
  addTodayJaap(count);
  const currentTodayJaap = getTodayJaap();

  if (typeof setResponsiveCounter === 'function') {
    setResponsiveCounter('todayJaapCount', currentTodayJaap, numLocale);
  } else {
    safeSet('todayJaapCount', currentTodayJaap.toLocaleString(numLocale));
  }
  safeSet('todayMalaCount', Math.floor(currentTodayJaap / 108).toLocaleString(numLocale));

  // कुल संचित बैलेंस लोकल स्टोरेज में सुरक्षित करें
  if (userProfile) {
    userProfile.balance = (Number(userProfile.balance) || 0) + count;
    if (cleanAcc) {
      localStorage.setItem(`bm_user_${cleanAcc}`, JSON.stringify(userProfile));
    }

    if (typeof setResponsiveCounter === 'function') {
      setResponsiveCounter('totalBankBalance', userProfile.balance, numLocale);
      setResponsiveCounter('accScreenTotalBal', userProfile.balance, numLocale);
    } else {
      safeSet('totalBankBalance', userProfile.balance.toLocaleString(numLocale));
      safeSet('accScreenTotalBal', userProfile.balance.toLocaleString(numLocale));
    }
    safeSet('totalMalaCount', Math.floor(userProfile.balance / 108).toLocaleString(numLocale));

    pendingSyncCount += count;

    // 108 की पूरी माला होने पर शंख / घंटा ध्वनि
    if (malasCompleted > 0) {
      if (typeof playMalaGong === 'function') playMalaGong(); 
      if (typeof triggerVibrate === 'function') triggerVibrate([100, 60, 100]);
      showToast(isHindi ? `🎉 ${malasCompleted} माला पूर्ण! खाते में सुरक्षित` : `🎉 ${malasCompleted} Mala completed! Safely counted`, 'success');
    } else {
      if (typeof playChime === 'function') playChime(750 + (currentBead * 2.5), 0.2);
    }
  } else {
    let guestBal = parseInt(localStorage.getItem('bm_guest_balance'), 10) || 0;
    guestBal += count;
    localStorage.setItem('bm_guest_balance', guestBal.toString());

    if (typeof setResponsiveCounter === 'function') {
      setResponsiveCounter('totalBankBalance', guestBal, numLocale);
    } else {
      safeSet('totalBankBalance', guestBal.toLocaleString(numLocale));
    }
    safeSet('totalMalaCount', Math.floor(guestBal / 108).toLocaleString(numLocale));
    if (typeof playChime === 'function') playChime(750 + (currentBead * 2.5), 0.2);
  }
}

// ==========================================
// 🎯 सुरक्षित ऑफ़लाइन कतार सहायक (Anti-Inflation Helper)
// ==========================================
function safeGetOfflineQueue() {
  if (typeof getOfflineQueue === 'function') return getOfflineQueue();
  if (!cleanAcc) return [];
  try { return JSON.parse(localStorage.getItem(`bm_offline_queue_${cleanAcc}`) || '[]'); } catch (e) { return []; }
}

function safeSaveOfflineQueue(q) {
  if (typeof saveOfflineQueue === 'function') {
    saveOfflineQueue(q);
    return;
  }
  if (cleanAcc) localStorage.setItem(`bm_offline_queue_${cleanAcc}`, JSON.stringify(q));
}

function enqueueLatestOfflineState(item) {
  let q = safeGetOfflineQueue();
  // 🎯 मुख्य समाधान: यदि इस तारीख का डेटा पहले से कतार में है, तो उसे रिप्लेस करें (ताकि डुप्लीकेट न जुड़े)
  q = q.filter(i => !(i.targetAcc === item.targetAcc && i.dateKey === item.dateKey));
  q.push(item);
  safeSaveOfflineQueue(q);
}

// ==========================================
// 4. तारीख-संवेदनशील क्लाउड सिंक इंजन (Date-Aware Cloud Sync)
// ==========================================
async function syncFullDayJapaToCloud(targetDateKey = null, forcedCount = null, customNote = "") {
  if (!userProfile || !cleanAcc) return;

  const dateK = targetDateKey || getTodayKey();
  const dayTotal = (forcedCount !== null) ? Number(forcedCount) : getTodayJaap(dateK);

  if (dayTotal <= 0 && pendingSyncCount <= 0) return;

  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const numLocale = isHindi ? 'hi-IN' : 'en-IN';

  // 1. dailyLogs में सही तारीख पर जप संख्या सेट करें
  if (!userProfile.dailyLogs) userProfile.dailyLogs = {};
  userProfile.dailyLogs[dateK] = dayTotal;

  // 2. प्रदर्शित करने हेतु तारीख का स्वरूप (DD/MM/YYYY)
  const parts = dateK.split('-');
  const displayDate = (parts.length === 3) ? `${parts[2]}/${parts[1]}/${parts[0]}` : dateK;

  const summaryTitle = customNote || (isHindi 
    ? `दैनिक अखंड संचय (${dayTotal.toLocaleString(numLocale)} नाम)` 
    : `Daily Chanting Summary (${dayTotal.toLocaleString(numLocale)} Japa)`);

  if (!Array.isArray(userProfile.transactions)) userProfile.transactions = [];

  // इस तारीख का पूर्व समरी ट्रांजेक्शन खोजें (ताकि डुप्लीकेट न बने)
  const existingTxIndex = userProfile.transactions.findIndex(t => t.dateKey === dateK && t.isDailySummary);

  const summaryTx = {
    id: Date.now(),
    dateKey: dateK,
    isDailySummary: true,
    date: `${displayDate}, 11:59 PM`,
    particulars: summaryTitle,
    type: "CREDIT",
    amount: dayTotal,
    balanceAfter: userProfile.balance
  };

  if (existingTxIndex >= 0) {
    userProfile.transactions[existingTxIndex] = summaryTx;
  } else {
    userProfile.transactions.unshift(summaryTx);
  }
  userProfile.transactions = userProfile.transactions.slice(0, 100);

  // 3. लोकल स्टोरेज अपडेट
  localStorage.setItem(`bm_user_${cleanAcc}`, JSON.stringify(userProfile));

  // अगर आज का ही दिन सिंक हुआ है तो पेंडिंग 0 करें
  if (dateK === getTodayKey()) {
    pendingSyncCount = 0;
  }

  if (typeof renderPassbookLedger === 'function') renderPassbookLedger();

  // 🎯 ऑफ़लाइन कतार के लिए सटीक स्नैपशॉट
  const queueItem = {
    targetAcc: cleanAcc,
    dateKey: dateK,
    dayTotal: dayTotal,
    currentBalance: userProfile.balance,
    summaryTx: summaryTx,
    updatedAt: Date.now()
  };

  // 4. Firebase Firestore अपडेट
  if (navigator.onLine && isFirebaseReady) {
    try {
      await db.collection("bm_sadhak_accounts").doc(cleanAcc).update({
        balance: userProfile.balance,
        transactions: userProfile.transactions,
        dailyLogs: userProfile.dailyLogs,
        activeGoal: userProfile.activeGoal || null,
        kripaLoan: userProfile.kripaLoan || null
      });
      console.log(`✓ [Day Sync] ${dateK} के ${dayTotal} जप क्लाउड में 100% सुरक्षित अपडेट हुए!`);
    } catch (err) {
      console.warn("Cloud sync error, saving snapshot to offline queue:", err);
      enqueueLatestOfflineState(queueItem);
    }
  } else {
    // ऑफ़लाइन होने पर सुरक्षित स्नैपशॉट सेव करें
    enqueueLatestOfflineState(queueItem);
  }
}

// Backward Compatibility Aliases
window.syncFullDayJapaToCloud = syncFullDayJapaToCloud;
window.flushPendingSyncToCloud = syncFullDayJapaToCloud;

// ==========================================
// 5. ऐप स्टार्ट/वेक-अप पर तारीख रिकवरी (Catch-Up Rollover Engine)
// ==========================================
async function checkDayChangeOnStartup() {
  const currentTodayK = getTodayKey();
  const lastActiveDate = localStorage.getItem(`bm_last_active_date_${cleanAcc || 'guest'}`);

  if (lastActiveDate && lastActiveDate !== currentTodayK) {
    console.log(`[Day Change Detected] पिछला दिन: ${lastActiveDate} ➔ आज का दिन: ${currentTodayK}`);
    
    const prevDayCount = getTodayJaap(lastActiveDate);
    if (prevDayCount > 0) {
      console.log(`[Recovery Engine] कल (${lastActiveDate}) के ${prevDayCount} जप को सुरक्षित सिंक किया जा रहा है...`);
      await syncFullDayJapaToCloud(lastActiveDate, prevDayCount);
    }

    handleNewDayRollover();
  } else {
    localStorage.setItem(`bm_last_active_date_${cleanAcc || 'guest'}`, currentTodayK);
  }
}

// ==========================================
// 6. 12:00:00 AM नया दिन प्रारंभ करना (Daily Rollover)
// ==========================================
function handleNewDayRollover() {
  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');

  sessionTaps = 0;
  pendingSyncCount = 0;
  resetSessionUI();

  safeSet('todayJaapCount', '0');
  safeSet('todayMalaCount', '0');

  const newTodayK = getTodayKey();
  localStorage.setItem(`bm_last_active_date_${cleanAcc || 'guest'}`, newTodayK);

  if (typeof renderProfileData === 'function') renderProfileData();
  if (typeof renderPassbookLedger === 'function') renderPassbookLedger();

  showToast(isHindi ? "🌅 नया दिन प्रारंभ! आज का पावन नाम जप शुरू करें।" : "🌅 New Day Started! Begin today's sacred Japa.", "info");
}

// ==========================================
// 7. रात 11:59:59 PM बैकग्राउंड टाइमर
// ==========================================
function scheduleMidnightSync() {
  if (midnightTimerId) clearTimeout(midnightTimerId);

  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 0);

  let msUntilMidnight = midnight.getTime() - now.getTime();
  if (msUntilMidnight <= 0) msUntilMidnight = 1000;

  console.log(`[Midnight Engine] अगला मिडनाइट सिंक ठीक ${Math.round(msUntilMidnight / 60000)} मिनट बाद होगा।`);

  midnightTimerId = setTimeout(async () => {
    console.log("[Midnight Engine] 🕛 11:59:59 PM: दैनिक अखंड जप क्लाउड में सिंक हो रहा है...");
    await syncFullDayJapaToCloud();

    setTimeout(() => {
      console.log("[Midnight Engine] 🌅 12:00:00 AM: नया दिन शुरू!");
      handleNewDayRollover();
      scheduleMidnightSync();
    }, 1500);

  }, msUntilMidnight);
}

// ==========================================
// 8. "Deposit to Bank" बटन हैंडलर
// ==========================================
async function depositSessionToBank(isAuto = false) {
  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');

  if (sessionTaps <= 0 && pendingSyncCount <= 0) { 
    if (!isAuto) showToast(isHindi ? "सभी नाम पहले से ही खाते में सुरक्षित हैं!" : "All names already safely deposited!", "info"); 
    return; 
  }

  const depositedCount = sessionTaps;
  await syncFullDayJapaToCloud();
  
  if (!isAuto) {
    showToast(isHindi ? `✓ वर्तमान बैठक के ${depositedCount} नाम खाते में सुरक्षित हुए!` : `✓ Session's ${depositedCount} names safely synced to account!`, 'success');
  }

  sessionTaps = 0;
  resetSessionUI();
  if (typeof renderProfileData === 'function') renderProfileData();
}

function resetSessionUI() {
  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  safeSet('sessionCounter', '0');
  safeSet('malaCountBadge', '0');
  safeSet('sessionMalaTotalDisplay', isHindi ? 'वर्तमान बैठक: 0 माला पूर्ण' : 'Current Session: 0 Mala completed');
  const circle = document.getElementById('beadCircle');
  if (circle) circle.style.setProperty('--p', '0%');
}

// ==========================================
// 9. "Reset" बटन हैंडलर (सुरक्षित रीसेट)
// ==========================================
async function resetCurrentSession() {
  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  if (sessionTaps > 0) {
    const confirmMsg = isHindi 
      ? "क्या आप वर्तमान बैठक काउंटर को 0 करना चाहते हैं? (आपके द्वारा जपे गए सभी नाम बैंक खाते में 100% सुरक्षित रहेंगे)"
      : "Reset current session counter to 0? (Your bank balance will remain 100% safe)";
    
    if (confirm(confirmMsg)) {
      if (pendingSyncCount > 0) {
        await syncFullDayJapaToCloud();
      }
      sessionTaps = 0;
      resetSessionUI();
      showToast(isHindi ? "वर्तमान बैठक काउंटर रीसेट हुआ" : "Session counter reset", "info");
    }
  }
}

// ==========================================
// 10. टच, कीबोर्ड एवं रिमोट क्लिकर लिसनर्स
// ==========================================
const broadTouchArea = document.getElementById('malaTouchArea') || document.getElementById('tapCounterBtn');
if (broadTouchArea) {
  broadTouchArea.addEventListener('click', (e) => {
    if (e.target && e.target.closest && e.target.closest('button:not(#tapCounterBtn)')) return;
    triggerBeadCountAction(1, false);
  });
}

window.addEventListener('keydown', (e) => {
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) return;
  if ([' ', 'Spacebar', 'Enter', 'ArrowUp', 'VolumeUp'].includes(e.key) || e.code === 'Space') {
    e.preventDefault(); 
    triggerBeadCountAction(1, false);
  }
});

// ==========================================
// 11. AI Voice Japa Engine (Unicode-Safe)
// ==========================================
function countMantraOccurrences(transcript, rawIsht) {
  if (!transcript || !transcript.trim()) return { count: 0, displayName: "नाम" };
  
  let text = transcript.toLowerCase().replace(/[।,!?.।\-–_]/g, ' ').replace(/\s+/g, ' ').trim();
  const isht = (rawIsht || '').toLowerCase().trim();
  let displayName = "श्री राधा नाम";
  let count = 0;

  // 🎯 सुरक्षित देवनागरी और अंग्रेजी सेपरेटर पैटर्न
  if (isht.includes('सीता') || isht.includes('सिया') || isht.includes('sita') || isht.includes('ram') || isht.includes('राम')) {
    displayName = (isht.includes('सीता') || isht.includes('सिया') || isht.includes('sita')) ? "श्री सीताराम" : "श्री राम";
    let working = text
      .replace(/(जय\s*श्री\s*राम|jai\s*shree?\s*ram)/gi, ' §JAP§ ')
      .replace(/(सीता\s*राम|सिया\s*राम|sita\s*ram|siya\s*ram|sitaram)/gi, ' §JAP§ ')
      .replace(/(श्री\s*राम|shree?\s*ram)/gi, ' §JAP§ ')
      .replace(/(^|[\s,।!])(राम|ram)(?=[\s,।!]|$)/gi, '$1§JAP§');
    const matches = working.match(/§JAP§/g);
    count = matches ? matches.length : 0;
  } else if (isht.includes('शिव') || isht.includes('महादेव') || isht.includes('shiv') || isht.includes('shamb')) {
    displayName = "ॐ नमः शिवाय";
    let working = text
      .replace(/(ॐ|ओम)?\s*नमः?\s*शिवाय/gi, ' §JAP§ ')
      .replace(/(हर\s*हर\s*महादेव)/gi, ' §JAP§ ')
      .replace(/(महादेव|mahadev)/gi, ' §JAP§ ')
      .replace(/(भोलेनाथ|bholenath)/gi, ' §JAP§ ')
      .replace(/(^|[\s,।!])(शिव|shiv)(?=[\s,।!]|$)/gi, '$1§JAP§');
    const matches = working.match(/§JAP§/g);
    count = matches ? matches.length : 0;
  } else if (isht.includes('हनुमान') || isht.includes('बजरंग') || isht.includes('hanuman')) {
    displayName = "जय हनुमान";
    let working = text
      .replace(/(जय\s*बजरंगबली|बजरंगबली)/gi, ' §JAP§ ')
      .replace(/(जय\s*हनुमान|हनुमान|hanuman)/gi, ' §JAP§ ')
      .replace(/(^|[\s,।!])(बजरंग)(?=[\s,।!]|$)/gi, '$1§JAP§');
    const matches = working.match(/§JAP§/g);
    count = matches ? matches.length : 0;
  } else if (isht.includes('हरे कृष्ण') || isht.includes('महामंत्र') || isht.includes('krishna') || isht.includes('कृष्ण')) {
    displayName = "हरे कृष्ण";
    const fullMahamantra = /(हरे\s*कृष्ण\s*हरे\s*कृष्ण\s*कृष्ण\s*कृष्ण\s*हरे\s*हरे\s*हरे\s*राम\s*हरे\s*राम\s*राम\s*राम\s*हरे\s*हरे|hare\s*krishna\s*hare\s*krishna\s*krishna\s*krishna\s*hare\s*hare\s*hare\s*rama?\s*hare\s*rama?\s*rama?\s*rama?\s*hare\s*hare)/gi;
    let replacedFull = text.replace(fullMahamantra, ' §JAP§ ');
    
    let working = replacedFull
      .replace(/(हरे\s*कृष्ण|hare\s*krishna)/gi, ' §JAP§ ')
      .replace(/(हरे\s*राम|hare\s*rama?)/gi, ' §JAP§ ')
      .replace(/(^|[\s,।!])(कृष्ण|krishna)(?=[\s,।!]|$)/gi, '$1§JAP§')
      .replace(/(^|[\s,।!])(राम|rama?)(?=[\s,।!]|$)/gi, '$1§JAP§');
    const matches = working.match(/§JAP§/g);
    count = matches ? matches.length : 0;
  } else {
    displayName = isht ? `श्री ${rawIsht} नाम` : "श्री राधा नाम";
    let working = text
      .replace(/(राधा\s*रानी|radha\s*rani)/gi, ' §JAP§ ')
      .replace(/(राधे\s*राधे|radhe\s*radhe)/gi, ' §JAP§ §JAP§ ')
      .replace(/(^|[\s,।!])(राधे|राधा|radhe|radha)(?=[\s,।!]|$)/gi, '$1§JAP§');
    const matches = working.match(/§JAP§/g);
    count = matches ? matches.length : 0;
  }

  return { count, displayName };
}

let speechRecognizer = null;
let isVoiceListening = false;
let shouldKeepListening = false;
let sessionNamesCountedSoFar = 0;
let lastResultTimestamp = 0;

function toggleVoiceRecognition() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
    alert(isHindi 
      ? "आपके ब्राउज़र में AI वॉइस रिकग्निशन समर्थित नहीं है। कृपया Google Chrome का उपयोग करें।" 
      : "AI Voice recognition is not supported in this browser. Please use Google Chrome.");
    return;
  }

  const voiceBtn = document.getElementById('voiceToggleBtn');
  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');

  if (isVoiceListening) {
    shouldKeepListening = false;
    isVoiceListening = false;
    sessionNamesCountedSoFar = 0;
    if (speechRecognizer) {
      try { speechRecognizer.stop(); } catch (err) {}
    }
    if (voiceBtn) voiceBtn.classList.remove('mic-listening');
    showToast(isHindi ? "🎙️ वॉइस जप बंद हुआ" : "🎙️ Voice chanting paused", "info");
  } else {
    try {
      speechRecognizer = new SpeechRec();
      speechRecognizer.continuous = true;
      speechRecognizer.interimResults = false;
      speechRecognizer.lang = 'hi-IN';
      speechRecognizer.maxAlternatives = 1;

      speechRecognizer.onstart = () => {
        isVoiceListening = true;
        shouldKeepListening = true;
        sessionNamesCountedSoFar = 0; // ऑटो-रीस्टार्ट पर फ्रेश बेसलाइन
        if (voiceBtn) voiceBtn.classList.add('mic-listening');
        showToast(isHindi ? "🎙️ AI वॉइस जप चालू! मुख से नाम जपें..." : "🎙️ AI Voice chanting active! Speak divine names...", "info");
      };

      speechRecognizer.onresult = (e) => {
        const ishtNameFromDash = userProfile?.isht || 'श्री राधा नाम';
        let currentFullTranscript = "";
        for (let i = 0; i < e.results.length; ++i) {
          if (e.results[i].isFinal) {
            currentFullTranscript += " " + e.results[i][0].transcript;
          }
        }

        if (!currentFullTranscript.trim()) return;

        const analysis = countMantraOccurrences(currentFullTranscript, ishtNameFromDash);
        const delta = analysis.count - sessionNamesCountedSoFar;

        if (delta > 0) {
          sessionNamesCountedSoFar = analysis.count;
          lastResultTimestamp = Date.now();
          triggerBeadCountAction(delta, true);
          showToast(`🎙️ +${delta} ${analysis.displayName}!`, 'success');
        } else if (analysis.count === 0 && (Date.now() - lastResultTimestamp > 2500)) {
          lastResultTimestamp = Date.now();
          showToast(isHindi ? `स्पष्ट उच्चारण करें: (${analysis.displayName})` : `Pronounce clearly: (${analysis.displayName})`, 'warn');
        }
      };

      speechRecognizer.onerror = (event) => {
        if (event.error === 'not-allowed') {
          shouldKeepListening = false;
          isVoiceListening = false;
          sessionNamesCountedSoFar = 0;
          if (voiceBtn) voiceBtn.classList.remove('mic-listening');
          alert(isHindi 
            ? "माइक्रोफ़ोन अनुमति ब्लॉक है! कृपया ब्राउज़र सेटिंग से माइक्रोफ़ोन चालू करें।"
            : "Microphone permission is blocked! Please allow microphone access in browser settings.");
        }
      };

      speechRecognizer.onend = () => {
        sessionNamesCountedSoFar = 0; // नए सेशन के लिए रीसेट ताकि गिनती न रुके
        if (shouldKeepListening) {
          try {
            speechRecognizer.start();
          } catch (e) {
            setTimeout(() => {
              if (shouldKeepListening) {
                try { speechRecognizer.start(); } catch (err) {}
              }
            }, 300);
          }
        } else {
          isVoiceListening = false;
          sessionNamesCountedSoFar = 0;
          if (voiceBtn) voiceBtn.classList.remove('mic-listening');
        }
      };

      speechRecognizer.start();
    } catch (err) {
      showToast(isHindi ? "माइक्रोफ़ोन शुरू नहीं हो सका" : "Could not start microphone", "warn");
    }
  }
}

// ==========================================
// 12. इनिशियलाइजेशन (Auto-Boot)
// ==========================================
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    checkDayChangeOnStartup();
    scheduleMidnightSync();
  });
}