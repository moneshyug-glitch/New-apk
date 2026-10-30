// ==========================================
// SACRED BANKING, FD, RD, LOAN & BHAKTI METER MODULE
// Bilingual Support: English (Default) & Hindi
// Zero-Inflation Offline Sync & Clean Ledger Engine
// ==========================================

// 🎯 बड़ी संख्याओं के लिए ऑटो-फॉन्ट स्केलिंग हेल्पर (Bold & Big Display Engine)
function setResponsiveCounter(id, num, locale) {
  const el = document.getElementById(id);
  if (!el) return;

  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const numLocale = locale || (isHi ? 'hi-IN' : 'en-IN');
  const safeNum = Number(num) || 0;
  const formattedStr = safeNum.toLocaleString(numLocale);
  
  el.innerText = formattedStr;
  el.title = formattedStr;

  const charLen = formattedStr.length;
  el.classList.remove('text-3xl', 'text-2xl', 'text-xl', 'text-lg', 'text-base', 'text-sm', 'text-xs');
  el.classList.add('font-black');

  if (charLen > 15) {
    el.classList.add('text-sm');
  } else if (charLen > 12) {
    el.classList.add('text-base');
  } else if (charLen > 10) {
    el.classList.add('text-xl');
  } else {
    el.classList.add('text-2xl');
  }
}
window.setResponsiveCounter = setResponsiveCounter;

// 🎯 शुद्ध इष्ट नाम निकालने व भाषा के अनुसार रूपांतरण करने का हेल्पर
function getLocalizedIshtName(ishtStr, toHindi = true) {
  if (!ishtStr) return toHindi ? "श्री राधा" : "Shri Radha";
  let str = String(ishtStr).trim();
  
  str = str.replace(/\s*(नाम|naam)\s*/gi, ' ').replace(/\s*(संचय|deposit)\s*/gi, ' ').trim();

  const lower = str.toLowerCase();
  if (toHindi) {
    if (lower.includes("radha") || lower.includes("राधा") || lower.includes("radhe") || lower.includes("राधे")) return "श्री राधा";
    if (lower.includes("sitaram") || lower.includes("सीताराम") || (lower.includes("sita") && lower.includes("ram"))) return "श्री सीताराम";
    if (lower.includes("krishna") || lower.includes("कृष्ण")) return "हरे कृष्ण महामंत्र";
    if (lower.includes("shiv") || lower.includes("शिव")) return "ॐ नमः शिवाय";
    return str;
  } else {
    if (lower.includes("radha") || lower.includes("राधा") || lower.includes("radhe") || lower.includes("राधे")) return "Shri Radha";
    if (lower.includes("sitaram") || lower.includes("सीताराम") || (lower.includes("sita") && lower.includes("ram"))) return "Shri Sitaram";
    if (lower.includes("krishna") || lower.includes("कृष्ण")) return "Hare Krishna Mahamantra";
    if (lower.includes("shiv") || lower.includes("शिव")) return "Om Namah Shivaya";
    return str;
  }
}

