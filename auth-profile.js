// ==========================================
// AUTHENTICATION & PROFILE CONTROLLER MODULE
// Bilingual: English (Default) & Hindi Support
// Collision-Proof Account Engine + Zero-Loss Guest Migration
// ==========================================
let signupBlessingCount = 0;
let pendingSignupData = null;

function openAuthModal(mode = 'login') {
  const el = document.getElementById('authModal');
  if (el) el.classList.remove('hidden');
  setAuthMode(mode);
}

function closeAuthModal() {
  const el = document.getElementById('authModal');
  if (el) el.classList.add('hidden');
}

function setAuthMode(mode) {
  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const loginForm = document.getElementById('loginForm');
  const signupContainer = document.getElementById('signupFlowContainer');
  const tabLogin = document.getElementById('btnAuthTabLogin');
  const tabSignup = document.getElementById('btnAuthTabSignup');
  const title = document.getElementById('authModalTitle');

  if (mode === 'login') {
    if (loginForm) loginForm.classList.remove('hidden');
    if (signupContainer) signupContainer.classList.add('hidden');
    if (tabLogin) tabLogin.className = "py-1.5 rounded-lg font-bold gold-foil text-amber-950";
    if (tabSignup) tabSignup.className = "py-1.5 rounded-lg font-semibold text-amber-300/80";
    if (title) title.innerText = isHindi ? "साधक नेट बैंकिंग लॉगिन" : "Devotee Net Banking Login";
  } else {
    if (loginForm) loginForm.classList.add('hidden');
    if (signupContainer) signupContainer.classList.remove('hidden');
    if (tabSignup) tabSignup.className = "py-1.5 rounded-lg font-bold gold-foil text-amber-950";
    if (tabLogin) tabLogin.className = "py-1.5 rounded-lg font-semibold text-amber-300/80";
    if (title) title.innerText = isHindi ? "नया साधक खाता खोलें" : "Open New Devotee Account";
    resetSignupSteps();
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function toggleSignupCustomMantra(val) {
  const box = document.getElementById('signupCustomMantraContainer');
  const input = document.getElementById('signupCustomMantraInput');
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

function resetSignupSteps() {
  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const s1 = document.getElementById('signupStep1'); if (s1) s1.classList.remove('hidden');
  const s2 = document.getElementById('signupStep2'); if (s2) s2.classList.add('hidden');
  const s3 = document.getElementById('signupStep3'); if (s3) s3.classList.add('hidden');
  signupBlessingCount = 0;
  safeSet('signupBlessingCountDisplay', '0');
  const nextBtn = document.getElementById('step2NextBtn');
  if (nextBtn) {
    nextBtn.disabled = true;
    nextBtn.className = "w-full py-2.5 bg-amber-950/90 border border-amber-600/40 text-amber-400 font-bold rounded-xl text-xs transition disabled:opacity-40";
  }
  const prompt = document.getElementById('signupBlessingPrompt');
  if (prompt) {
    prompt.innerText = isHindi ? "मणके को 11 बार टैप करके संकल्प पूर्ण करें..." : "Tap bead 11 times to complete sankalp...";
    prompt.className = "text-[11px] text-amber-300 font-semibold";
  }
}

function goToSignupStep2() {
  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const name = document.getElementById('signupNameInput').value.trim();
  const gender = document.getElementById('signupGenderSelect').value;
  const target = document.getElementById('signupTargetSelect').value;
  let isht = document.getElementById('signupIshtSelect').value;
  const phone = document.getElementById('signupPhoneInput').value.trim();
  const pin = document.getElementById('signupPinInput').value.trim();

  if (isht === 'CUSTOM') {
    isht = document.getElementById('signupCustomMantraInput').value.trim();
  }

  if (!name) { 
    alert(isHindi ? "कृपया साधक का शुभ नाम दर्ज करें!" : "Please enter devotee name!"); 
    return; 
  }
  if (!isht) { 
    alert(isHindi ? "कृपया आराध्य देव / इष्ट महामंत्र चुनें या दर्ज करें!" : "Please select or enter Isht Mahamantra!"); 
    return; 
  }

  // 🎯 अंतरराष्ट्रीय और भारतीय दोनों नंबरों के लिए सुरक्षित सत्यापन (7 से 15 अंक)
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.length < 7 || cleanPhone.length > 15) { 
    alert(isHindi 
      ? "कृपया एक वैध मोबाइल नंबर दर्ज करें (7 से 15 अंक)!" 
      : "Please enter a valid mobile number (7 to 15 digits)!"); 
    return; 
  }

  if (pin.length !== 4 || !/^\d{4}$/.test(pin)) { 
    alert(isHindi ? "कृपया 4 अंकों का सुरक्षा MPIN दर्ज करें!" : "Please enter a 4-digit security MPIN!"); 
    return; 
  }

  pendingSignupData = { name, gender, target, isht, phone: cleanPhone, pin };

  document.getElementById('signupStep1').classList.add('hidden');
  document.getElementById('signupStep2').classList.remove('hidden');
  if (typeof playChime === 'function') playChime(880, 0.3);
}

function handleSignupBlessingTap() {
  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  if (signupBlessingCount < 11) {
    signupBlessingCount++;
    safeSet('signupBlessingCountDisplay', signupBlessingCount);
    if (typeof playChime === 'function') playChime(700 + (signupBlessingCount * 30), 0.22);
    if (typeof triggerVibrate === 'function') triggerVibrate(40);

    if (signupBlessingCount >= 11) {
      const prompt = document.getElementById('signupBlessingPrompt');
      if (prompt) {
        prompt.innerText = isHindi ? "🎉 11 नाम आहुति संकल्प पूर्ण हुआ! दिव्य कृपा प्राप्त हुई।" : "🎉 11 Invocations Sankalp Completed! Divine Grace Received.";
        prompt.className = "text-[11px] text-emerald-400 font-bold";
      }
      
      const nextBtn = document.getElementById('step2NextBtn');
      if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.className = "w-full py-2.5 gold-foil text-amber-950 font-bold rounded-xl text-xs shadow-lg active:scale-95 transition";
      }
      if (typeof playMalaGong === 'function') playMalaGong();
    }
  }
}

function goToSignupStep3() {
  document.getElementById('signupStep2').classList.add('hidden');
  document.getElementById('signupStep3').classList.remove('hidden');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function triggerRazorpaySignupPayment() {
  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const options = {
    key: "rzp_live_ToslYZPjPkLS8d",
    amount: 500,
    currency: "INR",
    name: isHindi ? "भजन मार्ग बैंक" : "Bhajan Marg Bank",
    description: isHindi ? "वार्षिक आध्यात्मिक खाता सर्वर सेवा सहयोग" : "Annual Spiritual Account Server Support",
    image: "logo.png",
    handler: function (response) {
      activateAccountDirectlyFromApp(true, response.razorpay_payment_id);
    },
    prefill: {
      name: pendingSignupData ? pendingSignupData.name : (isHindi ? "साधक" : "Devotee"),
      contact: pendingSignupData ? pendingSignupData.phone : ""
    },
    theme: { color: "#d4a337" }
  };

  try {
    const rzp = new Razorpay(options);
    rzp.on('payment.failed', function (response){
      alert("Payment failed: " + response.error.description);
    });
    rzp.open();
  } catch (err) {
    activateAccountDirectlyFromApp(false);
  }
}

// 🎯 टकराव-मुक्त 6-अंकीय खाता नंबर जनरेटर (Anti-Collision Engine)
async function generateUniqueAccountNumber() {
  let isUnique = false;
  let attempts = 0;
  let accNum = "";
  let clean = "";

  while (!isUnique && attempts < 10) {
    attempts++;
    const rand6 = Math.floor(100000 + Math.random() * 900000);
    accNum = `108-${rand6}`;
    clean = accNum.replace(/[-\s]/g, '');

    if (localStorage.getItem(`bm_user_${clean}`)) {
      continue;
    }

    if (isFirebaseReady && navigator.onLine && db) {
      try {
        const docSnap = await db.collection("bm_sadhak_accounts").doc(clean).get();
        if (!docSnap.exists) {
          isUnique = true;
        }
      } catch (err) {
        isUnique = true;
      }
    } else {
      isUnique = true;
    }
  }

  if (!accNum) {
    const fallbackRand = Date.now().toString().slice(-6);
    accNum = `108-${fallbackRand}`;
    clean = accNum.replace(/[-\s]/g, '');
  }

  return { accNum, clean };
}

// 🎯 खाता सक्रियण एवं अखंड अतिथि जप हस्तांतरण (Bug 5 Fix)
async function activateAccountDirectlyFromApp(isPaid = false, paymentId = "") {
  if (!pendingSignupData) return;

  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const numLocale = isHindi ? 'hi-IN' : 'en-IN';
  const todayK = getTodayKey();
  
  const { accNum: randomAccNum, clean } = await generateUniqueAccountNumber();

  // 1. पूर्व अतिथि साधना संचित पूंजी निकालना
  const guestBalance = parseInt(localStorage.getItem('bm_guest_balance'), 10) || 0;
  const totalOpeningBalance = guestBalance + 11; // अतिथि जप + 11 आहुति बोनस

  // 2. अतिथि के पुराने तारीखवार रिकॉर्ड्स (dailyLogs) एकत्र करना
  const initialDailyLogs = {};
  const guestKeysToDelete = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('bm_today_guest_')) {
        const datePart = k.replace('bm_today_guest_', '');
        const cnt = parseInt(localStorage.getItem(k), 10) || 0;
        if (cnt > 0) {
          initialDailyLogs[datePart] = cnt;
        }
        guestKeysToDelete.push(k);
      }
    }
  } catch (e) {}

  // आज के दैनिक लॉग में आज का रिकॉर्ड + 11 आहुति बोनस जोड़ें
  initialDailyLogs[todayK] = (Number(initialDailyLogs[todayK]) || 0) + 11;

  // 3. लेजर पासबुक प्रविष्टियाँ तैयार करना
  const initialTxs = [];

  // 11 प्रारंभिक नाम आहुति बोनस ट्रांजेक्शन
  initialTxs.push({
    id: Date.now() + 1,
    dateKey: todayK,
    date: new Date().toLocaleString(numLocale, { dateStyle: 'short', timeStyle: 'short' }),
    particulars: isHindi ? "श्री गणेश 11 प्रारंभिक नाम आहुति संकल्प" : "Initial 11 Chants Invocations Bonus",
    type: "CREDIT",
    amount: 11,
    balanceAfter: totalOpeningBalance
  });

  // यदि साधक ने अतिथि के रूप में पहले जप किया था, तो उसकी स्पष्ट क्रेडिट प्रविष्टि
  if (guestBalance > 0) {
    initialTxs.push({
      id: Date.now(),
      dateKey: todayK,
      date: new Date().toLocaleString(numLocale, { dateStyle: 'short', timeStyle: 'short' }),
      particulars: isHindi ? "अतिथि साधना संचित पूंजी हस्तांतरण" : "Guest Devotee Accumulated Sadhana Transfer",
      type: "CREDIT",
      amount: guestBalance,
      balanceAfter: guestBalance
    });
  }

  // अतिथि के रूप में अपलोड की गई प्रोफ़ाइल फ़ोटो ट्रांसफर करें
  const guestPhoto = localStorage.getItem('bm_guest_photo') || null;

  const newAccountObj = {
    accNo: randomAccNum,
    name: pendingSignupData.name,
    gender: pendingSignupData.gender,
    dailyTarget: pendingSignupData.target,
    isht: pendingSignupData.isht,
    phone: pendingSignupData.phone,
    pin: pendingSignupData.pin,
    balance: totalOpeningBalance, // 🎯 शुद्ध संचित योग सुरक्षित
    totalDedicated: 0,
    fdGoal: 100000,
    activeGoal: {
      title: isHindi ? "1 लाख नाम महा-संकल्प" : "1 Lakh Divine Names Sankalp",
      mantra: "ALL",
      targetCount: 100000,
      unit: "JAPS"
    },
    kripaLoan: {
      isActive: false,
      amount: 0,
      repaid: 0,
      purpose: ""
    },
    country: "भारत (India)",
    state: "उत्तर प्रदेश (Uttar Pradesh)",
    city: "वृन्दावन (Vrindavan)",
    isVerified: true,
    photo: guestPhoto,
    paymentId: paymentId || (isPaid ? "RZP-PAID" : "SEVA-DONATION"),
    transactions: initialTxs,
    dailyLogs: initialDailyLogs,
    createdAt: new Date().toISOString()
  };

  localStorage.setItem(`bm_user_${clean}`, JSON.stringify(newAccountObj));
  localStorage.setItem(`bm_user_${randomAccNum}`, JSON.stringify(newAccountObj));
  localStorage.setItem(`bm_login_${clean}`, 'true');
  localStorage.setItem(`bm_login_${randomAccNum}`, 'true');
  localStorage.setItem('bm_active_acc', randomAccNum);

  // 🎯 पुराने अतिथि डेटा की सुरक्षित सफ़ाई
  localStorage.removeItem('bm_guest_balance');
  localStorage.removeItem('bm_guest_photo');
  guestKeysToDelete.forEach(k => localStorage.removeItem(k));
  // नए खाते के लिए आज की key सेट करें
  localStorage.setItem(`bm_today_${clean}_${todayK}`, String(initialDailyLogs[todayK]));

  activeAcc = randomAccNum;
  cleanAcc = clean;
  userProfile = newAccountObj;

  if (isFirebaseReady && navigator.onLine) {
    try {
      await db.collection("bm_sadhak_accounts").doc(clean).set(newAccountObj);
    } catch (err) {}
  }

  closeAuthModal();
  renderProfileData();
  updateAllAvatarImages();
  if (typeof playMalaGong === 'function') playMalaGong();

  const guestMsgHi = guestBalance > 0 ? `\n\n(आपकी अतिथि साधना के ${guestBalance.toLocaleString('hi-IN')} नाम + 11 बोनस जप खाते में सुरक्षित जोड़ दिए गए हैं!)` : '';
  const guestMsgEn = guestBalance > 0 ? `\n\n(${guestBalance.toLocaleString('en-IN')} Japa from guest sadhana + 11 bonus japa safely migrated!)` : '';

  if (isHindi) {
    alert(`🎉 बधाई हो! आपका दिव्य भजन मार्ग खाता सक्रिय हो गया है:\n\nखाता संख्या: ${randomAccNum}\nसुरक्षा MPIN: ${pendingSignupData.pin}\nदैनिक लक्ष्य: ${pendingSignupData.target} माला${guestMsgHi}\n\nइसे कहीं लिख कर सुरक्षित रख लें!`);
  } else {
    alert(`🎉 Congratulations! Your Divine Bhajan Marg Account is now active:\n\nAccount Number: ${randomAccNum}\nSecurity MPIN: ${pendingSignupData.pin}\nDaily Target: ${pendingSignupData.target} Mala${guestMsgEn}\n\nPlease save these credentials safely!`);
  }

  showToast(`${isHindi ? 'खाता संख्या:' : 'Account:'} ${randomAccNum}`, 'success');
}

