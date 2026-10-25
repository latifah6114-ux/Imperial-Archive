/* clip_01.js - محرك الخلفية الصوتية (ترددات Binaural + الماء + الوتر)
   يعمل تلقائياً عند تشغيل الفيديو ويتوقف عند إيقافه.
*/

const SIGNATURE_PROTOCOL = {
    BINAURAL_BASE: 200,       // التردد الأساسي (Hz)
    BINAURAL_FREQ: 10,        // فرق الترددات بين الأذنين (ألفا 10Hz)
    BINAURAL_VOL: 0.025,      // مستوى الترددات
    MUSIC_VOLUME: 0.15,       // مستوى الماء والوتر
    ASSETS: {
        water: '../02_assets/water_loop.mp3',
        string: '../02_assets/string_loop.mp3'
    }
};

let audioCtx = null;
let isAudioPlaying = false;
let oscLeft = null;
let oscRight = null;
let gainLeft = null;
let gainRight = null;
let merger = null;
let waterAudio = null;
let stringAudio = null;

function updateStatus(msg, isOnline) {
    const statusDiv = document.getElementById('status');
    if (!statusDiv) return;
    statusDiv.textContent = msg;
    statusDiv.classList.toggle('online', !!isOnline);
}

// تشغيل الترددات: كل أذن تأخذ قناتها الخاصة (تسمى Binaural فعلاً)
function startBinaural() {
    const base = SIGNATURE_PROTOCOL.BINAURAL_BASE;
    const vol = SIGNATURE_PROTOCOL.BINAURAL_VOL;

    oscLeft = audioCtx.createOscillator();
    oscRight = audioCtx.createOscillator();
    oscLeft.frequency.value = base;
    oscRight.frequency.value = base + SIGNATURE_PROTOCOL.BINAURAL_FREQ;

    gainLeft = audioCtx.createGain();
    gainRight = audioCtx.createGain();
    gainLeft.gain.value = vol;
    gainRight.gain.value = vol;

    merger = audioCtx.createChannelMerger(2);
    oscLeft.connect(gainLeft);
    oscRight.connect(gainRight);
    gainLeft.connect(merger, 0, 0);   // القناة اليسرى
    gainRight.connect(merger, 0, 1);  // القناة اليمنى
    merger.connect(audioCtx.destination);

    oscLeft.start();
    oscRight.start();
}

function stopBinaural() {
    [oscLeft, oscRight].forEach(o => {
        if (o) { try { o.stop(); } catch (e) {} o.disconnect(); }
    });
    [gainLeft, gainRight, merger].forEach(n => { if (n) n.disconnect(); });
    oscLeft = oscRight = gainLeft = gainRight = merger = null;
}

function startAudioEngine() {
    if (isAudioPlaying) return;

    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    startBinaural();

    waterAudio = new Audio(SIGNATURE_PROTOCOL.ASSETS.water);
    waterAudio.loop = true;
    waterAudio.volume = SIGNATURE_PROTOCOL.MUSIC_VOLUME;

    stringAudio = new Audio(SIGNATURE_PROTOCOL.ASSETS.string);
    stringAudio.loop = true;
    stringAudio.volume = SIGNATURE_PROTOCOL.MUSIC_VOLUME;

    waterAudio.play().catch(() => console.log("ملف الماء غير موجود أو المتصفح منع التشغيل."));
    stringAudio.play().catch(() => console.log("ملف الوتر غير موجود أو المتصفح منع التشغيل."));

    isAudioPlaying = true;
    updateStatus("الخلفية الصوتية تعمل...", true);
}

function stopAudioEngine() {
    if (!isAudioPlaying) return;

    stopBinaural();
    if (waterAudio) { waterAudio.pause(); waterAudio.currentTime = 0; }
    if (stringAudio) { stringAudio.pause(); stringAudio.currentTime = 0; }

    isAudioPlaying = false;
    updateStatus("الخلفية متوقفة.", false);
}

document.addEventListener('DOMContentLoaded', () => {
    const localVideo = document.getElementById('localVideo');
    const stopBtn = document.getElementById('stopButton');

    if (localVideo) {
        localVideo.addEventListener('play', startAudioEngine);
        localVideo.addEventListener('pause', stopAudioEngine);
    }

    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            stopAudioEngine();
            if (localVideo) localVideo.pause();
        });
    }
});
