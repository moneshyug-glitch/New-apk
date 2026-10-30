// ==========================================
// CONFIG & GLOBAL STATE MODULE
// Worldwide Location Support & Offline-Ready Engine
// ==========================================

// 🌐 विस्तृत देश, राज्य एवं शहर डेटा (All Major Countries, States & Sacred Cities)
const LOCATION_DATA = {
  "भारत (India)": {
    "उत्तर प्रदेश (Uttar Pradesh)": [
      "वृन्दावन (Vrindavan)", "मथुरा (Mathura)", "अयोध्या (Ayodhya)", "वाराणसी / काशी (Varanasi)", "प्रयागराज (Prayagraj)",
      "चित्रकूट (Chitrakoot)", "गोवर्धन (Govardhan)", "बरसाना (Barsana)", "लखनऊ (Lucknow)", "कानपुर (Kanpur)", 
      "आगरा (Agra)", "गोरखपुर (Gorakhpur)", "नोएडा (Noida)", "गाजियाबाद (Ghaziabad)", "मेरठ (Meerut)", 
      "झांसी (Jhansi)", "बरेली (Bareilly)", "अलीगढ़ (Aligarh)", "अन्य शहर (Other City)"
    ],
    "राजस्थान (Rajasthan)": [
      "खाटूश्यामजी (Khatu)", "जयपुर (Jaipur)", "नाथद्वारा (Nathdwara)", "पुष्कर / अजमेर (Pushkar/Ajmer)", "जोधपुर (Jodhpur)",
      "कोटा (Kota)", "उदयपुर (Udaipur)", "बीकानेर (Bikaner)", "भरतपुर (Bharatpur)", "अलवर (Alwar)", "भीलवाड़ा", "अन्य शहर (Other City)"
    ],
    "मध्य प्रदेश (Madhya Pradesh)": [
      "उज्जैन (Ujjain - Mahakal)", "इंदौर (Indore)", "भोपाल (Bhopal)", "चित्रकूट / सतना (Chitrakoot)", "ग्वालियर (Gwalior)",
      "जबलपुर (Jabalpur)", "ओंकारेश्वर (Omkareshwar)", "रीवा (Rewa)", "अमरकंटक (Amarkantak)", "अन्य शहर (Other City)"
    ],
    "गुजरात (Gujarat)": [
      "द्वारका (Dwarka)", "सोमनाथ (Somnath)", "अहमदाबाद (Ahmedabad)", "सूरत (Surat)", "वडोदरा (Vadodara)", 
      "राजकोट (Rajkot)", "डाकोर (Dakor)", "भावनगर", "जामनगर", "अन्य शहर (Other City)"
    ],
    "उत्तराखंड (Uttarakhand)": [
      "हरिद्वार (Haridwar)", "ऋषिकेश (Rishikesh)", "देहरादून (Dehradun)", "बद्रीनाथ (Badrinath)", "केदारनाथ (Kedarnath)", 
      "गंगोत्री / यमुनोत्री", "नैनीताल", "अल्मोड़ा", "अन्य शहर (Other City)"
    ],
    "दिल्ली NCR (Delhi NCR)": [
      "नई दिल्ली (New Delhi)", "दक्षिणी दिल्ली (South Delhi)", "पूर्वी दिल्ली (East Delhi)", "उत्तरी दिल्ली (North Delhi)", 
      "द्वारका (Dwarka)", "रोहिणी (Rohini)", "कनॉट प्लेस", "अन्य क्षेत्र (Other)"
    ],
    "महाराष्ट्र (Maharashtra)": [
      "मुंबई (Mumbai)", "पुणे (Pune)", "पंढरपुर (Pandharpur - Vitthal)", "शिर्डी (Shirdi)", "नासिक (Nashik - Trimbakeshwar)", 
      "नागपुर (Nagpur)", "ठाणे (Thane)", "कोल्हापुर", "संभाजीनगर / औरंगाबाद", "अन्य शहर (Other City)"
    ],
    "बिहार (Bihar)": [
      "पटना (Patna)", "गया / बोधगया (Gaya)", "मुजफ्फरपुर (Muzaffarpur)", "भागलपुर (Bhagalpur)", "दरभंगा (Darbhanga)", 
      "सीतामढ़ी (Sitamarhi)", "बक्सर", "छपरा", "अन्य शहर (Other City)"
    ],
    "हरियाणा (Haryana)": [
      "कुरुक्षेत्र (Kurukshetra)", "गुरुग्राम (Gurugram)", "फरीदाबाद (Faridabad)", "पानीपत (Panipat)", "करनाल (Karnal)", 
      "अंबाला", "हिसार", "रोहतक", "अन्य शहर (Other City)"
    ],
    "पंजाब (Punjab)": [
      "अमृतसर (Amritsar)", "लुधियाना (Ludhiana)", "जालंधर (Jalandhar)", "पटियाला (Patiala)", "बठिंडा (Bathinda)", 
      "मोहाली", "पठानकोट", "अन्य शहर (Other City)"
    ],
    "पश्चिम बंगाल (West Bengal)": [
      "मायापुर / नवद्वीप (Mayapur - ISKCON HQ)", "कोलकाता (Kolkata)", "हावड़ा (Howrah)", "सिलीगुड़ी (Siliguri)", 
      "दुर्गापुर", "तारकेश्वर", "अन्य शहर (Other City)"
    ],
    "ओडिशा (Odisha)": [
      "पुरी (Puri - Shri Jagannath Dham)", "भुवनेश्वर (Bhubaneswar)", "कटक (Cuttack)", "संबलपुर", "राउरकेला", "अन्य शहर (Other City)"
    ],
    "झारखंड (Jharkhand)": [
      "देवघर (Deoghar - Baidyanath Dham)", "रांची (Ranchi)", "जमशेदपुर (Jamshedpur)", "धनबाद (Dhanbad)", "बोकारो", "अन्य शहर (Other City)"
    ],
    "छत्तीसगढ़ (Chhattisgarh)": [
      "रायपुर (Raipur)", "बिलासपुर (Bilaspur)", "भिलाई / दुर्ग (Bhilai)", "राजनांदगांव", "जगदलपुर", "अन्य शहर (Other City)"
    ],
    "कर्नाटक (Karnataka)": [
      "बेंगलुरु (Bengaluru)", "उडुपी (Udupi - Sri Krishna)", "मैसूर (Mysuru)", "हम्पी (Hampi)", "मंगलोर (Mangaluru)", "अन्य शहर (Other City)"
    ],
    "तमिलनाडु (Tamil Nadu)": [
      "चेन्नई (Chennai)", "मदुरै (Madurai - Meenakshi)", "रामेश्वरम (Rameswaram)", "श्रीरंगम / त्रिची (Srirangam)", "कोयंबटूर", "अन्य शहर (Other City)"
    ],
    "तेलंगाना व आंध्र प्रदेश": [
      "हैदराबाद (Hyderabad)", "तिरुपति (Tirupati Balaji)", "विशाखापट्टनम", "विजयवाड़ा", "वारंगल", "अन्य शहर (Other City)"
    ],
    "जम्मू, कश्मीर व लद्दाख": [
      "कटरा / वैष्णो देवी (Katra)", "जम्मू (Jammu)", "श्रीनगर (Srinagar)", "लेह / लद्दाख", "अन्य शहर (Other City)"
    ],
    "हिमाचल प्रदेश (Himachal)": [
      "शिमला (Shimla)", "धर्मशाला / कांगड़ा", "मंडी", "कुल्लू / मनाली", "चिंतपूर्णी", "ज्वालाजी", "अन्य शहर (Other City)"
    ],
    "असम व पूर्वोत्तर (Assam & NE)": [
      "गुवाहाटी / कामाख्या (Guwahati)", "सिलचर", "डिब्रूगढ़", "शिलांग", "अगरतला", "अन्य शहर (Other City)"
    ],
    "केरल व गोवा (Kerala & Goa)": [
      "तिरुवनंतपुरम (Padmanabhaswamy)", "गुरुवायुर (Guruvayur)", "कोच्चि (Kochi)", "पणजी (Panaji)", "अन्य शहर (Other City)"
    ],
    "अन्य राज्य / केंद्रशासित प्रदेश": [
      "अन्य नगर / ग्राम (Other City/Village)"
    ]
  },
  "नेपाल (Nepal)": {
    "काठमांडू उपत्यका": ["काठमांडू (पशुपतिनाथ)", "ललितपुर", "भक्तपुर", "अन्य"],
    "जनकपुर धाम (Janakpur)": ["जनकपुर (माता जानकी जन्मभूमि)", "धनुषा", "अन्य"],
    "अन्य अंचल व प्रांत": ["पोखरा (Pokhara)", "मुक्तिनाथ (Muktinath)", "विराटनगर", "लुम्बिनी", "अन्य"]
  },
  "संयुक्त राज्य अमेरिका (USA)": {
    "Texas": ["Dallas (Radha Madhav Dham)", "Houston", "Austin", "San Antonio", "Other"],
    "New Jersey / New York": ["Edison", "Jersey City", "New York City", "Long Island", "Other"],
    "California": ["Los Angeles", "San Francisco / Bay Area", "San Jose", "San Diego", "Other"],
    "Other US States": ["Chicago (IL)", "Atlanta (GA)", "Seattle (WA)", "Other City"]
  },
  "यूनाइटेड किंगडम (UK)": {
    "England": ["London (Bhaktivedanta Manor)", "Leicester", "Birmingham", "Manchester", "Other"],
    "Scotland & Wales": ["Edinburgh", "Glasgow", "Cardiff", "Other"]
  },
  "कनाडा (Canada)": {
    "Ontario": ["Toronto", "Brampton", "Mississauga", "Ottawa", "Other"],
    "British Columbia & Others": ["Vancouver", "Surrey", "Calgary", "Montreal", "Other"]
  },
  "ऑस्ट्रेलिया व न्यूजीलैंड": {
    "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Other"],
    "New Zealand": ["Auckland", "Wellington", "Christchurch", "Other"]
  },
  "संयुक्त अरब अमीरात (UAE)": {
    "Emirates": ["दुबई (Dubai)", "अबू धाबी (Abu Dhabi - BAPS Mandir)", "शारजाह (Sharjah)", "अन्य"]
  },
  "मॉरीशस व अन्य देश (Other)": {
    "विदेशी प्रांत / City": ["अन्य नगर / विदेश (Other Country/City)"]
  }
};