async function handleUserLogin(e) {
  e.preventDefault();
  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const rawAcc = document.getElementById('loginAccInput').value.trim();
  const pin = document.getElementById('loginPinInput').value.trim();
  const clean = rawAcc.replace(/[-\s]/g, '');

  const btn = document.getElementById('loginSubmitBtn');
  btn.disabled = true;
  btn.innerText = isHindi ? "सत्यापन जारी..." : "Verifying...";

  let foundProfile = JSON.parse(localStorage.getItem(`bm_user_${clean}`)) || null;

  if (!foundProfile && isFirebaseReady && navigator.onLine) {
    try {
      const doc = await db.collection("bm_sadhak_accounts").doc(clean).get();
      if (doc.exists) {
        foundProfile = doc.data();
      }
    } catch (err) {}
  }

  if (foundProfile && String(foundProfile.pin) === pin) {
    activeAcc = foundProfile.accNo || rawAcc;
    cleanAcc = clean;
    userProfile = foundProfile;
    localStorage.setItem('bm_active_acc', activeAcc);
    localStorage.setItem(`bm_user_${cleanAcc}`, JSON.stringify(userProfile));
    localStorage.setItem(`bm_login_${cleanAcc}`, 'true');

    closeAuthModal();
    renderProfileData();
    updateAllAvatarImages();
    showToast(isHindi ? `स्वागतम्, ${userProfile.name}!` : `Welcome, ${userProfile.name}!`, 'success');
    if (typeof playChime === 'function') playChime(1040, 0.4);
    if (typeof fetchFreshDashboardData === 'function') fetchFreshDashboardData();
  } else {
    alert(isHindi ? "खाता संख्या या MPIN अमान्य है!" : "Invalid Account Number or MPIN!");
  }

  btn.disabled = false;
  btn.innerText = isHindi ? "प्रवेश करें (Login) ➔" : "Enter (Login) ➔";
}

