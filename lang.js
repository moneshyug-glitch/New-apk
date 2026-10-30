// ========================================================
// 🌐 MULTI-LANGUAGE TRANSLATION ENGINE (lang.js)
// Default Language: English (EN) | Switchable to Hindi (HI)
// Devotional & Simple Spiritual Terminology (No Cold Banking Terms)
// ========================================================

var currentLang = localStorage.getItem('bm_lang') || 'en';

const TRANSLATIONS = {
  en: {
    // Top Header
    app_title: "Bhajan Marg Bank",
    guest_sadhak: "Guest Devotee",
    status_online: "🟢 Online",
    status_offline: "🔴 Offline",
    voice_ai_title: "Japa with AI Voice",
    menu_settings_title: "Open Menu & Settings",

    // Screen 1: Mala Counter
    ac_label: "A/C:",
    ac_default: "108-XXXX",
    default_isht: "Shri Radha Naam",
    today_japa_title: "🌅 TODAY'S JAPA",
    unit_mala: "Mala",
    unit_malas: "Malas",
    today_added_sub: "Deposited today",
    total_balance_title: "🏛️ TOTAL JAPA",
    total_balance_sub: "Accumulated holy Japa",
    tap_here: "JAPA HERE (TAP)",
    mala_progress: "Mala Progress:",
    session_summary_prefix: "Current Session:",
    session_summary_suffix: "Mala completed",
    deposit_btn: "Deposit to Bank",
    reset_btn: "Reset",
    cibil_mini_title: "Bhakti Meter Score:",
    cibil_mini_sub: "Spiritual discipline rating",
    btn_check: "Check ➔",

    // Screen 2: My Sadhana (Account Screen)
    card_title: "Bhakti Patra",
    card_tier: "GOLD TIER",
    card_ac_no: "ACCOUNT NUMBER (A/C No)",
    card_holder: "Devotee Name",
    card_isht: "Ishtadev",
    savings_ac_title: "Saved Japa",
    savings_ac_sub: "Offered at Ishtadev's Lotus Feet",
    dedicated_wealth_title: "Dedicated Japa",
    dedicated_wealth_sub: "For Ancestors / Cow Seva",

    // Daily Niyam (Earlier RD Account)
    rd_title: "Daily Niyam",
    rd_due_prefix: "Today's Goal:",
    rd_status_due: "⏳ Goal Incomplete",
    rd_status_paid: "✓ Goal Complete",
    rd_progress_prefix: "Completed today:",
    rd_boost_hint: "Daily Niyam = Bhakti Meter Boost 🚀",

    // Maha-Sankalp (Earlier FD Account)
    fd_title: "Maha-Sankalp",
    fd_bonus_badge: "+25% Divine Fruit",
    fd_default_goal: "1 Lakh Divine Names Sankalp",
    fd_target_prefix: "Target:",
    fd_all_naams: "All Names",
    fd_remaining_prefix: "Remaining:",
    fd_change_btn: "New Sankalp / Change ✎",

    // Sankatmochan Kripa Sahayata (Earlier Loan Account)
    loan_title: "Sankatmochan Kripa Sahayata",
    loan_sub: "Emergency divine advance grace for adversity",
    loan_status_free: "Grace Fulfilled ✓",
    loan_status_active: "Grace Japa In Progress ⏳",
    loan_free_desc: "No active grace request currently. During adversity, sickness, or exams, you can request advance grace from Thakurji's Grace Fund.",
    loan_apply_btn: "🤝 Request Kripa Sahayata",
    loan_daily_emi_info: "Daily Gratitude Japa: 1 Mala (108 names)",
    loan_cibil_boost_info: "Daily gratitude Japa boosts Bhakti Meter to 850+!",
    loan_pay_emi_btn: "💳 Offer Today's Gratitude Japa from Savings (108 names)",
    loan_pay_full_btn: "Complete Offering ➔",

    // Bhakti Meter (Earlier CIBIL Card)
    cibil_full_title: "Bhakti Meter Rating",
    cibil_full_sub: "Sadhana Discipline Score (300 - 900)",
    cibil_badge_verified: "✓ Verified",
    cibil_badge_expected: "Pending",
    cibil_not_checked: "Not evaluated",
    cibil_full_report_btn: "View Detailed Bhakti Report ➔",

    // Screen 3: Seva (Services Tab)
    service_tab_slip: "📝 Add Offline Japa",
    service_tab_transfer: "🎁 Dedicate Japa",
    service_tab_cheque: "📜 Offering Note",
    slip_heading: "Add Offline Japa",
    slip_sub: "If you have performed Japa on beads or written in a notebook, enter the total count directly here.",
    label_isht_mantra: "Isht Mahamantra",
    label_mala_count: "Mala Count",
    label_direct_count: "Total Japa Count",
    btn_submit_slip: "✓ Add to Sacred Account",
    transfer_heading: "Dedicate Holy Japa",
    transfer_sub: "Dedicate the fruits of your accumulated Japa to parents, ancestors, or world welfare.",
    label_beneficiary: "Dedication Purpose / Beneficiary",
    ben_parents: "For Parents' Longevity & Wellbeing",
    ben_ancestors: "For Ancestors' Peace & Liberation",
    ben_world: "For World Peace & Cow Seva",
    label_transfer_count: "Japa Count to Dedicate",
    btn_transfer: "Dedicate Holy Japa",
    cheque_payee_prefix: "Offered at the sacred lotus feet of:",
    btn_print_cheque: "🖨️ Print Offering Note",

    // Screen 4: Sadhana Diary (Passbook Tab)
    btn_view_ledger: "📜 Sadhana Diary",
    btn_view_calendar: "📅 Sadhana Calendar",
    ledger_heading: "Sadhana Diary Record",
    ledger_sub: "Unbroken divine sadhana ledger",
    btn_refresh: "Refresh",
    cal_streak_title: "🔥 UNBROKEN STREAK",
    cal_completed_title: "🟢 GOAL COMPLETE",
    cal_missed_title: "🔴 MISSED DAYS",
    unit_days: "Days",
    legend_complete: "Complete",
    legend_partial: "Partial",
    legend_missed: "Missed",
    legend_remaining: "Upcoming",

    // Screen 5: Profile Screen
    btn_back: "Back",
    prof_screen_title: "Devotee Profile",
    prof_change_photo_hint: "📷 Tap camera to change photo",
    prof_not_logged_in: "You are not logged in yet!",
    prof_label_name: "Devotee Name / Surname",
    prof_label_isht: "Ishtadev (Deity)",
    prof_label_phone: "Contact Mobile (Optional)",
    prof_label_country: "Country",
    prof_label_state: "State / Province",
    prof_label_city: "City / Town",
    btn_save_details: "✓ Save Details",
    logout_prompt: "End active session?",
    btn_logout: "Logout",

    // Bottom Navigation
    nav_mala: "Japa Mala",
    nav_account: "My Sadhana",
    nav_services: "Seva",
    nav_passbook: "Sadhana Diary",

    // Right Sidebar
    sidebar_title: "Menu & Settings",
    sidebar_user_guest: "Guest Devotee",
    sidebar_ac_guest: "A/C: Not Logged In",
    sidebar_theme_label: "App Theme",
    sidebar_theme_light: "Light Mode",
    sidebar_theme_dark: "Dark Mode",
    sidebar_notif_label: "Push Notifications",
    sidebar_notif_active: "Active ✓",
    sidebar_notif_enable: "Enable 🔔",
    sidebar_lang_label: "Language / भाषा",
    sidebar_settings_heading: "SETTINGS",
    sidebar_sound_label: "Japa Chime Sound",
    sidebar_vib_label: "Bead Vibration",
    sidebar_bt_label: "Bluetooth Remote",
    sidebar_status_on: "ON",
    sidebar_status_off: "OFF",
    sidebar_guide_btn: "Guide ➔",
    sidebar_login_btn: "Login / Open Account ➔",
    sidebar_logout_btn: "Logout (Exit)",
    sidebar_footer_version: "Bhajan Marg Bank PWA • v2.4.0 • Shri Hari Sharanam",

    // Auth Modal
    auth_title: "Devotee Sacred Login",
    auth_sub: "Eternal divine Japa management & account protection",
    tab_login: "Login",
    tab_signup: "New Account",
    label_ac_input: "Account Number (A/C No)",
    label_pin_input: "Security MPIN (4 Digits)",
    btn_login_submit: "Enter (Login) ➔",
    signup_step1_title: "Step 1/3: Personal Details",
    signup_step2_title: "Step 2/3: 11 Divine Invocations (Japa)",
    signup_step3_title: "Step 3/3: Server Maintenance Support",

    // Toasts & Alerts
    toast_deposit_synced: "Holy Japa synced to account!",
    toast_photo_updated: "✓ Profile photo updated successfully!",
    toast_profile_saved: "✓ Details saved successfully!",
    toast_lang_changed: "Language changed to English 🇬🇧"
  },

  hi: {
    // Top Header
    app_title: "भजन मार्ग बैंक",
    guest_sadhak: "अतिथि साधक",
    status_online: "🟢 ऑनलाइन",
    status_offline: "🔴 ऑफ़लाइन",
    voice_ai_title: "बोलकर जपें (AI Voice Japa)",
    menu_settings_title: "मेनू व सेटिंग्स खोलें",

    // Screen 1: Mala Counter
    ac_label: "खाता:",
    ac_default: "108-XXXX",
    default_isht: "श्री राधा नाम",
    today_japa_title: "🌅 आज का जप",
    unit_mala: "माला",
    unit_malas: "माला",
    today_added_sub: "आज खाते में जुड़ा",
    total_balance_title: "🏛️ कुल नाम जप",
    total_balance_sub: "अखंड संचित नाम जप",
    tap_here: "जप करें (TAP HERE)",
    mala_progress: "माला प्रगति:",
    session_summary_prefix: "वर्तमान बैठक:",
    session_summary_suffix: "माला पूर्ण",
    deposit_btn: "खाते में जोड़ें (Deposit)",
    reset_btn: "रीसेट",
    cibil_mini_title: "भक्ति मीटर स्कोर:",
    cibil_mini_sub: "साधना निष्ठा जांच",
    btn_check: "जांचें ➔",

    // Screen 2: नाम धन A/c (खाता स्क्रीन)
    card_title: "भक्ति पत्र",
    card_tier: "GOLD TIER",
    card_ac_no: "खाता संख्या (A/C No)",
    card_holder: "साधक नाम",
    card_isht: "इष्ट देव",
    savings_ac_title: "संचित नाम जप",
    savings_ac_sub: "इष्टदेव के चरणों में समर्पित",
    dedicated_wealth_title: "समर्पित नाम जप",
    dedicated_wealth_sub: "पितरों/गौ-सेवा अर्पण",

    // Nitya Niyam (Daily RD)
    rd_title: "नित्य नियम",
    rd_due_prefix: "आज का नियम / लक्ष्य:",
    rd_status_due: "⏳ नियम बाकी है",
    rd_status_paid: "✓ नियम पूर्ण हुआ",
    rd_progress_prefix: "आज पूर्ण हुआ:",
    rd_boost_hint: "नियम निष्ठा = भक्ति मीटर बूस्ट 🚀",

    // Maha-Sankalp (FD)
    fd_title: "महा-संकल्प",
    fd_bonus_badge: "+25% दिव्य फल",
    fd_default_goal: "1 लाख नाम महा-संकल्प",
    fd_target_prefix: "लक्ष्य:",
    fd_all_naams: "सभी नाम",
    fd_remaining_prefix: "संकल्प पूर्ण होने में शेष:",
    fd_change_btn: "नया संकल्प / बदलें ✎",

    // Sankatmochan Kripa Sahayata (Loan)
    loan_title: "संकटमोचन कृपा सहायता",
    loan_sub: "विपत्ति व रोग निवारणार्थ अग्रिम कृपा सहायता",
    loan_status_free: "संकट मुक्त ✓",
    loan_status_active: "कृपा साधना चालू ⏳",
    loan_free_desc: "वर्तमान में कोई कृपा सहायता सक्रिय नहीं है। अचानक संकट, रोग या परीक्षा के समय आप ठाकुर जी के कृपा कोष से अग्रिम सहायता ले सकते हैं।",
    loan_apply_btn: "🤝 कृपा सहायता की प्रार्थना करें",
    loan_daily_emi_info: "दैनिक आभार जप: 1 माला (108 नाम)",
    loan_cibil_boost_info: "नित्य आभार जप से भक्ति मीटर 850+!",
    loan_pay_emi_btn: "💳 बचत कोष से आज का आभार जप अर्पित करें (108 नाम)",
    loan_pay_full_btn: "पूर्ण समर्पण ➔",

    // Bhakti Meter (CIBIL)
    cibil_full_title: "भक्ति मीटर (साधना स्कोर)",
    cibil_full_sub: "साधना निष्ठा व नियमितता (300 - 900)",
    cibil_badge_verified: "✓ सत्यापित",
    cibil_badge_expected: "अपेक्षित",
    cibil_not_checked: "जांच नहीं हुई",
    cibil_full_report_btn: "विस्तृत भक्ति रिपोर्ट देखें ➔",

    // Screen 3: Prabhu Seva (Services)
    service_tab_slip: "📝 डायरी जप जोड़ें",
    service_tab_transfer: "🎁 पुण्य अर्पण",
    service_tab_cheque: "📜 चरण अर्पण पत्र",
    slip_heading: "डायरी / माला जप जोड़ें",
    slip_sub: "यदि आपने माला या पुस्तक पर जप किया है तो यहाँ संख्या सीधे जोड़ें।",
    label_isht_mantra: "इष्ट महामंत्र",
    label_mala_count: "माला संख्या",
    label_direct_count: "कुल नाम जप संख्या",
    btn_submit_slip: "✓ खाते में नाम जप जोड़ें",
    transfer_heading: "पारमार्थिक नाम जप अर्पण",
    transfer_sub: "अपने संचित नाम जप का फल माता-पिता, पितरों या विश्व कल्याण हेतु समर्पित करें।",
    label_beneficiary: "समर्पण उद्देश्य / लाभार्थी",
    ben_parents: "माता-पिता के दीर्घायु व कल्याणार्थ",
    ben_ancestors: "पितरों की सद्गति एवं मोक्षार्थ",
    ben_world: "विश्व शांति एवं गौ सेवा",
    label_transfer_count: "अर्पित की जाने वाली नाम जप संख्या",
    btn_transfer: "पुण्य नाम जप अर्पित करें",
    cheque_payee_prefix: "पावन चरण कमलेभ्यो नमः:",
    btn_print_cheque: "🖨️ अर्पण पत्र प्रिंट करें",

    // Screen 4: Sadhana Diary (Passbook)
    btn_view_ledger: "📜 साधना डायरी",
    btn_view_calendar: "📅 साधना पंचांग",
    ledger_heading: "साधना डायरी रिकॉर्ड",
    ledger_sub: "अखंड दैनिक साधना बहीखाता",
    btn_refresh: "रीफ्रेश",
    cal_streak_title: "🔥 अखंड लड़ी",
    cal_completed_title: "🟢 नियम पूर्ण",
    cal_missed_title: "🔴 नागा (छूटा)",
    unit_days: "दिन",
    legend_complete: "नियम पूर्ण",
    legend_partial: "आंशिक",
    legend_missed: "नागा",
    legend_remaining: "शेष",

    // Screen 5: Profile Screen
    btn_back: "वापस",
    prof_screen_title: "साधक प्रोफ़ाइल",
    prof_change_photo_hint: "📷 कैमरा बटन दबाकर फ़ोटो बदलें",
    prof_not_logged_in: "आपने अभी तक लॉगिन नहीं किया है!",
    prof_label_name: "साधक का शुभ नाम / सरनेम",
    prof_label_isht: "आराध्य देव (इष्ट)",
    prof_label_phone: "संपर्क मोबाइल नंबर (Optional)",
    prof_label_country: "देश (Country)",
    prof_label_state: "राज्य / प्रांत",
    prof_label_city: "शहर / नगर",
    btn_save_details: "✓ विवरण सुरक्षित करें",
    logout_prompt: "लॉगिन सत्र समाप्त करें?",
    btn_logout: "लॉगआउट करें",

    // Bottom Navigation
    nav_mala: "जप माला",
    nav_account: "नाम धन A/c",
    nav_services: "प्रभु सेवा",
    nav_passbook: "साधना डायरी",

    // Right Sidebar
    sidebar_title: "मेनू व सेटिंग्स",
    sidebar_user_guest: "अतिथि साधक",
    sidebar_ac_guest: "खाता: लॉगिन नहीं है",
    sidebar_theme_label: "ऐप थीम",
    sidebar_theme_light: "लाइट मोड",
    sidebar_theme_dark: "डार्क मोड",
    sidebar_notif_label: "नोटीफिकेशन",
    sidebar_notif_active: "सक्रिय ✓",
    sidebar_notif_enable: "चालू करें 🔔",
    sidebar_lang_label: "Language / भाषा",
    sidebar_settings_heading: "सेटिंग्स (SETTINGS)",
    sidebar_sound_label: "जप ध्वनि",
    sidebar_vib_label: "मणका कंपन",
    sidebar_bt_label: "ब्लूटूथ रिमोट",
    sidebar_status_on: "चालू",
    sidebar_status_off: "बंद",
    sidebar_guide_btn: "गाइड ➔",
    sidebar_login_btn: "लॉगिन करें ➔",
    sidebar_logout_btn: "लॉगआउट करें",
    sidebar_footer_version: "भजन मार्ग बैंक PWA • v2.4.0 • श्री हरि शरणम्",

    // Auth Modal
    auth_title: "साधक पावन लॉगिन",
    auth_sub: "अखंड नाम जप संचय एवं साधना खाता प्रबंधन",
    tab_login: "लॉगिन",
    tab_signup: "नया खाता",
    label_ac_input: "खाता संख्या (A/C No)",
    label_pin_input: "सुरक्षा MPIN (4 अंक)",
    btn_login_submit: "प्रवेश करें (Login) ➔",
    signup_step1_title: "चरण 1/3: साधक व्यक्तिगत विवरण",
    signup_step2_title: "चरण 2/3: 11 पावन नाम आहुति (जप)",
    signup_step3_title: "चरण 3/3: सर्वर सेवा सुरक्षा सहयोग",

    // Toasts & Alerts
    toast_deposit_synced: "खाते में नाम जप जमा हुआ!",
    toast_photo_updated: "✓ प्रोफ़ाइल फ़ोटो सफलतापूर्वक सेट हुई!",
    toast_profile_saved: "✓ विवरण सुरक्षित हुआ!",
    toast_lang_changed: "भाषा बदलकर हिंदी कर दी गई 🇮🇳"
  }
};

