// ==========================================
// SADHANA CALENDAR & STREAK ENGINE MODULE
// Bilingual: English (Default) & Hindi Support
// 100% Timezone-Safe & Dynamic Month Engine
// ==========================================

const ENGLISH_MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

// किसी भी तारीख का सही जप संख्या निकालना (Logs + Storage + Fallback)
function getDayJapaCount(dateStr) {
  if (userProfile && userProfile.dailyLogs && userProfile.dailyLogs[dateStr] !== undefined) {
    return Number(userProfile.dailyLogs[dateStr]) || 0;
  }
  const lsVal = localStorage.getItem(cleanAcc ? `bm_today_${cleanAcc}_${dateStr}` : `bm_today_guest_${dateStr}`);
  if (lsVal) return parseInt(lsVal, 10) || 0;

  if (userProfile && Array.isArray(userProfile.transactions)) {
    let sum = 0;
    userProfile.transactions.forEach(tx => {
      if (tx && tx.type === 'CREDIT') {
        if (tx.dateKey === dateStr) {
          sum = Math.max(sum, Number(tx.amount || 0));
        } else if (tx.id) {
          const d = new Date(Number(tx.id));
          if (!isNaN(d.getTime())) {
            const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            if (k === dateStr) sum = Math.max(sum, Number(tx.amount || 0));
          }
        }
      }
    });
    if (sum > 0) return sum;
  }
  return 0;
}