function logoutUser() {
  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  if (confirm(isHindi ? "क्या आप इस खाते से लॉगआउट करना चाहते हैं?" : "Are you sure you want to logout from this account?")) {
    if (typeof flushPendingSyncToCloud === 'function') flushPendingSyncToCloud();
    if (cleanAcc) localStorage.removeItem(`bm_login_${cleanAcc}`);
    localStorage.removeItem('bm_active_acc');
    activeAcc = null;
    cleanAcc = null;
    userProfile = null;
    renderProfileData();
    updateAllAvatarImages();
    showToast(isHindi ? "लॉगआउट सम्पन्न हुआ" : "Logged out successfully", "info");
  }
}

function openProfileScreen() {
  updateAllAvatarImages();
  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');

  if (!userProfile) return;
  safeSet('profHeadName', userProfile.name || (isHindi ? 'साधक' : 'Devotee'));
  
  const accPrefix = isHindi ? 'खाता:' : 'A/C:';
  safeSet('profHeadAcc', `${accPrefix} ${userProfile.accNo || cleanAcc}`);
  safeSet('profAccNo', userProfile.accNo || cleanAcc);
  safeSet('profPin', userProfile.pin || '••••');

  const editName = document.getElementById('editNameInput');
  if (editName) editName.value = userProfile.name || '';
  
  const editIshtSel = document.getElementById('editIshtSelect');
  if (editIshtSel && userProfile.isht) {
    let exists = false;
    for (let i = 0; i < editIshtSel.options.length; i++) {
      if (editIshtSel.options[i].value === userProfile.isht) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      const opt = document.createElement('option');
      opt.value = userProfile.isht;
      opt.textContent = `${userProfile.isht} (${isHindi ? 'कस्टम इष्ट' : 'Custom'})`;
      editIshtSel.insertBefore(opt, editIshtSel.firstChild);
    }
    editIshtSel.value = userProfile.isht;
  }

  const editPhone = document.getElementById('editPhoneInput');
  if (editPhone) editPhone.value = userProfile.phone || userProfile.mobile || '';

  initLocationDropdowns(
    userProfile.country || "भारत (India)", 
    userProfile.state || "उत्तर प्रदेश (Uttar Pradesh)", 
    userProfile.city || "वृन्दावन (Vrindavan)"
  );
}