// ==========================================
// Firebase Initialization (100% Offline Persistence)
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyAQ-ez7CUDHmiz54SnIWr0KShnEu-DXLN8",
  authDomain: "bhajanmargbank1.firebaseapp.com",
  projectId: "bhajanmargbank1",
  storageBucket: "bhajanmargbank1.firebasestorage.app",
  messagingSenderId: "1031168462879",
  appId: "1:1031168462879:web:ed6cd63cb628ba38e7452a",
  measurementId: "G-RHR95E4TFT"
};

let db = null;
let isFirebaseReady = false;

try {
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();

    // 🎯 ऑफ़लाइन डेटाबेस परसिस्टेंस (IndexedDB Cache) चालू करें
    db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Firestore persistence notice: Multiple tabs open');
      } else if (err.code === 'unimplemented') {
        console.warn('Firestore persistence not supported in this browser');
      }
    });

    isFirebaseReady = true;
  }
} catch (e) {
  console.warn("Firebase initialization notice (safe offline mode):", e);
}

// Global App State
var activeAcc = localStorage.getItem('bm_active_acc') || null;
var cleanAcc = activeAcc ? activeAcc.replace(/[-\s]/g, '') : null;
var userProfile = null;
var sessionTaps = 0;
var isSyncingOffline = false;