// खाता खुलने / साधना प्रारंभ की सही तारीख
function getAccountCreationDate() {
  if (userProfile && userProfile.createdAt) {
    const d = new Date(userProfile.createdAt);
    if (!isNaN(d.getTime())) return d;
  }

  if (userProfile && Array.isArray(userProfile.transactions) && userProfile.transactions.length > 0) {
    let oldestTimestamp = Infinity;
    userProfile.transactions.forEach(tx => {
      if (tx && tx.id && !isNaN(Number(tx.id))) {
        oldestTimestamp = Math.min(oldestTimestamp, Number(tx.id));
      }
    });
    if (oldestTimestamp !== Infinity) {
      const foundDate = new Date(oldestTimestamp);
      if (userProfile) {
        userProfile.createdAt = foundDate.toISOString();
        if (cleanAcc) localStorage.setItem(`bm_user_${cleanAcc}`, JSON.stringify(userProfile));
      }
      return foundDate;
    }
  }

  if (userProfile && userProfile.dailyLogs) {
    const logKeys = Object.keys(userProfile.dailyLogs).sort();
    if (logKeys.length > 0) {
      const parts = logKeys[0].split('-');
      if (parts.length === 3) {
        const foundDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        if (!isNaN(foundDate.getTime())) {
          if (userProfile) {
            userProfile.createdAt = foundDate.toISOString();
            if (cleanAcc) localStorage.setItem(`bm_user_${cleanAcc}`, JSON.stringify(userProfile));
          }
          return foundDate;
        }
      }
    }
  }

  // अतिथि साधक (Guest Devotee): पहली बार ऐप खुलने की तारीख
  const guestFirstDate = localStorage.getItem('bm_app_first_install_date');
  if (guestFirstDate) {
    const parts = guestFirstDate.split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
  } else {
    const todayK = getTodayKey();
    localStorage.setItem('bm_app_first_install_date', todayK);
  }

  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// अखंड साधना लड़ी (Streak Engine)
function calculateSadhanaStreak() {
  if (!userProfile) return 0;
  const targetMalas = Number(userProfile.dailyTarget) || 16;
  const targetCount = targetMalas * 108;

  let streak = 0;
  let checkDate = new Date();
  checkDate.setHours(0, 0, 0, 0);
  
  const todayKey = getTodayKey();
  const todayJap = getDayJapaCount(todayKey);
  
  if (todayJap >= targetCount) {
    streak++;
  }
  checkDate.setDate(checkDate.getDate() - 1);

  const createdDate = getAccountCreationDate();
  createdDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    if (checkDate < createdDate) break;
    const k = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
    const cnt = getDayJapaCount(k);
    if (cnt >= targetCount) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

// महीना बदलना
function changeCalendarMonth(delta) {
  currentCalMonth += delta;
  if (currentCalMonth < 0) {
    currentCalMonth = 11;
    currentCalYear -= 1;
  } else if (currentCalMonth > 11) {
    currentCalMonth = 0;
    currentCalYear += 1;
  }
  renderSadhanaCalendar(currentCalYear, currentCalMonth);
}

// मुख्य कैलेंडर रेंडरर
function renderSadhanaCalendar(year, month) {
  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const monthNames = isHindi ? HINDI_MONTHS : ENGLISH_MONTHS;
  const unitDay = isHindi ? 'दिन' : 'Days';

  const grid = document.getElementById('calendarDaysGrid');
  const title = document.getElementById('calendarMonthTitle');
  if (!grid || !title) return;

  title.innerText = `${monthNames[month]} ${year}`;
  grid.innerHTML = '';

  // 1. सप्ताह के 7 दिनों का हेडर (रवि, सोम... vs Sun, Mon...)
  const weekdaysEl = document.querySelector('#passbookCalendarView .grid-cols-7.text-amber-400\\/80') || document.getElementById('calendarWeekdaysGrid');
  if (weekdaysEl) {
    const hindiDays = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];
    const engDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const daysList = isHindi ? hindiDays : engDays;
    weekdaysEl.innerHTML = `
      <span class="text-rose-400">${daysList[0]}</span>
      <span>${daysList[1]}</span>
      <span>${daysList[2]}</span>
      <span>${daysList[3]}</span>
      <span>${daysList[4]}</span>
      <span>${daysList[5]}</span>
      <span>${daysList[6]}</span>
    `;
  }

  const targetMalas = Number(userProfile?.dailyTarget) || 16;
  const targetCount = targetMalas * 108;

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = getTodayKey();

  const createdDate = getAccountCreationDate();
  createdDate.setHours(0, 0, 0, 0);

  let completedDaysCount = 0;
  let missedDaysCount = 0;

  // महीने के पहले खाली दिन
  for (let p = 0; p < firstDayIndex; p++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = "py-2 text-amber-900/30 text-center";
    emptyCell.innerHTML = "&nbsp;";
    grid.appendChild(emptyCell);
  }

  // महीने की सभी तारीखें रेंडर करना
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const thisDate = new Date(year, month, d);
    thisDate.setHours(0, 0, 0, 0);
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const count = getDayJapaCount(dateKey);

    let status = 'REMAINING';
    let cellStyle = "bg-amber-950/40 border-amber-800/30 text-amber-200/70";
    let dotHtml = `<span class="w-1.5 h-1.5 rounded-full bg-amber-800/40 mx-auto block mt-0.5"></span>`;

    if (thisDate > today) {
      status = 'FUTURE';
      cellStyle = "bg-transparent border-transparent text-amber-900/40";
      dotHtml = `<span class="w-1.5 h-1.5 mx-auto block mt-0.5"></span>`;
    } else if (count >= targetCount) {
      status = 'COMPLETED';
      completedDaysCount++;
      cellStyle = "bg-emerald-950/80 border-emerald-500/70 text-emerald-300 font-bold shadow-sm";
      dotHtml = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mx-auto block mt-0.5 shadow-sm"></span>`;
    } else if (count > 0) {
      status = 'PARTIAL';
      cellStyle = "bg-amber-950/80 border-amber-500/60 text-amber-300 font-bold";
      dotHtml = `<span class="w-1.5 h-1.5 rounded-full bg-amber-400 mx-auto block mt-0.5"></span>`;
    } else if (thisDate < createdDate) {
      status = 'PRE_ACCOUNT';
      cellStyle = "bg-amber-950/20 border-amber-900/30 text-amber-700/60";
      dotHtml = `<span class="w-1.5 h-1.5 rounded-full bg-amber-900/30 mx-auto block mt-0.5"></span>`;
    } else {
      if (thisDate < today) {
        status = 'MISSED';
        missedDaysCount++;
        cellStyle = "bg-rose-950/70 border-rose-500/60 text-rose-300";
        dotHtml = `<span class="w-1.5 h-1.5 rounded-full bg-rose-500 mx-auto block mt-0.5"></span>`;
      } else {
        status = 'TODAY_PROGRESS';
        cellStyle = "bg-amber-950 border-amber-400 text-amber-200 animate-pulse";
        dotHtml = `<span class="w-1.5 h-1.5 rounded-full bg-cyan-400 mx-auto block mt-0.5"></span>`;
      }
    }

    const isToday = (dateKey === todayKey);
    const dayBtn = document.createElement('button');
    dayBtn.type = "button";
    dayBtn.className = `p-1.5 rounded-xl border flex flex-col items-center justify-center transition active:scale-95 ${cellStyle} ${isToday ? 'ring-2 ring-amber-400' : ''}`;
    dayBtn.innerHTML = `
      <span class="text-xs leading-none">${d}</span>
      ${dotHtml}
    `;
    dayBtn.onclick = () => showCalendarDayDetail(dateKey, count, status, d);
    grid.appendChild(dayBtn);
  }

  // शीर्ष आँकड़े
  const currentStreak = calculateSadhanaStreak();
  safeSet('calCurrentStreak', `${currentStreak} ${unitDay}`);
  safeSet('calCompletedDays', `${completedDaysCount} ${unitDay}`);
  safeSet('calMissedDays', `${missedDaysCount} ${unitDay}`);

  // 🎯 स्मार्ट डिटेल कार्ड लॉजिक (महीना बदलने पर सही तारीख दिखाना)
  const isViewingCurrentMonth = (year === today.getFullYear() && month === today.getMonth());
  if (isViewingCurrentMonth) {
    const todayCount = getDayJapaCount(todayKey);
    const todayStatus = (todayCount >= targetCount ? 'COMPLETED' : (todayCount > 0 ? 'PARTIAL' : 'TODAY_PROGRESS'));
    showCalendarDayDetail(todayKey, todayCount, todayStatus, today.getDate());
  } else {
    // अगर कोई पुराना/आगामी महीना देख रहे हैं, तो उस महीने की 1 तारीख का विवरण दिखाएँ
    const firstDayKey = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const firstDayCount = getDayJapaCount(firstDayKey);
    const firstDateObj = new Date(year, month, 1);
    firstDateObj.setHours(0, 0, 0, 0);

    let firstDayStatus = 'REMAINING';
    if (firstDateObj > today) firstDayStatus = 'FUTURE';
    else if (firstDayCount >= targetCount) firstDayStatus = 'COMPLETED';
    else if (firstDayCount > 0) firstDayStatus = 'PARTIAL';
    else if (firstDateObj < createdDate) firstDayStatus = 'PRE_ACCOUNT';
    else firstDayStatus = 'MISSED';

    showCalendarDayDetail(firstDayKey, firstDayCount, firstDayStatus, 1);
  }
}