function initLocationDropdowns(selectedCountry, selectedState, selectedCity) {
  const countrySel = document.getElementById('editCountrySelect');
  if (!countrySel) return;
  countrySel.innerHTML = '';
  
  if (typeof LOCATION_DATA !== 'undefined') {
    Object.keys(LOCATION_DATA).forEach(c => {
      const opt = document.createElement('option');
      opt.value = c; opt.textContent = c;
      countrySel.appendChild(opt);
    });
  }
  countrySel.value = selectedCountry || "भारत (India)";
  populateStates(countrySel.value, selectedState, selectedCity);
}

function onCountryChange() {
  populateStates(document.getElementById('editCountrySelect').value, null, null);
}

function populateStates(country, prefState, prefCity) {
  const stateSel = document.getElementById('editStateSelect');
  if (!stateSel) return;
  stateSel.innerHTML = '';
  const states = (typeof LOCATION_DATA !== 'undefined' && LOCATION_DATA[country]) ? Object.keys(LOCATION_DATA[country]) : ["अन्य / Other"];
  states.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s; opt.textContent = s;
    stateSel.appendChild(opt);
  });
  stateSel.value = prefState && states.includes(prefState) ? prefState : states[0];
  populateCities(country, stateSel.value, prefCity);
}

function onStateChange() {
  populateCities(document.getElementById('editCountrySelect').value, document.getElementById('editStateSelect').value, null);
}