// सहायता व अर्पण कारणों का अनुवाद मैपर
function translatePurposeText(text, toEnglish = true) {
  if (!text) return text;
  if (toEnglish) {
    return text
      .replace(/आकस्मिक संकट,?\s*भय व रोग निवारणार्थ/g, 'Crisis, Fear & Disease Protection')
      .replace(/परीक्षा\s*\/?\s*कार्य सफलता व मानसिक शांति/g, 'Exam, Success & Peace of Mind')
      .replace(/माता-पिता व स्वजन स्वास्थ्य लाभार्थ/g, 'For Parents & Family Wellbeing')
      .replace(/पितरों की सद्गति व शांति हेतु/g, "Ancestors' Peace & Liberation")
      .replace(/पितरों की सद्गति एवं मोक्षार्थ/g, "Ancestors' Peace & Liberation")
      .replace(/विश्व शांति एवं गौ सेवा कल्याणार्थ/g, 'World Peace & Cow Protection')
      .replace(/विश्व शांति एवं गौ सेवा/g, 'World Peace & Cow Seva')
      .replace(/माता-पिता के श्रीचरणों में/g, "Parents' Longevity & Wellbeing");
  } else {
    return text
      .replace(/Crisis, Fear & Disease Protection/g, 'आकस्मिक संकट, भय व रोग निवारणार्थ')
      .replace(/Exam, Success & Peace of Mind/g, 'परीक्षा / कार्य सफलता व मानसिक शांति')
      .replace(/For Parents & Family Wellbeing/g, 'माता-पिता व स्वजन स्वास्थ्य लाभार्थ')
      .replace(/Ancestors' Peace & Liberation/g, 'पितरों की सद्गति व शांति हेतु')
      .replace(/World Peace & Cow Protection/g, 'विश्व शांति एवं गौ सेवा कल्याणार्थ')
      .replace(/World Peace & Cow Seva/g, 'विश्व शांति एवं गौ सेवा')
      .replace(/Parents' Longevity & Wellbeing/g, 'माता-पिता के श्रीचरणों में');
  }
}

function renderProfileData() {
  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const numLocale = isHindi ? 'hi-IN' : 'en-IN';
  const isLight = document.body.classList.contains('light-theme');

  const authBtnContainer = document.getElementById('headerAuthBtnContainer');
  const profilePrompt = document.getElementById('profileAuthPrompt');
  const profileDetails = document.getElementById('profileDetailsBox');

  let currentBal = 0;
  let accNum = (cleanAcc && userProfile?.accNo) ? userProfile.accNo : (isHindi ? 'अतिथि (Guest)' : 'Guest');
  let name = isHindi ? 'अतिथि साधक' : 'Guest Devotee';
  let isht = isHindi ? 'श्री राधा नाम' : 'Shri Radha Naam';

  if (userProfile && userProfile.accNo) {
    name = userProfile.name || (isHindi ? 'साधक' : 'Devotee');
    accNum = userProfile.accNo || activeAcc;
    isht = userProfile.isht || (isHindi ? 'श्री राधा नाम' : 'Shri Radha Naam');
    currentBal = Number(userProfile.balance) || 0;

    if (authBtnContainer) {
      authBtnContainer.innerHTML = `
        <button onclick="switchAppTab('profile')" class="w-7 h-7 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 flex items-center justify-center text-xs">
          <i data-lucide="user" class="w-3.5 h-3.5"></i>
        </button>
      `;
    }
    if (profilePrompt) profilePrompt.classList.add('hidden');
    if (profileDetails) profileDetails.classList.remove('hidden');

    // मंत्र चयन सूची अपडेट
    const mantraSel = document.getElementById('mantraType');
    if (mantraSel) {
      const userIsht = userProfile.isht || "श्री राधा नाम";
      const standardMantras = [
        { val: "श्री राधा नाम", label: isHindi ? "श्री राधा नाम" : "Shri Radha Naam (श्री राधा नाम)" },
        { val: "हरे कृष्ण महामंत्र", label: isHindi ? "हरे कृष्ण महामंत्र" : "Hare Krishna Mahamantra (हरे कृष्ण महामंत्र)" },
        { val: "श्री सीताराम नाम", label: isHindi ? "श्री सीताराम नाम" : "Shri Sitaram Naam (श्री सीताराम नाम)" },
        { val: "ॐ नमः शिवाय", label: isHindi ? "ॐ नमः शिवाय" : "Om Namah Shivaya (ॐ नमः शिवाय)" }
      ];
      
      let html = `<option value="${userIsht}" selected>📿 ${isHindi ? 'आपका इष्ट' : 'Your Isht'}: ${userIsht}</option>`;
      standardMantras.forEach(m => {
        if (m.val !== userIsht) html += `<option value="${m.val}">${m.label}</option>`;
      });
      html += `<option value="CUSTOM">${isHindi ? 'अन्य मंत्र / कस्टम नाम (यहाँ टाइप करें)' : 'Custom Mantra (Type here)'}</option>`;
      mantraSel.innerHTML = html;
    }

    // 1. नित्य नियम (Daily Niyam)
    const targetMalas = Number(userProfile.dailyTarget) || 16;
    const targetCount = targetMalas * 108;
    const todayJap = Number(getTodayJaap()) || 0;
    const todayMalas = Math.floor(todayJap / 108);

    if (isHindi) {
      safeSet('rdInstallmentDueText', `आज का नियम: ${targetMalas} माला (${targetCount.toLocaleString(numLocale)} नाम जप)`);
      safeSet('rdMalaProgressText', `आज पूर्ण हुआ: ${todayMalas} / ${targetMalas} माला`);
    } else {
      safeSet('rdInstallmentDueText', `Today's Goal: ${targetMalas} Mala (${targetCount.toLocaleString(numLocale)} Japa)`);
      safeSet('rdMalaProgressText', `Completed today: ${todayMalas} / ${targetMalas} Mala`);
    }

    const rdPercent = Math.min(100, Math.round((todayJap / targetCount) * 100));
    const rdBar = document.getElementById('rdProgressBar');
    if (rdBar) {
      rdBar.style.width = `${rdPercent}%`;
      if (rdBar.parentElement) {
        rdBar.parentElement.style.setProperty('background-color', isLight ? '#e5e7eb' : 'rgba(6, 78, 59, 0.4)', 'important');
      }
    }

    const rdBadge = document.getElementById('rdStatusBadge');
    if (rdBadge) {
      if (todayJap >= targetCount) {
        rdBadge.className = "text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border bg-emerald-950/90 border-emerald-500/60 text-emerald-300";
        rdBadge.innerText = isHindi ? "✓ नियम पूर्ण हुआ" : "✓ Goal Complete";
      } else {
        rdBadge.className = "text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border bg-amber-950/90 border-amber-500/40 text-amber-300";
        const rem = Math.max(0, targetMalas - todayMalas);
        rdBadge.innerText = isHindi ? `⏳ नियम बाकी (${rem} माला शेष)` : `⏳ In Progress (${rem} Mala remaining)`;
      }
    }

    // 2. महा-संकल्प (Maha-Sankalp)
    const targetFdCount = Number(userProfile.fdGoal) || (userProfile.activeGoal && Number(userProfile.activeGoal.targetCount)) || 100000;
    
    let goalTitle = userProfile.activeGoal?.title;
    if (!goalTitle || (goalTitle.includes("1 लाख") && targetFdCount !== 100000)) {
      goalTitle = isHindi ? `${targetFdCount.toLocaleString(numLocale)} नाम महा-संकल्प` : `${targetFdCount.toLocaleString(numLocale)} Divine Names Sankalp`;
    }

    const mantraNameDisplay = (userProfile.activeGoal?.mantra && userProfile.activeGoal.mantra !== 'ALL') 
      ? userProfile.activeGoal.mantra 
      : (isHindi ? "सभी नाम" : "All Names");

    safeSet('goalTitleDisplay', goalTitle);
    safeSet('goalTargetText', isHindi 
      ? `लक्ष्य: ${targetFdCount.toLocaleString(numLocale)} नाम | ${mantraNameDisplay}` 
      : `Target: ${targetFdCount.toLocaleString(numLocale)} Japa | ${mantraNameDisplay}`);

    const fdPercent = Math.min(100, Math.round((currentBal / targetFdCount) * 100));
    const fdRemaining = Math.max(0, targetFdCount - currentBal);

    safeSet('fdProgressText', `${fdPercent}%`);
    safeSet('fdRemainingText', isHindi 
      ? `संकल्प पूर्ण होने में शेष: ${fdRemaining.toLocaleString(numLocale)} नाम` 
      : `Remaining: ${fdRemaining.toLocaleString(numLocale)} Japa`);

    const fdBar = document.getElementById('fdProgressBar');
    if (fdBar) {
      fdBar.style.width = `${fdPercent}%`;
      if (fdBar.parentElement) {
        fdBar.parentElement.style.setProperty('background-color', isLight ? '#fed7aa' : 'rgba(67, 20, 7, 0.8)', 'important');
      }
    }

    // 3. संकटमोचन कृपा सहायता (Sankatmochan Kripa Sahayata)
    const loanObj = userProfile.kripaLoan || { isActive: false, amount: 0, repaid: 0, purpose: "" };
    const loanBadge = document.getElementById('loanStatusBadge');
    const noLoanBox = document.getElementById('noLoanBox');
    const activeLoanBox = document.getElementById('activeLoanBox');

    if (loanObj.isActive && loanObj.amount > 0) {
      if (loanBadge) {
        loanBadge.className = "text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border bg-rose-950/90 border-rose-500/60 text-rose-300";
        loanBadge.innerText = isHindi ? "कृपा साधना चालू ⏳" : "Grace Japa In Progress ⏳";
      }
      if (noLoanBox) noLoanBox.classList.add('hidden');
      if (activeLoanBox) activeLoanBox.classList.remove('hidden');

      let displayLoanReason = loanObj.purpose || (isHindi ? "संकटमोचन अग्रिम सहायता" : "Emergency Grace Aid");
      displayLoanReason = translatePurposeText(displayLoanReason, !isHindi);

      safeSet('loanReasonDisplay', displayLoanReason);
      safeSet('loanRepaidText', `${(loanObj.repaid || 0).toLocaleString(numLocale)} / ${(loanObj.amount).toLocaleString(numLocale)} ${isHindi ? 'नाम' : 'Japa'}`);

      const loanPercent = Math.min(100, Math.round(((loanObj.repaid || 0) / loanObj.amount) * 100));
      const loanBar = document.getElementById('loanProgressBar');
      if (loanBar) loanBar.style.width = `${loanPercent}%`;
    } else {
      if (loanBadge) {
        loanBadge.className = "text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border bg-emerald-950/90 border-emerald-500/40 text-emerald-300";
        loanBadge.innerText = isHindi ? "संकट मुक्त ✓" : "Grace Fulfilled ✓";
      }
      if (noLoanBox) noLoanBox.classList.remove('hidden');
      if (activeLoanBox) activeLoanBox.classList.add('hidden');
    }

  } else {
    currentBal = parseInt(localStorage.getItem('bm_guest_balance'), 10) || 0;
    if (authBtnContainer) {
      authBtnContainer.innerHTML = `
        <button onclick="openAuthModal('login')" class="px-2 py-1 rounded-lg gold-foil text-amber-950 font-bold text-[10px] flex items-center gap-1 shadow active:scale-95 transition">
          <i data-lucide="log-in" class="w-3.5 h-3.5"></i>
          <span>${isHindi ? 'लॉगिन' : 'Login'}</span>
        </button>
      `;
    }
    if (profilePrompt) profilePrompt.classList.remove('hidden');
    if (profileDetails) profileDetails.classList.add('hidden');
  }

  safeSet('sadhakNameDisplay', name);
  safeSet('dashAccNoDisplay', accNum);
  safeSet('currentIshtName', isht);
  safeSet('cardAccountNumber', accNum);
  safeSet('holderDisplayName', name);
  safeSet('holderIshtDisplay', isht);

  setResponsiveCounter('totalBankBalance', currentBal, numLocale);
  setResponsiveCounter('accScreenTotalBal', currentBal, numLocale);
  setResponsiveCounter('accScreenTotalDed', Number(userProfile?.totalDedicated) || 0, numLocale);
  safeSet('totalMalaCount', Math.floor(currentBal / 108).toLocaleString(numLocale));

  const today = getTodayJaap();
  setResponsiveCounter('todayJaapCount', today, numLocale);
  safeSet('todayMalaCount', Math.floor(today / 108).toLocaleString(numLocale));

  // अर्पण पत्र विवरण
  let payee = isHindi ? `श्री ${isht} जी के पावन चरण कमलेभ्यो नमः` : `Holy Lotus Feet of Shri ${isht}`;
  const lowerIsht = (isht || '').toLowerCase();
  if (lowerIsht.includes("सीताराम") || lowerIsht.includes("राम") || lowerIsht.includes("sita") || lowerIsht.includes("ram")) {
    payee = isHindi ? "श्री सीताराम युगल चरण कमलेभ्यो नमः" : "Lotus Feet of Shri Sitaram Yugal";
  } else if (lowerIsht.includes("शिव") || lowerIsht.includes("महादेव") || lowerIsht.includes("भोले") || lowerIsht.includes("shiv") || lowerIsht.includes("shamb") || lowerIsht.includes("mahadev")) {
    payee = isHindi ? "देवाधिदेव उमा-महेश्वर शिव-शम्भु चरण कमलेभ्यो नमः" : "Lotus Feet of Lord Shiva-Shambhu";
  } else if (lowerIsht.includes("हरे कृष्ण") || lowerIsht.includes("कृष्ण") || lowerIsht.includes("krishna")) {
    payee = isHindi ? "श्री श्री राधा-गोविन्द युगल चरण कमलेभ्यो नमः" : "Lotus Feet of Sri Sri Radha Govinda";
  } else if (lowerIsht.includes("राधा") || lowerIsht.includes("radha")) {
    payee = isHindi ? "श्री राधा-कृष्ण युगल चरण कमलेभ्यो नमः" : "Lotus Feet of Shri Radha-Krishna Yugal";
  }
  safeSet('chequePayeeDisplay', payee);
  safeSet('chequeAmountDisplay', currentBal.toLocaleString(numLocale));
  safeSet('chequeSignature', name);
  safeSet('chequeDate', new Date().toLocaleDateString(numLocale));

  renderPassbookLedger();
  if (activePassbookView === 'calendar' && typeof renderSadhanaCalendar === 'function') {
    renderSadhanaCalendar(currentCalYear, currentCalMonth);
  }
  renderCachedCibilScore();
  updateNetworkStatus();

  if (typeof updateSidebarContent === 'function') updateSidebarContent();
  if (typeof updateAllAvatarImages === 'function') updateAllAvatarImages();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function loadUserData() {
  if (cleanAcc || activeAcc) {
    userProfile = JSON.parse(localStorage.getItem(`bm_user_${cleanAcc}`)) || 
                  JSON.parse(localStorage.getItem(`bm_user_${activeAcc}`)) || null;
  }
  renderProfileData();
  if (getOfflineQueue().length > 0 && navigator.onLine) syncOfflineQueueToFirebase();
  else fetchFreshDashboardData();
}

async function fetchFreshDashboardData() {
  if (!cleanAcc || !isFirebaseReady || !navigator.onLine) return;
  try {
    let doc = await db.collection("bm_sadhak_accounts").doc(cleanAcc).get();
    if (doc.exists) {
      const cloudData = doc.data();
      const localProfile = userProfile || JSON.parse(localStorage.getItem(`bm_user_${cleanAcc}`)) || {};

      const localTxs = Array.isArray(localProfile.transactions) ? localProfile.transactions : [];
      const cloudTxs = Array.isArray(cloudData.transactions) ? cloudData.transactions : [];

      const txMap = new Map();
      [...localTxs, ...cloudTxs].forEach((tx, idx) => {
        if (tx) {
          const key = (tx.isDailySummary && tx.dateKey)
            ? `summary_${tx.dateKey}`
            : (tx.id ? String(tx.id) : `${tx.date}_${tx.particulars}_${tx.amount}_${idx}`);
          if (!txMap.has(key)) txMap.set(key, tx);
        }
      });

      const mergedTxs = Array.from(txMap.values());
      mergedTxs.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));

      // 🎯 स्थानीय और क्लाउड में से उच्चतम बैलेंस ही सुरक्षित रहेगा
      let resolvedBalance = Math.max(Number(cloudData.balance || 0), Number(localProfile.balance || 0));
      if (mergedTxs.length > 0 && mergedTxs[0].balanceAfter !== undefined && !isNaN(Number(mergedTxs[0].balanceAfter))) {
        resolvedBalance = Math.max(resolvedBalance, Number(mergedTxs[0].balanceAfter));
      }

      const localLogs = (localProfile && localProfile.dailyLogs) || {};
      const cloudLogs = (cloudData && cloudData.dailyLogs) || {};
      const mergedLogs = { ...cloudLogs, ...localLogs };

      const todayK = getTodayKey();
      const todayVal = getTodayJaap();
      if (todayVal > (mergedLogs[todayK] || 0)) {
        mergedLogs[todayK] = todayVal;
      }

      userProfile = {
        ...cloudData,
        ...localProfile,
        balance: resolvedBalance,
        transactions: mergedTxs.slice(0, 100),
        dailyLogs: mergedLogs,
        activeGoal: localProfile.activeGoal || cloudData.activeGoal,
        kripaLoan: localProfile.kripaLoan || cloudData.kripaLoan
      };

      localStorage.setItem(`bm_user_${cleanAcc}`, JSON.stringify(userProfile));
      renderProfileData();

      if (resolvedBalance !== Number(cloudData.balance || 0) || mergedTxs.length > cloudTxs.length) {
        db.collection("bm_sadhak_accounts").doc(cleanAcc).update({
          balance: resolvedBalance,
          transactions: mergedTxs.slice(0, 100),
          dailyLogs: mergedLogs,
          activeGoal: userProfile.activeGoal,
          kripaLoan: userProfile.kripaLoan
        }).catch(()=>{});
      }
    }
  } catch (err) {}
}

// ========================================================
// 📜 साधना डायरी लेजर (तारीखवार दैनिक रिकॉर्ड)
// ========================================================
var passbookVisibleLimit = 5;

function renderPassbookLedger() {
  const container = document.getElementById('ledgerCardContainer');
  if (!container) return;
  container.innerHTML = '';

  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const numLocale = isHindi ? 'hi-IN' : 'en-IN';

  const logs = (userProfile && userProfile.dailyLogs) ? { ...userProfile.dailyLogs } : {};

  if (userProfile && Array.isArray(userProfile.transactions)) {
    userProfile.transactions.forEach(tx => {
      if (tx && tx.type === 'CREDIT' && tx.id) {
        const d = new Date(Number(tx.id));
        if (!isNaN(d.getTime())) {
          const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          if (!logs[k] || logs[k] < Number(tx.amount || 0)) {
            logs[k] = Math.max(Number(logs[k] || 0), Number(tx.amount || 0));
          }
        }
      }
    });
  }

  let dateEntries = Object.keys(logs)
    .filter(k => Number(logs[k]) > 0)
    .map(k => ({
      rawDate: k,
      count: Number(logs[k])
    }));

  if (dateEntries.length === 0) {
    const emptyMsg = isHindi ? "कोई साधना प्रविष्टि दर्ज नहीं है।" : "No sadhana records found yet.";
    container.innerHTML = `<div class="p-4 text-center text-xs text-amber-400/50 card-glass rounded-2xl">${emptyMsg}</div>`;
    return;
  }

  dateEntries.sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));

  const cardBox = document.createElement('div');
  cardBox.className = "card-glass rounded-2xl p-4 shadow-lg border border-amber-600/30 text-xs font-sans space-y-0";

  const visibleList = dateEntries.slice(0, passbookVisibleLimit);

  visibleList.forEach((entry, index) => {
    const parts = entry.rawDate.split('-');
    let formattedDate = entry.rawDate;
    if (parts.length === 3) {
      formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    const row = document.createElement('div');
    const isLast = (index === visibleList.length - 1);
    row.className = `flex justify-between items-center py-2.5 ${!isLast ? 'border-b border-amber-800/20' : ''}`;
    row.innerHTML = `
      <span class="font-mono text-xs sm:text-sm text-amber-100 font-medium tracking-wide">${formattedDate}</span>
      <span class="font-mono font-bold text-sm sm:text-base text-amber-500">${entry.count.toLocaleString(numLocale)}</span>
    `;
    cardBox.appendChild(row);
  });

  if (dateEntries.length > passbookVisibleLimit) {
    const showMoreBox = document.createElement('div');
    showMoreBox.className = "text-right pt-3 border-t border-amber-800/10";
    showMoreBox.innerHTML = `
      <button onclick="expandPassbookEntries()" class="text-amber-500 hover:text-amber-400 text-xs font-semibold cursor-pointer active:scale-95 transition">
        Show more
      </button>
    `;
    cardBox.appendChild(showMoreBox);
  }

  container.appendChild(cardBox);
}