// बैकग्राउंड लाइव सिंक वैरिएबल्स
var pendingSyncCount = 0;
var syncDebounceTimer = null;

// साधना पंचांग स्टेट
var currentCalYear = new Date().getFullYear();
var currentCalMonth = new Date().getMonth();
var activePassbookView = 'ledger';
const HINDI_MONTHS = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितम्बर", "अक्टूबर", "नवम्बर", "दिसम्बर"];

// Helper Utilities
function safeSet(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerText = val;
}

function safeSetValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Toast Popup
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toastPopup');
  const icon = document.getElementById('toastIcon');
  safeSet('toastMsg', msg);
  
  if (type === 'warn') {
    toast.className = "fixed bottom-16 left-1/2 -translate-x-1/2 bg-rose-950 border border-rose-500/70 text-rose-200 px-4 py-2.5 rounded-2xl shadow-2xl text-xs flex items-center gap-2 transition-all duration-300 z-50 max-w-[92vw]";
    if (icon) icon.setAttribute('data-lucide', 'alert-circle');
  } else if (type === 'info') {
    toast.className = "fixed bottom-16 left-1/2 -translate-x-1/2 bg-amber-950 border border-amber-500/70 text-amber-200 px-4 py-2.5 rounded-2xl shadow-2xl text-xs flex items-center gap-2 transition-all duration-300 z-50 max-w-[92vw]";
    if (icon) icon.setAttribute('data-lucide', 'info');
  } else {
    toast.className = "fixed bottom-16 left-1/2 -translate-x-1/2 bg-emerald-950 border border-emerald-500/60 text-emerald-200 px-4 py-2.5 rounded-2xl shadow-2xl text-xs flex items-center gap-2 transition-all duration-300 z-50 max-w-[92vw]";
    if (icon) icon.setAttribute('data-lucide', 'check-circle');
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
  toast.classList.remove('opacity-0', 'pointer-events-none');
  setTimeout(() => toast.classList.add('opacity-0', 'pointer-events-none'), 3200);
}