// 🎯 टाइमज़ोन-सुरक्षित तारीख विवरण कार्ड (Timezone-Safe Display)
function showCalendarDayDetail(dateKey, count, status, dayNum) {
  const detailCard = document.getElementById('calendarDayDetailCard');
  if (!detailCard) return;

  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const monthNames = isHindi ? HINDI_MONTHS : ENGLISH_MONTHS;
  const numLocale = isHindi ? 'hi-IN' : 'en-IN';

  // शुद्ध स्थानीय कंपोनेंट्स से तारीख बनाना (बिना UTC टाइमज़ोन शिफ्ट के)
  const parts = dateKey.split('-');
  let dateFormatted = dateKey;
  if (parts.length === 3) {
    const dDay = parseInt(parts[2], 10);
    const dMonthIndex = parseInt(parts[1], 10) - 1;
    const dYear = parseInt(parts[0], 10);
    dateFormatted = `${dDay} ${monthNames[dMonthIndex]} ${dYear}`;
  }
  safeSet('calDetailDate', `📅 ${dateFormatted}`);

  const malas = Math.floor(count / 108);
  const badge = document.getElementById('calDetailBadge');
  const note = document.getElementById('calDetailNote');

  if (isHindi) {
    safeSet('calDetailCount', `${count.toLocaleString(numLocale)} नाम (${malas} माला)`);
  } else {
    safeSet('calDetailCount', `${count.toLocaleString(numLocale)} Naams (${malas} Mala)`);
  }

  if (status === 'COMPLETED') {
    badge.className = "text-[9px] px-2 py-0.2 rounded-full font-bold bg-emerald-950 border border-emerald-500 text-emerald-300";
    badge.innerText = isHindi ? "✓ नियम पूर्ण" : "✓ Goal Complete";
    note.innerText = isHindi ? "अद्भुत निष्ठा! आपने अपने संकल्पित नियम के अनुसार पूर्ण जप किया।" : "Exemplary devotion! Completed full chanting as per your daily rule.";
  } else if (status === 'PARTIAL') {
    badge.className = "text-[9px] px-2 py-0.2 rounded-full font-bold bg-amber-950 border border-amber-500 text-amber-300";
    badge.innerText = isHindi ? "आंशिक जप" : "Partial Japa";
    note.innerText = isHindi ? "इस दिन जप हुआ किंतु दैनिक संकल्प लक्ष्य से कम रहा।" : "Chanting recorded, but below daily target goal.";
  } else if (status === 'MISSED') {
    badge.className = "text-[9px] px-2 py-0.2 rounded-full font-bold bg-rose-950 border border-rose-500 text-rose-300";
    badge.innerText = isHindi ? "🔴 नागा (छूटा)" : "🔴 Missed Day";
    note.innerText = isHindi ? "इस दिन कोई जप दर्ज नहीं हुआ। नित्य नियम में नागा से बचें।" : "No chanting recorded on this day. Maintain unbroken daily discipline.";
  } else if (status === 'TODAY_PROGRESS') {
    badge.className = "text-[9px] px-2 py-0.2 rounded-full font-bold bg-cyan-950 border border-cyan-500 text-cyan-300";
    badge.innerText = isHindi ? "आज जारी है" : "In Progress";
    note.innerText = isHindi ? "आज की साधना प्रगति पर है। आज का लक्ष्य पूर्ण करें।" : "Today's sadhana in progress. Complete your daily goal.";
  } else if (status === 'FUTURE') {
    badge.className = "text-[9px] px-2 py-0.2 rounded-full font-bold bg-slate-900 border border-slate-700 text-slate-400";
    badge.innerText = isHindi ? "आगामी दिवस" : "Upcoming Day";
    note.innerText = isHindi ? "आगामी दिवस के लिए अखंड जप का शुभ संकल्प लें।" : "Make a resolve for unbroken chanting for the upcoming day.";
  } else {
    badge.className = "text-[9px] px-2 py-0.2 rounded-full font-bold bg-amber-950/60 border border-amber-700 text-amber-400";
    badge.innerText = isHindi ? "खाता पूर्व" : "Pre-Account";
    note.innerText = isHindi ? "यह तारीख आपके भजन मार्ग खाता खोलने से पूर्व की है।" : "This date is prior to opening your Bhajan Marg account.";
  }
}