function expandPassbookEntries() {
  passbookVisibleLimit += 10;
  renderPassbookLedger();
}
window.expandPassbookEntries = expandPassbookEntries;

// ऑफलाइन / डायरी जप जोड़ें फॉर्म
function toggleManualCustomMantra(val) {
  const box = document.getElementById('manualCustomMantraContainer');
  const input = document.getElementById('manualCustomMantraInput');
  if (box && input) {
    if (val === 'CUSTOM') {
      box.classList.remove('hidden');
      input.required = true;
      input.focus();
    } else {
      box.classList.add('hidden');
      input.required = false;
    }
  }
}

const malaInputEl = document.getElementById('malaInput');
if (malaInputEl) {
  malaInputEl.addEventListener('input', (e) => {
    if (e.target.value) {
      const val = parseInt(e.target.value, 10);
      document.getElementById('directCountInput').value = isNaN(val) ? '' : val * 108;
    }
  });
}

const manualDepForm = document.getElementById('manualDepositForm');
if (manualDepForm) {
  manualDepForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const countInput = document.getElementById('directCountInput');
    const count = parseInt(countInput ? countInput.value : 0, 10);
    if (isNaN(count) || count <= 0) return;
    if (!userProfile) { openAuthModal('login'); return; }

    const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');

    let chosenMantra = document.getElementById('mantraType').value;
    if (chosenMantra === 'CUSTOM') {
      chosenMantra = document.getElementById('manualCustomMantraInput').value.trim() || userProfile.isht || (isHindi ? "इष्ट नाम" : "Isht Naam");
    }

    userProfile.balance = (Number(userProfile.balance) || 0) + count;
    if (!Array.isArray(userProfile.transactions)) {
      userProfile.transactions = [];
    }

    const tx = {
      id: Date.now(),
      date: new Date().toLocaleString(isHindi ? 'hi-IN' : 'en-IN', { dateStyle: 'short', timeStyle: 'short' }),
      particulars: isHindi ? `डायरी जप: ${chosenMantra}` : `Offline Japa: ${chosenMantra}`,
      mantra: chosenMantra,
      type: 'CREDIT', 
      amount: count, 
      balanceAfter: userProfile.balance
    };
    userProfile.transactions.unshift(tx);
    userProfile.transactions = userProfile.transactions.slice(0, 100);

    addTodayJaap(count);

    const storageKey = cleanAcc ? `bm_user_${cleanAcc}` : (activeAcc ? `bm_user_${activeAcc}` : null);
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(userProfile));
    }

    if (cleanAcc && isFirebaseReady && navigator.onLine) {
      db.collection("bm_sadhak_accounts").doc(cleanAcc).update({
        balance: userProfile.balance,
        transactions: userProfile.transactions,
        dailyLogs: userProfile.dailyLogs || {}
      }).catch(()=>{});
    }

    document.getElementById('manualDepositForm').reset();
    toggleManualCustomMantra('');
    renderProfileData();
    showToast(isHindi ? `✓ +${count} ${chosenMantra} जप जुड़े!` : `✓ +${count} ${chosenMantra} Japa Added!`, 'success');
    switchAppTab('account');
  });
}

