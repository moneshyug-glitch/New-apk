// ==========================================
// 🔔 NOTIFICATIONS CONTROLLER
// ==========================================

// 👉 आपकी Firebase Console की बिल्कुल सही VAPID Key (Capital P के साथ):
const VAPID_KEY = "BLYEA2G_Sn0yWFcu_WVKmIwCpZON-gOtgG18atmwMYN90R22EIUvGjwM5kbPrP_wmSWEEP8YrA3SSCe_xP6jMS4";

let fcmMessaging = null;

function initNotifications() {
  if (!('Notification' in window)) {
    console.warn("इस ब्राउज़र में Web Notification समर्थित नहीं है।");
    return;
  }

  try {
    fcmMessaging = firebase.messaging();

    // जब ऐप स्क्रीन पर खुला हो (Foreground Message)
    fcmMessaging.onMessage((payload) => {
      console.log("FCM Foreground Message:", payload);
      const title = payload.notification?.title || "भजन मार्ग बैंक";
      const body = payload.notification?.body || "श्री राधे! आज का नाम जप पूर्ण करें।";
      showToast(`🔔 ${title}: ${body}`, 'info');
      if (typeof playChime === 'function') playChime(1040, 0.4);
    });

    // यदि अनुमति पहले से है, तो बैकग्राउंड में टोकन सत्यापित करें
    if (Notification.permission === 'granted') {
      registerDevicePushToken(false);
    }
  } catch (err) {
    console.warn("FCM init warning:", err);
  }
}

// जब साधक घंटी (🔔) बटन पर क्लिक करे
async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    alert("आपके ब्राउज़र में पुश नोटीफिकेशन समर्थित नहीं है। कृपया Google Chrome का उपयोग करें।");
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      showToast("घंटी सक्रिय! टोकन कनेक्ट हो रहा है...", "info");
      await registerDevicePushToken(true);
    } else if (permission === 'denied') {
      alert("⚠️ आपने नोटीफिकेशन अनुमति ब्लॉक कर दी है!\n\nकृपया ब्राउज़र सेटिंग में जाकर Notifications को 'Allow' करें।");
    }
  } catch (err) {
    console.error("Permission error:", err);
    alert("अनुमति त्रुटि: " + err.message);
  }
}

// डिवाइस टोकन रजिस्टर करने का मुख्य फंक्शन
async function registerDevicePushToken(isUserInitiated = false) {
  try {
    if (!fcmMessaging) {
      fcmMessaging = firebase.messaging();
    }

    // 1. सर्विस वर्कर की तैयारी का इंतज़ार करें
    const reg = await navigator.serviceWorker.ready;

    // 2. VAPID Key के साथ टोकन प्राप्त करें
    const currentToken = await fcmMessaging.getToken({ 
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: reg
    });

    if (currentToken) {
      console.log("✓ FCM Device Token जनरेट हुआ:", currentToken);
      localStorage.setItem('bm_fcm_token', currentToken);

      // 3. डेटाबेस (Firestore) में टोकन सुरक्षित करें
      const targetAcc = cleanAcc || (userProfile && userProfile.accNo ? userProfile.accNo.replace(/[-\s]/g, '') : null);
      
      if (db && isFirebaseReady) {
        if (targetAcc) {
          await db.collection("bm_sadhak_accounts").doc(targetAcc).set({
            fcmToken: currentToken,
            notificationsEnabled: true,
            lastTokenUpdate: new Date().toISOString()
          }, { merge: true });
        } else {
          await db.collection("bm_device_tokens").doc(currentToken.slice(0, 24)).set({
            fcmToken: currentToken,
            notificationsEnabled: true,
            createdAt: new Date().toISOString()
          }, { merge: true });
        }
      }

      if (isUserInitiated) {
        showToast("🎉 बधाई हो! नोटीफिकेशन 100% कनेक्ट हो गया!", "success");
        if (typeof playMalaGong === 'function') playMalaGong();
      }
    } else {
      if (isUserInitiated) {
        showToast("⚠️ टोकन नहीं बन सका, कृपया दोबारा प्रयास करें।", "warn");
      }
    }
  } catch (err) {
    console.error("FCM Token Registration Error:", err);
    if (isUserInitiated) {
      alert("FCM Error: " + err.message);
    }
  }
}

// विंडो लोड होने पर इनिशियलाइज़ करें
window.addEventListener('load', () => {
  initNotifications();
});