const SIGNATURE_PROTOCOL_02 = {
    BINAURAL_BASE: 200, BINAURAL_FREQ: 10, BINAURAL_VOL: 0.025, MUSIC_VOLUME: 0.15,
    ASSETS: { water: '../02_assets/water_loop.mp3', string: '../02_assets/string_loop.mp3' }
};
let audioCtx = null, isAudioPlaying = false, oscLeft, oscRight, gainLeft, gainRight, merger, waterAudio, stringAudio;
function updateStatus(msg, isOnline) { const d = document.getElementById('status'); if(d){ d.textContent = msg; d.classList.toggle('online', !!isOnline); } }
function startBinaural() { const b = SIGNATURE_PROTOCOL_02.BINAURAL_BASE; oscLeft = audioCtx.createOscillator(); oscRight = audioCtx.createOscillator(); oscLeft.frequency.value = b; oscRight.frequency.value = b + SIGNATURE_PROTOCOL_02.BINAURAL_FREQ; gainLeft = audioCtx.createGain(); gainRight = audioCtx.createGain(); gainLeft.gain.value = SIGNATURE_PROTOCOL_02.BINAURAL_VOL; gainRight.gain.value = SIGNATURE_PROTOCOL_02.BINAURAL_VOL; merger = audioCtx.createChannelMerger(2); oscLeft.connect(gainLeft); oscRight.connect(gainRight); gainLeft.connect(merger, 0, 0); gainRight.connect(merger, 0, 1); merger.connect(audioCtx.destination); oscLeft.start(); oscRight.start(); }
function stopBinaural() { [oscLeft, oscRight].forEach(o => { if (o) { try { o.stop(); } catch (e) {} o.disconnect(); } }); [gainLeft, gainRight, merger].forEach(n => { if (n) n.disconnect(); }); oscLeft = oscRight = gainLeft = gainRight = merger = null; }
function startAudioEngine() { if (isAudioPlaying) return; if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); startBinaural(); waterAudio = new Audio(SIGNATURE_PROTOCOL_02.ASSETS.water); waterAudio.loop = true; waterAudio.volume = SIGNATURE_PROTOCOL_02.MUSIC_VOLUME; stringAudio = new Audio(SIGNATURE_PROTOCOL_02.ASSETS.string); stringAudio.loop = true; stringAudio.volume = SIGNATURE_PROTOCOL_02.MUSIC_VOLUME; waterAudio.play().catch(() => {}); stringAudio.play().catch(() => {}); isAudioPlaying = true; updateStatus("الخلفية تعمل...", true); }
function stopAudioEngine() { if (!isAudioPlaying) return; stopBinaural(); if (waterAudio) { waterAudio.pause(); waterAudio.currentTime = 0; } if (stringAudio) { stringAudio.pause(); stringAudio.currentTime = 0; } isAudioPlaying = false; updateStatus("الخلفية متوقفة.", false); }
document.addEventListener('DOMContentLoaded', () => {
    const v = document.getElementById('localVideo'), c = document.getElementById('chooseButton'), y = document.getElementById('youtubeButton'), s = document.getElementById('saveButton'), st = document.getElementById('stopButton'), f = document.getElementById('fileInput');
    if (v) { v.addEventListener('play', startAudioEngine); v.addEventListener('pause', stopAudioEngine); }
    if (st) st.addEventListener('click', () => { stopAudioEngine(); if (v) v.pause(); });
    if (c && f) { c.addEventListener('click', () => f.click()); f.addEventListener('change', (e) => { const file = e.target.files[0]; if (file) { v.src = URL.createObjectURL(file); v.style.display = 'block'; if (s) s.disabled = false; } }); }
    if (y) y.addEventListener('click', () => window.open('https://youtu.be/c4HfI1Y_2A4', '_blank'));
    if (s) s.addEventListener('click', () => { if (v && v.src) { const a = document.createElement('a'); a.href = v.src; a.download = 'clip_02.mp4'; a.click(); } });
});