// 🎯 पुण्य अर्पण फॉर्म (Dedicate Japa Form)
const transferFormEl = document.getElementById('transferForm');
if (transferFormEl) {
  transferFormEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const countInput = document.getElementById('transferCountInput');
    const count = parseInt(countInput ? countInput.value : 0, 10);
    const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
    const numLocale = isHindi ? 'hi-IN' : 'en-IN';

    if (isNaN(count) || count <= 0) {
      alert(isHindi ? "कृपया वैध नाम जप संख्या दर्ज करें!" : "Please enter a valid Japa count!");
      return;
    }

    if (!userProfile) { 
      openAuthModal('login'); 
      return; 
    }

    const currentBal = Number(userProfile.balance) || 0;

    if (count > currentBal) { 
      alert(isHindi 
        ? `अपर्याप्त संचित नाम जप!\n\nवर्तमान बचत: ${currentBal.toLocaleString(numLocale)} नाम\nअर्पण करने हेतु दर्ज: ${count.toLocaleString(numLocale)} नाम` 
        : `Insufficient saved Japa balance!\n\nCurrent Savings: ${currentBal.toLocaleString(numLocale)} Japa\nRequested: ${count.toLocaleString(numLocale)} Japa`); 
      return; 
    }

    const newBalance = currentBal - count;
    userProfile.balance = newBalance;
    userProfile.totalDedicated = (Number(userProfile.totalDedicated) || 0) + count;

    if (!Array.isArray(userProfile.transactions)) {
      userProfile.transactions = [];
    }

    const beneficiaryEl = document.getElementById('transferBeneficiary');
    const beneficiary = beneficiaryEl ? beneficiaryEl.value : (isHindi ? "परमार्थ" : "Welfare");

    const tx = {
      id: Date.now(),
      date: new Date().toLocaleString(isHindi ? 'hi-IN' : 'en-IN', { dateStyle: 'short', timeStyle: 'short' }),
      particulars: isHindi ? `पुण्य अर्पण: ${beneficiary}` : `Dedicate Japa: ${beneficiary}`,
      type: 'DEBIT', 
      amount: count, 
      balanceAfter: newBalance
    };

    userProfile.transactions.unshift(tx);
    userProfile.transactions = userProfile.transactions.slice(0, 100);

    const storageKey = cleanAcc ? `bm_user_${cleanAcc}` : (activeAcc ? `bm_user_${activeAcc}` : null);
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(userProfile));
    }

    if (cleanAcc && isFirebaseReady && navigator.onLine) {
      db.collection("bm_sadhak_accounts").doc(cleanAcc).update({
        balance: newBalance,
        totalDedicated: userProfile.totalDedicated,
        transactions: userProfile.transactions
      }).catch(()=>{});
    }

    document.getElementById('transferForm').reset();
    renderProfileData();
    showToast(isHindi ? `🙏 ${count.toLocaleString(numLocale)} नाम जप फल समर्पित हुआ!` : `🙏 ${count.toLocaleString(numLocale)} Japa dedicated successfully!`, 'success');
    switchServiceSubTab('sub-cheque');
  });
}

