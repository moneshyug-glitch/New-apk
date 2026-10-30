// ========================================================
// 🔔 UNIFIED SERVICE WORKER (OFFLINE PWA + FIREBASE PUSH)
// With Duplicate Prevention & TWA Native Focus Handling
// ========================================================

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-installations-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE = "bhajan-marg-pwa-cache-v4";
const offlineFallbackPage = "index.html";

firebase.initializeApp({
  apiKey: "AIzaSyAQ-ez7CUDHmiz54SnIWr0KShnEu-DXLN8",
  authDomain: "bhajanmargbank1.firebaseapp.com",
  projectId: "bhajanmargbank1",
  storageBucket: "bhajanmargbank1.firebasestorage.app",
  messagingSenderId: "1031168462879",
  appId: "1:1031168462879:web:ed6cd63cb628ba38e7452a"
});

const messaging = firebase.messaging();

// 🔔 बैकग्राउंड नोटीफिकेशन हैंडलर (डुप्लीकेट रोकने और लोगो दिखाने का पक्का लॉजिक)
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message:', payload);

  const notificationTitle = payload.notification?.title || payload.data?.title || "भजन मार्ग बैंक 📿";
  const appIcon = "https://app.bhajanmargbank.com/logo.png";
  const targetUrl = "https://app.bhajanmargbank.com/";

  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || "श्री राधे! आज का नाम जप पूर्ण करें।",
    icon: appIcon,
    badge: appIcon,
    image: payload.notification?.image || payload.data?.image || null,
    vibrate: [200, 100, 200],
    tag: "bhajan-marg-single-push", // 🎯 एक ही टैग होने से डुप्लीकेट नोटीफिकेशन नहीं बनेगी
    renotify: true,
    data: {
      url: targetUrl
    }
  };

  // लोगो वाली नोटीफिकेशन दिखाना और बिना लोगो वाली डुप्लीकेट को तुरंत हटाना
  return self.registration.showNotification(notificationTitle, notificationOptions).then(() => {
    return self.registration.getNotifications().then((notifications) => {
      notifications.forEach((n) => {
        // अगर कोई ऐसी नोटीफिकेशन है जिसका टैग हमारा नहीं है (यानी बिना लोगो वाली), उसे बंद करें
        if (n.tag !== "bhajan-marg-single-push") {
          n.close();
        }
      });
    });
  });
});

// 🎯 नोटीफिकेशन क्लिक पर सीधे इंस्टॉल की हुई ऐप (TWA) को खोलना
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "https://app.bhajanmargbank.com/";

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 1. अगर ऐप पहले से खुली या बैकग्राउंड में है, तो उसे सीधे स्क्रीन पर लाएं
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes("app.bhajanmargbank.com") && 'focus' in client) {
          return client.focus();
        }
      }
      // 2. अगर ऐप पूरी तरह बंद है, तो TWA ऐप के पूरे URL को खोलें
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// PWA लाइफसाइकिल
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then((cache) => cache.add(offlineFallbackPage)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => k !== CACHE ? caches.delete(k) : null)))
      .then(() => self.clients.claim())
  );
});

if (typeof workbox !== 'undefined' && workbox.navigationPreload && workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResp = await event.preloadResponse;
        if (preloadResp) return preloadResp;
        return await fetch(event.request);
      } catch (e) {
        const cache = await caches.open(CACHE);
        return await cache.match(offlineFallbackPage);
      }
    })());
  }
});