function t(key, fallback = "") {
  if (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) {
    return TRANSLATIONS[currentLang][key];
  }
  if (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) {
    return TRANSLATIONS['en'][key];
  }
  return fallback || key;
}

function setLanguage(lang, notify = true) {
  if (lang !== 'en' && lang !== 'hi') lang = 'en';
  currentLang = lang;
  localStorage.setItem('bm_lang', lang);

  // 1. data-i18n वाले तत्वों का टेक्स्ट बदलें
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key && TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) {
      el.innerText = TRANSLATIONS[currentLang][key];
    }
  });

  // 2. प्लेसहोल्डर्स बदलें
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key && TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) {
      el.setAttribute('placeholder', TRANSLATIONS[currentLang][key]);
    }
  });

  // 3. टाइटल्स / टूलटिप्स बदलें
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    if (key && TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) {
      el.setAttribute('title', TRANSLATIONS[currentLang][key]);
    }
  });

  // 4. साइडबार व ऐप स्टेट अपडेट
  if (typeof updateSidebarContent === 'function') {
    updateSidebarContent();
  }
  if (typeof renderProfileData === 'function') {
    renderProfileData();
  }
  if (typeof updateNetworkStatus === 'function') {
    updateNetworkStatus();
  }

  // 5. HTML lang विशेषता अद्यतन करें
  document.documentElement.lang = currentLang;

  // 6. केवल यूज़र इंटरैक्शन पर टोस्ट दिखाएं
  if (notify && typeof showToast === 'function') {
    showToast(t('toast_lang_changed'), 'info');
  }

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function toggleLanguage() {
  const nextLang = currentLang === 'en' ? 'hi' : 'en';
  setLanguage(nextLang, true);
}

// पहले लोड पर बिना टोस्ट के लैंग्वेज सेट करें
window.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang, false);
});