// 🎯 महा-संकल्प इंजन (Maha-Sankalp Engine)
function openChangeGoalModal() {
  if (!userProfile) { openAuthModal('login'); return; }
  const modal = document.getElementById('goalModal');
  if (modal) modal.classList.remove('hidden');

  const mantraSel = document.getElementById('customGoalMantraSelect');
  if (mantraSel && userProfile.isht) {
    const userIsht = userProfile.isht;
    let found = false;
    for (let i = 0; i < mantraSel.options.length; i++) {
      if (mantraSel.options[i].value === userIsht) { found = true; break; }
    }
    if (!found) {
      const opt = document.createElement('option');
      opt.value = userIsht;
      opt.textContent = `📿 ${userIsht}`;
      mantraSel.insertBefore(opt, mantraSel.options[1]);
    }
  }

  if (userProfile.activeGoal) {
    safeSetValue('customGoalTitleInput', userProfile.activeGoal.title || '');
    const unit = userProfile.activeGoal.unit || 'JAPS';
    safeSetValue('customGoalUnitSelect', unit);

    let displayCount = userProfile.activeGoal.inputCount;
    if (!displayCount || isNaN(displayCount)) {
      const tCount = Number(userProfile.activeGoal.targetCount) || 100000;
      displayCount = (unit === 'MALAS') ? Math.round(tCount / 108) : tCount;
    }
    safeSetValue('customGoalCountInput', displayCount);
  }
}

function closeChangeGoalModal() {
  const modal = document.getElementById('goalModal');
  if (modal) modal.classList.add('hidden');
}

function toggleGoalCustomMantra(val) {
  const box = document.getElementById('goalCustomMantraContainer');
  const input = document.getElementById('goalCustomMantraInput');
  if (box && input) {
    if (val === 'CUSTOM') {
      box.classList.remove('hidden');
      input.required = true;
      input.focus();
    } else {
      box.classList.add('hidden');
      input.required = false;
    }
  }
}

function saveCustomGoal(e) {
  e.preventDefault();
  if (!userProfile) { openAuthModal('login'); return; }

  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const numLocale = isHindi ? 'hi-IN' : 'en-IN';

  const title = document.getElementById('customGoalTitleInput').value.trim();
  let mantra = document.getElementById('customGoalMantraSelect').value;
  if (mantra === 'CUSTOM') {
    mantra = document.getElementById('goalCustomMantraInput').value.trim() || userProfile.isht || (isHindi ? "इष्ट मंत्र" : "Isht Mantra");
  }

  const rawCountInput = document.getElementById('customGoalCountInput');
  const rawCount = parseInt(rawCountInput ? rawCountInput.value : 0, 10);
  const unit = document.getElementById('customGoalUnitSelect').value;

  if (isNaN(rawCount) || rawCount <= 0) { 
    alert(isHindi ? "कृपया वैध लक्ष्य संख्या दर्ज करें!" : "Please enter a valid target count!"); 
    return; 
  }

  const calculatedTarget = (unit === 'MALAS') ? (rawCount * 108) : rawCount;

  userProfile.activeGoal = {
    title: title || (isHindi ? `${rawCount.toLocaleString(numLocale)} ${unit === 'MALAS' ? 'माला' : 'नाम'} महा-संकल्प` : `${rawCount.toLocaleString(numLocale)} ${unit === 'MALAS' ? 'Mala' : 'Japa'} Sankalp`),
    mantra: mantra,
    inputCount: rawCount,
    unit: unit,
    targetCount: calculatedTarget
  };

  userProfile.fdGoal = calculatedTarget;
  const storageKey = cleanAcc ? `bm_user_${cleanAcc}` : (activeAcc ? `bm_user_${activeAcc}` : null);
  if (storageKey) {
    localStorage.setItem(storageKey, JSON.stringify(userProfile));
  }

  if (cleanAcc && isFirebaseReady && navigator.onLine) {
    db.collection("bm_sadhak_accounts").doc(cleanAcc).update({
      activeGoal: userProfile.activeGoal,
      fdGoal: userProfile.fdGoal
    }).catch(()=>{});
  }

  closeChangeGoalModal();
  renderProfileData();
  if (typeof playMalaGong === 'function') playMalaGong();
  showToast(isHindi ? `🏛️ महा-संकल्प: ${userProfile.activeGoal.title} स्थापित हुआ!` : `🏛️ Maha-Sankalp: ${userProfile.activeGoal.title} Established!`, 'success');
}

function setGoal(val) {
  if (!userProfile) return;
  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const safeVal = Number(val) || 100000;
  userProfile.fdGoal = safeVal;
  userProfile.activeGoal = {
    title: isHindi ? `${safeVal.toLocaleString('hi-IN')} नाम महा-संकल्प` : `${safeVal.toLocaleString('en-IN')} Divine Names Sankalp`,
    mantra: "ALL",
    targetCount: safeVal,
    inputCount: safeVal,
    unit: "JAPS"
  };
  const storageKey = cleanAcc ? `bm_user_${cleanAcc}` : (activeAcc ? `bm_user_${activeAcc}` : null);
  if (storageKey) {
    localStorage.setItem(storageKey, JSON.stringify(userProfile));
  }

  if (isFirebaseReady && navigator.onLine && cleanAcc) {
    db.collection("bm_sadhak_accounts").doc(cleanAcc).update({
      activeGoal: userProfile.activeGoal,
      fdGoal: userProfile.fdGoal
    }).catch(()=>{});
  }

  closeChangeGoalModal();
  renderProfileData();
  showToast(isHindi ? "नया संकल्प सहेजा गया!" : "New Sankalp saved!", "success");
}

// संकटमोचन कृपा सहायता इंजन
function openLoanModal() {
  if (!userProfile) { openAuthModal('login'); return; }
  const modal = document.getElementById('loanModal');
  if (modal) modal.classList.remove('hidden');
}

function closeLoanModal() {
  const modal = document.getElementById('loanModal');
  if (modal) modal.classList.add('hidden');
}

function toggleLoanCustomAmount(val) {
  const box = document.getElementById('loanCustomAmountBox');
  const input = document.getElementById('loanCustomAmountInput');
  if (box && input) {
    if (val === 'CUSTOM') {
      box.classList.remove('hidden');
      input.required = true;
      input.focus();
    } else {
      box.classList.add('hidden');
      input.required = false;
    }
  }
}