function populateCities(country, state, prefCity) {
  const citySel = document.getElementById('editCitySelect');
  if (!citySel) return;
  citySel.innerHTML = '';
  const cities = (typeof LOCATION_DATA !== 'undefined' && LOCATION_DATA[country] && LOCATION_DATA[country][state]) 
    ? LOCATION_DATA[country][state] 
    : ["अन्य (Other)"];
  cities.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    citySel.appendChild(opt);
  });
  citySel.value = prefCity && cities.includes(prefCity) ? prefCity : cities[0];
  onCityChange();
}

function onCityChange() {
  const val = document.getElementById('editCitySelect').value;
  const custom = document.getElementById('customCityContainer');
  if (custom) {
    if (val.includes("अन्य") || val.includes("Other")) custom.classList.remove('hidden');
    else custom.classList.add('hidden');
  }
}

async function saveProfileChanges(e) {
  e.preventDefault();
  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  if (!userProfile) { 
    showToast(isHindi ? "कृपया पहले लॉगिन करें!" : "Please login first!", "warn"); 
    return; 
  }
  
  userProfile.name = document.getElementById('editNameInput').value.trim() || userProfile.name;
  userProfile.isht = document.getElementById('editIshtSelect').value || userProfile.isht;
  userProfile.phone = document.getElementById('editPhoneInput').value.trim();
  userProfile.country = document.getElementById('editCountrySelect').value;
  userProfile.state = document.getElementById('editStateSelect').value;
  
  let city = document.getElementById('editCitySelect').value;
  if (city.includes("अन्य") || city.includes("Other")) {
    city = document.getElementById('editCustomCityInput').value.trim() || city;
  }
  userProfile.city = city;

  localStorage.setItem(`bm_user_${cleanAcc}`, JSON.stringify(userProfile));

  if (isFirebaseReady && navigator.onLine) {
    try {
      await db.collection("bm_sadhak_accounts").doc(cleanAcc).update({
        name: userProfile.name, isht: userProfile.isht, phone: userProfile.phone,
        country: userProfile.country, state: userProfile.state, city: userProfile.city
      });
    } catch (err) {}
  }
  renderProfileData();
  updateAllAvatarImages();
  showToast(isHindi ? "✓ विवरण सुरक्षित हुआ!" : "✓ Profile Details Saved!", "success");
}