// डायरी (Ledger) और पंचांग (Calendar) दृश्य बदलना
function switchPassbookView(view) {
  activePassbookView = view;
  const ledgerView = document.getElementById('passbookLedgerView');
  const calView = document.getElementById('passbookCalendarView');
  const btnLedger = document.getElementById('btnPassbookLedger');
  const btnCal = document.getElementById('btnPassbookCalendar');

  if (view === 'calendar') {
    if (ledgerView) ledgerView.classList.add('hidden');
    if (calView) calView.classList.remove('hidden');
    if (btnCal) btnCal.className = "py-2 px-1 rounded-xl font-semibold text-center bg-amber-500/20 text-amber-200 border border-amber-500/40 transition";
    if (btnLedger) btnLedger.className = "py-2 px-1 rounded-xl text-amber-300/80 hover:bg-amber-900/30 text-center transition";
    renderSadhanaCalendar(currentCalYear, currentCalMonth);
  } else {
    if (calView) calView.classList.add('hidden');
    if (ledgerView) ledgerView.classList.remove('hidden');
    if (btnLedger) btnLedger.className = "py-2 px-1 rounded-xl font-semibold text-center bg-amber-500/20 text-amber-200 border border-amber-500/40 transition";
    if (btnCal) btnCal.className = "py-2 px-1 rounded-xl text-amber-300/80 hover:bg-amber-900/30 text-center transition";
    if (typeof renderPassbookLedger === 'function') renderPassbookLedger();
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
}