async function handleApplyKripaLoan(e) {
  e.preventDefault();
  if (!userProfile) { openAuthModal('login'); return; }

  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const numLocale = isHindi ? 'hi-IN' : 'en-IN';

  if (userProfile.kripaLoan && userProfile.kripaLoan.isActive) {
    alert(isHindi 
      ? "आपके खाते में पहले से एक संकटमोचन कृपा सहायता सक्रिय है! कृपया पहले उसे नित्य आभार जप से पूर्ण करें।"
      : "You already have an active Kripa Sahayata! Please complete it first via daily gratitude Japa.");
    return;
  }

  const purpose = document.getElementById('loanPurposeSelect').value;
  let amountVal = document.getElementById('loanAmountSelect').value;
  if (amountVal === 'CUSTOM') {
    amountVal = parseInt(document.getElementById('loanCustomAmountInput').value, 10);
  } else {
    amountVal = parseInt(amountVal, 10);
  }

  if (isNaN(amountVal) || amountVal < 1000) { 
    alert(isHindi ? "न्यूनतम कृपा सहायता 1,000 नाम जप है!" : "Minimum grace assistance is 1,000 Japa!"); 
    return; 
  }

  const currentBal = Number(userProfile.balance) || 0;

  const creditTx = {
    id: Date.now(),
    date: new Date().toLocaleString(numLocale, { dateStyle: 'short', timeStyle: 'short' }),
    particulars: isHindi ? `संकटमोचन कृपा सहायता स्वीकृति: ${purpose}` : `Kripa Sahayata Approved: ${purpose}`,
    type: "CREDIT",
    amount: amountVal,
    balanceAfter: currentBal + amountVal
  };

  const debitTx = {
    id: Date.now() + 1,
    date: new Date().toLocaleString(numLocale, { dateStyle: 'short', timeStyle: 'short' }),
    particulars: isHindi ? `कृपा फल अर्पण: ${purpose}` : `Grace Offering: ${purpose}`,
    type: "DEBIT",
    amount: amountVal,
    balanceAfter: currentBal
  };

  if (!Array.isArray(userProfile.transactions)) {
    userProfile.transactions = [];
  }

  userProfile.totalDedicated = (Number(userProfile.totalDedicated) || 0) + amountVal;
  userProfile.transactions.unshift(debitTx);
  userProfile.transactions.unshift(creditTx);
  userProfile.transactions = userProfile.transactions.slice(0, 100);

  userProfile.kripaLoan = {
    isActive: true,
    amount: amountVal,
    repaid: 0,
    purpose: purpose,
    takenAt: new Date().toISOString()
  };

  const storageKey = cleanAcc ? `bm_user_${cleanAcc}` : (activeAcc ? `bm_user_${activeAcc}` : null);
  if (storageKey) {
    localStorage.setItem(storageKey, JSON.stringify(userProfile));
  }

  if (cleanAcc && isFirebaseReady && navigator.onLine) {
    try {
      await db.collection("bm_sadhak_accounts").doc(cleanAcc).update({
        totalDedicated: userProfile.totalDedicated,
        transactions: userProfile.transactions,
        kripaLoan: userProfile.kripaLoan
      });
    } catch(err) {}
  }

  closeLoanModal();
  renderProfileData();
  if (typeof playMalaGong === 'function') playMalaGong();

  const purposeDisplay = isHindi ? purpose : translatePurposeText(purpose, true);

  if (isHindi) {
    alert(`🎉 ठाकुर जी की संकटमोचन कृपा सहायता स्वीकृत!\n\nराशि: ${amountVal.toLocaleString(numLocale)} नाम जप\nउद्देश्य: ${purposeDisplay}\n\nयह दिव्य कृपा फल तुरंत समर्पित कर दिया गया है। अब प्रतिदिन 1 माला (108 नाम) के आसान दैनिक आभार जप में ठाकुरजी के चरणों में अपनी कृतज्ञता अर्पित करें!`);
    showToast(`🤝 ${amountVal.toLocaleString(numLocale)} नाम की कृपा सहायता स्वीकृत!`, 'success');
  } else {
    alert(`🎉 Thakurji's Kripa Sahayata Approved!\n\nAmount: ${amountVal.toLocaleString(numLocale)} Japa\nPurpose: ${purposeDisplay}\n\nThis divine grace has been offered immediately. Please offer daily gratitude Japa of 1 Mala (108 names) regularly!`);
    showToast(`🤝 ${amountVal.toLocaleString(numLocale)} Japa Kripa Sahayata Approved!`, 'success');
  }
}

async function payLoanEmiFromSavings(emiAmount = 108) {
  if (!userProfile) { openAuthModal('login'); return; }
  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const loan = userProfile.kripaLoan;
  if (!loan || !loan.isActive) {
    showToast(isHindi ? "आपके खाते में कोई सक्रिय कृपा सहायता नहीं है!" : "No active grace assistance found!", "info");
    return;
  }

  const remainingDebt = (Number(loan.amount) || 0) - (Number(loan.repaid) || 0);
  const payCount = Math.min(emiAmount, remainingDebt);
  const currentBal = Number(userProfile.balance) || 0;

  if (currentBal < payCount) {
    alert(isHindi 
      ? `अपर्याप्त चालू बचत कोष!\n\nआभार जप अर्पित करने हेतु आपके बचत खाते में कम से कम ${payCount} नाम होने चाहिए। वर्तमान बचत: ${currentBal} नाम। कृपया पहले जप माला पर जप करें।`
      : `Insufficient Savings Balance!\n\nYou need at least ${payCount} Japa in savings to offer this gratitude Japa. Current savings: ${currentBal} Japa. Please perform Japa on beads first.`);
    return;
  }

  userProfile.balance = currentBal - payCount;
  loan.repaid = (Number(loan.repaid) || 0) + payCount;

  const isFullyRepaid = (loan.repaid >= loan.amount);
  if (isFullyRepaid) {
    loan.repaid = loan.amount;
    loan.isActive = false;
  }

  if (!Array.isArray(userProfile.transactions)) {
    userProfile.transactions = [];
  }

  const emiTx = {
    id: Date.now(),
    date: new Date().toLocaleString(isHindi ? 'hi-IN' : 'en-IN', { dateStyle: 'short', timeStyle: 'short' }),
    particulars: isFullyRepaid 
      ? (isHindi ? `संकटमोचन कृपा सहायता पूर्ण समर्पित` : `Kripa Sahayata Grace Completed`)
      : (isHindi ? `संकटमोचन दैनिक आभार जप अर्पण` : `Daily Gratitude Japa Offering`),
    type: "DEBIT",
    amount: payCount,
    balanceAfter: userProfile.balance
  };

  userProfile.transactions.unshift(emiTx);
  userProfile.transactions = userProfile.transactions.slice(0, 100);

  const storageKey = cleanAcc ? `bm_user_${cleanAcc}` : (activeAcc ? `bm_user_${activeAcc}` : null);
  if (storageKey) {
    localStorage.setItem(storageKey, JSON.stringify(userProfile));
  }

  if (cleanAcc && isFirebaseReady && navigator.onLine) {
    try {
      await db.collection("bm_sadhak_accounts").doc(cleanAcc).update({
        balance: userProfile.balance,
        transactions: userProfile.transactions,
        kripaLoan: userProfile.kripaLoan
      });
    } catch (err) {}
  }

  renderProfileData();

  if (isFullyRepaid) {
    if (typeof playMalaGong === 'function') playMalaGong();
    if (typeof triggerVibrate === 'function') triggerVibrate([100, 60, 100, 60, 150]);
    alert(isHindi 
      ? "🎉 बधाई हो! ठाकुर जी की संकटमोचन कृपा सहायता पूर्णतः सम्पन्न हुई!\n\nआपका खाता अब संकट मुक्त है और आपका भक्ति मीटर स्कोर 850+ पर पहुँच गया है!"
      : "🎉 Congratulations! Thakurji's Kripa Sahayata is completely fulfilled!\n\nYour account is now grace-fulfilled and your Bhakti Meter has reached 850+!");
    showToast(isHindi ? "🌟 कृपा सहायता पूर्ण सम्पन्न! (850+ भक्ति मीटर)" : "🌟 Grace Fulfilled! (850+ Bhakti Meter)", "success");
  } else {
    if (typeof playChime === 'function') playChime(1040, 0.4);
    if (typeof triggerVibrate === 'function') triggerVibrate(50);
    showToast(isHindi ? `✓ बचत कोष से आभार जप (-${payCount} नाम) अर्पित हुआ!` : `✓ Daily gratitude Japa of ${payCount} offered from savings!`, "success");
  }
}