// 📷 LIGHTWEIGHT PROFILE PHOTO COMPRESSION (15-20 KB)
function triggerPhotoSelect() {
  const input = document.getElementById('userPhotoInput');
  if (input) input.click();
}

function handleProfilePhotoUpload(event) {
  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert(isHindi ? "कृपया केवल फ़ोटो (JPG/PNG) चुनें!" : "Please select an image file (JPG/PNG)!");
    return;
  }

  showToast(isHindi ? "फ़ोटो कंप्रेस हो रही है..." : "Compressing photo...", "info");

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const size = 128;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      const minDim = Math.min(img.width, img.height);
      const startX = (img.width - minDim) / 2;
      const startY = (img.height - minDim) / 2;

      ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, size, size);

      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);

      if (!userProfile) userProfile = {};
      userProfile.photo = compressedBase64;

      if (cleanAcc) {
        localStorage.setItem(`bm_user_${cleanAcc}`, JSON.stringify(userProfile));
        if (isFirebaseReady && navigator.onLine) {
          db.collection("bm_sadhak_accounts").doc(cleanAcc).update({
            photo: compressedBase64
          }).catch(() => {});
        }
      } else {
        localStorage.setItem('bm_guest_photo', compressedBase64);
      }

      updateAllAvatarImages();
      showToast(isHindi ? "✓ प्रोफ़ाइल फ़ोटो सेट हुई!" : "✓ Profile Photo Set Successfully!", "success");
      if (typeof playChime === 'function') playChime(1040, 0.3);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function updateAllAvatarImages() {
  const defaultLogo = "logo.png";
  const userPhoto = (userProfile && userProfile.photo) || localStorage.getItem('bm_guest_photo') || defaultLogo;

  const profImg = document.getElementById('profileScreenAvatarImg');
  if (profImg) profImg.src = userPhoto;

  const sideImg = document.getElementById('sidebarAvatarImg');
  if (sideImg) sideImg.src = userPhoto;
}