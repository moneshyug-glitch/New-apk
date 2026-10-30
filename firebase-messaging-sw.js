// ========================================================
// 🔔 UNIFIED SERVICE WORKER (100% OFFLINE PWA + PUSH NOTIFICATIONS)
// Bhajan Marg Bank • Zero-Data-Loss & Auto-Sync Engine
// ========================================================

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-installations-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// 🎯 नया कैश वर्ज़न (वर्ज़न बदलने से पुराना कैश अपने आप साफ़ हो जाएगा)
const CACHE_NAME = "bhajan-marg-pwa-v5.0";

// 📦 ऑफ़लाइन चलने हेतु सभी आवश्यक लोकल फाइलों की सूची
const STATIC_ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'style.css',
  'sidebar.css',
  'logo.png',
  'splash-radha-krishna.png',
  'lang.js',
  'notifications.js',
  'sidebar.js',
  // 'js/' फ़ोल्डर के पाथ
  'js/config.js',
  'js/audio.js',
  'js/calendar.js',
  'js/mala.js',
  'js/banking.js',
  'js/auth-profile.js',
  'js/app.js',
  // यदि कोई फ़ाइल रूट में हो तो उसके लिए सेफ फॉलबैक
  'config.js',
  'audio.js',
  'calendar.js',
  'mala.js',
  'banking.js',
  'auth-profile.js',
  'app.js'
];

// Firebase Initialization
firebase.initializeApp({
  apiKey: "AIzaSyAQ-ez7CUDHmiz54SnIWr0KShnEu-DXLN8",
  authDomain: "bhajanmargbank1.firebaseapp.com",
  projectId: "bhajanmargbank1",
  storageBucket: "bhajanmargbank1.firebasestorage.app",
  messagingSenderId: "1031168462879",
  appId: "1:1031168462879:web:ed6cd63cb628ba38e7452a"
});

const messaging = firebase.messaging();

// ========================================================
// 1. सर्विस वर्कर इंस्टॉलेशन (लोकल फाइल्स प्री-कैश)
// ========================================================
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[SW] Caching all offline static assets...');
      for (const asset of STATIC_ASSETS) {
        try {
          await cache.add(asset);
        } catch (err) {
          // यदि कोई पाथ रूट/js में से एक जगह न हो तो बाकियों को न रोकें
        }
      }
    })
  );
});

// ========================================================
// 2. एक्टिवेशन (पुराने कैश की सफाई)
// ========================================================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', k);
            return caches.delete(k);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ========================================================
// 3. 🎯 मुख्य ऑफ़लाइन इंजन (Stale-While-Revalidate Strategy)
// ========================================================
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // सिर्फ GET रिक्वेस्ट्स को कैश करें (Firestore API कॉल्स को सीधे जाने दें)
  if (req.method !== 'GET' || url.origin.includes('firestore.googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      // 🟢 यदि फ़ाइल पहले से कैश में है, तो बिना इंटरनेट के तुरंत स्क्रीन पर दें
      if (cachedResponse) {
        // यदि ऑनलाइन हैं तो बैकग्राउंड में नई फ़ाइल अपडेट कर लें
        fetch(req).then((networkResponse) => {
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, networkResponse));
          }
        }).catch(() => {
          // ऑफ़लाइन होने पर शांत रहें
        });
        return cachedResponse;
      }

      // 🌐 यदि कैश में नहीं है, तो नेटवर्क से लाएँ और भविष्य के लिए कैश में रख लें (CDN फाइल्स)
      return fetch(req).then((networkResponse) => {
        if (!networkResponse || (networkResponse.status !== 200 && networkResponse.type !== 'opaque')) {
          return networkResponse;
        }

        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(req, responseClone);
        });

        return networkResponse;
      }).catch(async () => {
        // 🔴 जब नेट बिल्कुल न हो और पेज रीलोड/ओपन हो रहा हो, तो ऑफ़लाइन index.html दें
        if (req.mode === 'navigate') {
          return caches.match('/index.html') || caches.match('index.html') || caches.match('./');
        }
      });
    })
  );
});

// ========================================================
// 4. बैकग्राउंड पुश नोटिफिकेशन (Duplicate-Free)
// ========================================================
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message:', payload);

  const notificationTitle = payload.notification?.title || payload.data?.title || "भजन मार्ग बैंक 📿";
  const appIcon = "logo.png";
  const targetUrl = payload.data?.url || "/";

  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || "श्री राधे! आज का नाम जप पूर्ण करें।",
    icon: appIcon,
    badge: appIcon,
    image: payload.notification?.image || payload.data?.image || null,
    vibrate: [200, 100, 200],
    tag: "bhajan-marg-single-push", // एक ही टैग से डुप्लीकेट नोटीफिकेशन नहीं बनेगी
    renotify: true,
    data: {
      url: targetUrl
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions).then(() => {
    return self.registration.getNotifications().then((notifications) => {
      notifications.forEach((n) => {
        if (n.tag !== "bhajan-marg-single-push") {
          n.close();
        }
      });
    });
  });
});

// ========================================================
// 5. नोटीफिकेशन क्लिक हैंडलर
// ========================================================
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 1. अगर ऐप पहले से खुली है तो उस पर फोकस करें
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if ('focus' in client) {
          return client.focus();
        }
      }
      // 2. अगर बंद है तो नई विंडो में खोलें
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});