async function payFullLoanFromSavings() {
  if (!userProfile) { openAuthModal('login'); return; }
  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const numLocale = isHindi ? 'hi-IN' : 'en-IN';
  const loan = userProfile.kripaLoan;
  if (!loan || !loan.isActive) {
    showToast(isHindi ? "कोई सक्रिय कृपा सहायता नहीं है!" : "No active grace assistance!", "info");
    return;
  }

  const remainingDebt = (Number(loan.amount) || 0) - (Number(loan.repaid) || 0);
  const currentBal = Number(userProfile.balance) || 0;

  if (currentBal < remainingDebt) {
    alert(isHindi 
      ? `अपर्याप्त चालू बचत कोष!\n\nपूर्ण कृपा सहायता सम्पन्न करने हेतु आपके पास ${remainingDebt.toLocaleString(numLocale)} नाम होने चाहिए। वर्तमान बचत: ${currentBal.toLocaleString(numLocale)} नाम।`
      : `Insufficient Savings Balance!\n\nYou need ${remainingDebt.toLocaleString(numLocale)} Japa to fully complete. Current savings: ${currentBal.toLocaleString(numLocale)} Japa.`);
    return;
  }

  const confirmMsg = isHindi 
    ? `क्या आप चालू बचत कोष से ${remainingDebt.toLocaleString(numLocale)} नाम काटकर पूरा आभार जप अभी एकमुश्त समर्पित करना चाहते हैं?`
    : `Do you want to deduct ${remainingDebt.toLocaleString(numLocale)} Japa from savings and fully offer all gratitude Japa now?`;

  if (confirm(confirmMsg)) {
    await payLoanEmiFromSavings(remainingDebt);
  }
}

// भक्ति मीटर (Bhakti Meter Rating Engine)
function openCibilModal() { 
  const el = document.getElementById('cibilModal');
  if (el) el.classList.remove('hidden'); 
}
function closeCibilModal() { 
  const el = document.getElementById('cibilModal');
  if (el) el.classList.add('hidden'); 
}

function renderCachedCibilScore() {
  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  if (!userProfile || !userProfile.accNo) {
    safeSet('cibilScoreDisplay', '---');
    safeSet('cibilScoreMini', '---');
    safeSet('cibilGradeDisplay', isHindi ? 'लॉगिन अपेक्षित' : 'Login Required');
    safeSet('cibilGradeMini', isHindi ? 'जांच नहीं हुई' : 'Not Evaluated');
    safeSet('cibilBadgeDisplay', isHindi ? 'अपेक्षित' : 'Pending');
    return;
  }
  const cached = localStorage.getItem(`bm_cibil_${cleanAcc}`);
  if (cached) {
    try {
      const d = JSON.parse(cached);
      safeSet('cibilScoreDisplay', d.score);
      safeSet('cibilScoreMini', d.score);
      safeSet('cibilGradeDisplay', isHindi ? (d.gradeShortHi || d.gradeShort) : (d.gradeShortEn || d.gradeShort));
      safeSet('cibilGradeMini', isHindi ? (d.gradeShortHi || d.gradeShort) : (d.gradeShortEn || d.gradeShort));
      safeSet('cibilBadgeDisplay', isHindi ? '✓ सत्यापित' : '✓ Verified');
      return;
    } catch(e) {}
  }
  calculateAndDisplayBhaktiCibil(false);
}

function triggerCheckCibilScore(isRecheck = false) {
  if (!userProfile) { openAuthModal('login'); return; }
  openCibilModal();
  const load = document.getElementById('cibilLoadingState');
  const res = document.getElementById('cibilResultState');
  if (load) load.classList.remove('hidden'); 
  if (res) res.classList.add('hidden');
  
  let step = 10;
  const inv = setInterval(() => {
    step += 20;
    if (step > 95) step = 100;
    const bar = document.getElementById('cibilGenProgressBar');
    if (bar) bar.style.width = step + '%';
    safeSet('cibilGenPercentText', step + '%');
    if (step >= 100) {
      clearInterval(inv);
      setTimeout(() => calculateAndDisplayBhaktiCibil(true), 250);
    }
  }, 120);
}