// Theme Controller
function initTheme() {
  const savedTheme = localStorage.getItem('bm_theme') || 'dark';
  applyTheme(savedTheme, false);
}

function applyTheme(theme, notify = true) {
  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const icon = document.getElementById('themeIcon');
  const meta = document.getElementById('metaThemeColor');
  const btn = document.getElementById('themeToggleBtn');

  if (theme === 'light') {
    document.body.classList.add('light-theme');
    if (icon) icon.setAttribute('data-lucide', 'moon');
    if (meta) meta.setAttribute('content', '#fdf6e7');
    if (btn) btn.title = isHindi ? "डार्क मोड करें (Dark Mode)" : "Switch to Dark Mode";
    if (notify) showToast(isHindi ? "☀️ लाइट मोड सक्रिय" : "☀️ Light Mode Activated", 'info');
  } else {
    document.body.classList.remove('light-theme');
    if (icon) icon.setAttribute('data-lucide', 'sun');
    if (meta) meta.setAttribute('content', '#1a0601');
    if (btn) btn.title = isHindi ? "लाइट मोड करें (Light Mode)" : "Switch to Light Mode";
    if (notify) showToast(isHindi ? "🌙 डार्क मोड सक्रिय" : "🌙 Dark Mode Activated", 'info');
  }

  localStorage.setItem('bm_theme', theme);
  if (typeof lucide !== 'undefined') lucide.createIcons();
  if (typeof renderProfileData === 'function') renderProfileData();
}

function toggleTheme() {
  const isCurrentlyLight = document.body.classList.contains('light-theme');
  applyTheme(isCurrentlyLight ? 'dark' : 'light', true);
}

// 🌐 नेटवर्क स्टेटस (Bilingual Header Badge Fix)
function updateNetworkStatus() {
  const b = document.getElementById('networkStatusBadge');
  if (!b) return;
  const isHindi = (typeof currentLang !== 'undefined' && currentLang === 'hi');

  if (navigator.onLine) {
    b.className = "text-[8px] font-mono px-1.5 py-0.2 rounded-full border bg-emerald-950/80 border-emerald-500/40 text-emerald-300 whitespace-nowrap";
    b.innerText = isHindi ? "🟢 ऑनलाइन" : "🟢 Online";
  } else {
    b.className = "text-[8px] font-mono px-1.5 py-0.2 rounded-full border bg-rose-950/80 border-rose-500/50 text-rose-300 whitespace-nowrap";
    b.innerText = isHindi ? "🔴 ऑफ़लाइन" : "🔴 Offline";
  }
}