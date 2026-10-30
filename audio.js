// ==========================================
// AUDIO & VIBRATION MANAGER MODULE
// ==========================================
var audioCtx = null;
var soundEnabled = true;
var vibrateEnabled = true;

function initAudio() { 
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 
}

function playChime(freq = 880, decay = 0.25) {
  if (!soundEnabled) return;
  try {
    initAudio();
    const osc = audioCtx.createOscillator(); 
    const gain = audioCtx.createGain();
    osc.type = "sine"; 
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + decay);
    osc.connect(gain); 
    gain.connect(audioCtx.destination);
    osc.start(); 
    osc.stop(audioCtx.currentTime + decay);
  } catch (e) {}
}

function playMalaGong() { 
  if (soundEnabled) { initAudio(); playChime(528, 1.8); } 
}

function triggerVibrate(ms = 30) { 
  if (vibrateEnabled && navigator.vibrate) navigator.vibrate(ms); 
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const icon = document.getElementById('soundIcon');
  if (icon) icon.setAttribute('data-lucide', soundEnabled ? 'volume-2' : 'volume-x');
  lucide.createIcons();
  showToast(soundEnabled ? "🔊 ध्वनि चालू" : "🔇 ध्वनि बंद", 'info');
}

function toggleVibrate() {
  vibrateEnabled = !vibrateEnabled;
  showToast(vibrateEnabled ? "📳 कंपन चालू" : "📴 कंपन बंद", 'info');
}

function showBluetoothInfo() {
  alert("💍 ब्लूटूथ रिमोट गाइड:\n\n1. फोन से सेल्फी रिमोट या वायरलेस क्लिकर कनेक्ट करें।\n2. क्लिकर का बटन या कीबोर्ड का Spacebar दबाने पर माला आगे बढ़ेगी।");
}