function calculateAndDisplayBhaktiCibil(isInteractive = true) {
  if (!userProfile) return;
  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const bal = Number(userProfile.balance) || 0;

  let f1Score = Math.min(200, Math.floor((bal / 25000) * 120) + Math.min(80, Math.floor(bal / 100)));
  if (f1Score < 40) f1Score = 40;

  let amritvelaCount = 0;
  if (Array.isArray(userProfile.transactions)) {
    userProfile.transactions.forEach(t => {
      if (t && t.particulars && (t.particulars.includes('अमृतवेला') || t.particulars.includes('Brahmamuhurta'))) amritvelaCount++;
    });
  }
  let f2Score = 95 + Math.min(55, amritvelaCount * 15);

  const fdGoal = Number(userProfile.fdGoal) || 100000;
  const fdRatio = Math.min(1, bal / fdGoal);
  let f3Score = 60 + Math.floor(fdRatio * 80);

  let f4Score = 40;
  const totDed = Number(userProfile.totalDedicated) || 0;
  if (totDed > 0) f4Score += Math.min(70, Math.floor((totDed / 500) * 20));

  if (userProfile.kripaLoan && !userProfile.kripaLoan.isActive && userProfile.kripaLoan.amount > 0) {
    f4Score = Math.min(110, f4Score + 30);
  }

  const totalScore = Math.min(900, Math.max(300, 300 + f1Score + f2Score + f3Score + f4Score));

  let gradeText = "", gradeShort = "", advice = "", meterColor = "#06b6d4";
  let gradeShortHi = "", gradeShortEn = "";

  if (totalScore >= 780) {
    meterColor = "#10b981";
    if (isHindi) {
      gradeText = "🌟 उत्तम साधक (Paramhans Grade)"; gradeShort = "उत्तम साधक";
      advice = "अद्भुत साधना! आपकी नित्य नियम निष्ठा सर्वोच्च स्तर पर है।";
    } else {
      gradeText = "🌟 Paramhans Grade Devotee"; gradeShort = "Paramhans";
      advice = "Exemplary devotion! Your daily Japa discipline is at the highest order.";
    }
    gradeShortHi = "उत्तम साधक"; gradeShortEn = "Paramhans";
  } else if (totalScore >= 680) {
    meterColor = "#06b6d4";
    if (isHindi) {
      gradeText = "🟢 नियमनिष्ठ साधक (Good Standing)"; gradeShort = "नियमनिष्ठ";
      advice = "आपकी साधना अच्छी है। प्रातः 04:00 से 06:00 में जप बढ़ाकर 780+ स्कोर प्राप्त करें।";
    } else {
      gradeText = "🟢 Good Standing Devotee"; gradeShort = "Good Standing";
      advice = "Consistent sadhana! Increase Japa between 04:00 - 06:00 AM to reach 780+.";
    }
    gradeShortHi = "नियमनिष्ठ"; gradeShortEn = "Good Standing";
  } else if (totalScore >= 550) {
    meterColor = "#f59e0b";
    if (isHindi) {
      gradeText = "🟡 मध्यम साधक (Average)"; gradeShort = "मध्यम साधक";
      advice = "जप में नागा न करें। प्रतिदिन न्यूनतम 16 माला का नित्य नियम बनाएं।";
    } else {
      gradeText = "🟡 Average Devotee"; gradeShort = "Average";
      advice = "Avoid skipping days. Maintain at least 16 malas daily for spiritual momentum.";
    }
    gradeShortHi = "मध्यम साधक"; gradeShortEn = "Average";
  } else {
    meterColor = "#f43f5e";
    if (isHindi) {
      gradeText = "🔴 अनियमित साधक"; gradeShort = "अनियमित";
      advice = "नियमित जप प्रारंभ करें और खाते को सक्रिय रखें।";
    } else {
      gradeText = "🔴 Irregular Japa"; gradeShort = "Irregular";
      advice = "Establish regular daily Japa and keep your divine account active.";
    }
    gradeShortHi = "अनियमित"; gradeShortEn = "Irregular";
  }

  safeSet('cibilScoreDisplay', totalScore);
  safeSet('cibilScoreMini', totalScore);
  safeSet('cibilGradeDisplay', gradeShort);
  safeSet('cibilGradeMini', gradeShort);
  safeSet('cibilBigScore', totalScore);
  safeSet('cibilBigGrade', gradeText);
  safeSet('cibilAdviceText', advice);
  safeSet('cibilReportDate', isHindi ? `जारी तिथि: ${new Date().toLocaleDateString('hi-IN')}` : `Issued Date: ${new Date().toLocaleDateString('en-IN')}`);
  safeSet('cibilBadgeDisplay', isHindi ? '✓ सत्यापित' : '✓ Verified');

  const ptsUnit = isHindi ? 'अंक' : 'pts';
  safeSet('cibilF1Text', `+${f1Score} ${ptsUnit} (${Math.round((f1Score/200)*100)}%)`);
  const b1 = document.getElementById('cibilF1Bar'); if (b1) b1.style.width = `${Math.round((f1Score/200)*100)}%`;

  safeSet('cibilF2Text', `+${f2Score} ${ptsUnit} (${Math.round((f2Score/150)*100)}%)`);
  const b2 = document.getElementById('cibilF2Bar'); if (b2) b2.style.width = `${Math.round((f2Score/150)*100)}%`;

  safeSet('cibilF3Text', `+${f3Score} ${ptsUnit} (${Math.round((f3Score/140)*100)}%)`);
  const b3 = document.getElementById('cibilF3Bar'); if (b3) b3.style.width = `${Math.round((f3Score/140)*100)}%`;

  safeSet('cibilF4Text', `+${f4Score} ${ptsUnit} (${Math.round((f4Score/110)*100)}%)`);
  const b4 = document.getElementById('cibilF4Bar'); if (b4) b4.style.width = `${Math.round((f4Score/110)*100)}%`;

  const meterPercent = Math.round(((totalScore - 300) / 600) * 100);
  const mBorder = document.getElementById('cibilMeterBorder');
  if (mBorder) mBorder.style.background = `conic-gradient(${meterColor} ${meterPercent}%, rgba(212, 163, 55, 0.15) 0%)`;

  if (cleanAcc) {
    localStorage.setItem(`bm_cibil_${cleanAcc}`, JSON.stringify({ 
      score: totalScore, 
      gradeShort: gradeShort, 
      gradeShortHi: gradeShortHi,
      gradeShortEn: gradeShortEn,
      date: new Date().toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN') 
    }));
  }

  if (isInteractive) {
    const lState = document.getElementById('cibilLoadingState'); if (lState) lState.classList.add('hidden');
    const rState = document.getElementById('cibilResultState'); if (rState) rState.classList.remove('hidden');
    if (typeof playChime === 'function') playChime(1040, 1.2);
    lucide.createIcons();
  }
}

// ==========================================
// 🎯 सुरक्षित ऑफ़लाइन कतार प्रबंधन (Safe Anti-Inflation Sync Engine)
// ==========================================
function getOfflineQueue() {
  if (!cleanAcc) return [];
  try { return JSON.parse(localStorage.getItem(`bm_offline_queue_${cleanAcc}`) || '[]'); } catch (e) { return []; }
}

function saveOfflineQueue(q) {
  if (cleanAcc) localStorage.setItem(`bm_offline_queue_${cleanAcc}`, JSON.stringify(q));
}

async function syncOfflineQueueToFirebase() {
  if (!navigator.onLine || !isFirebaseReady || !cleanAcc || isSyncingOffline) return;
  const q = getOfflineQueue();
  if (q.length === 0) return;
  isSyncingOffline = true;

  try {
    const ref = db.collection("bm_sadhak_accounts").doc(cleanAcc);
    const snap = await ref.get();
    
    if (snap.exists) {
      const cloudData = snap.data();
      const localProfile = userProfile || JSON.parse(localStorage.getItem(`bm_user_${cleanAcc}`)) || {};

      // 1. बैलेंस का सुरक्षित समाधान: संचयी जोड़ नहीं, बल्कि उच्चतम वास्तविक स्थिति
      let resolvedBalance = Math.max(Number(cloudData.balance || 0), Number(localProfile.balance || 0));

      // 2. dailyLogs का सुरक्षित विलय
      const mergedLogs = { ...(cloudData.dailyLogs || {}), ...(localProfile.dailyLogs || {}) };

      // कतार के सभी आइटम्स को logs व बैलेंस में सुरक्षित प्रोसेस करें
      const queueTxs = [];
      q.forEach(item => {
        if (item.dateKey && item.dayTotal !== undefined) {
          mergedLogs[item.dateKey] = Math.max(Number(mergedLogs[item.dateKey] || 0), Number(item.dayTotal));
        }
        if (item.currentBalance !== undefined) {
          resolvedBalance = Math.max(resolvedBalance, Number(item.currentBalance));
        }
        if (item.summaryTx) {
          queueTxs.push(item.summaryTx);
        }
        if (item.newTx) {
          queueTxs.push(item.newTx);
        }
      });

      // 3. ट्रांजेक्शन का सुरक्षित विलय (Anti-Duplicate Map)
      const allTxs = [
        ...queueTxs,
        ...(Array.isArray(localProfile.transactions) ? localProfile.transactions : []),
        ...(Array.isArray(cloudData.transactions) ? cloudData.transactions : [])
      ];

      const txMap = new Map();
      allTxs.forEach((tx, idx) => {
        if (tx) {
          const key = (tx.isDailySummary && tx.dateKey)
            ? `summary_${tx.dateKey}`
            : (tx.id ? String(tx.id) : `${tx.date}_${tx.particulars}_${tx.amount}_${idx}`);
          if (!txMap.has(key)) txMap.set(key, tx);
        }
      });

      const finalTxs = Array.from(txMap.values());
      finalTxs.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));

      // 4. Firestore में 100% सही डेटा अपडेट करें
      await ref.update({
        balance: resolvedBalance,
        transactions: finalTxs.slice(0, 100),
        dailyLogs: mergedLogs
      });

      // 5. स्थानीय प्रोफ़ाइल व UI अपडेट करें
      if (userProfile) {
        userProfile.balance = resolvedBalance;
        userProfile.transactions = finalTxs.slice(0, 100);
        userProfile.dailyLogs = mergedLogs;
        localStorage.setItem(`bm_user_${cleanAcc}`, JSON.stringify(userProfile));
        renderProfileData();
      }

      // कतार खाली करें
      saveOfflineQueue([]);
      const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
      showToast(isHindi ? "🎉 ऑफ़लाइन साधना क्लाउड में 100% सुरक्षित सिंक हुई!" : "🎉 Offline sadhana safely synced to cloud!", 'success');
    }
  } catch (e) {
    console.error("Offline sync error:", e);
  } finally {
    isSyncingOffline = false;
  }
}