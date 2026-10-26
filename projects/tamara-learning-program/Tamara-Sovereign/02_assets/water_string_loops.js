document.addEventListener('DOMContentLoaded', () => {
    function updateStatus(id, msg, online) { const e = document.getElementById(id); if (e) { e.textContent = msg; if (online) e.classList.add('online'); else e.classList.remove('online'); } }
    document.querySelectorAll('button[data-file-input]').forEach(b => { b.onclick = () => { const i = document.getElementById(b.getAttribute('data-file-input')); if(i) i.click(); }; });
    const wi = document.getElementById('waterInput'), si = document.getElementById('stringInput'), wa = document.getElementById('waterAudio'), sa = document.getElementById('stringAudio');
    if (wi && wa) wi.onchange = (e) => { const f = e.target.files[0]; if (f) { wa.src = URL.createObjectURL(f); updateStatus('waterStatus', 'تم التحميل. اضغطي تشغيل.', true); } };
    if (si && sa) si.onchange = (e) => { const f = e.target.files[0]; if (f) { sa.src = URL.createObjectURL(f); updateStatus('stringStatus', 'تم التحميل. اضغطي تشغيل.', true); } };
    document.querySelectorAll('button[data-youtube]').forEach(b => { b.onclick = () => window.open(b.getAttribute('data-youtube'), '_blank'); });
    document.querySelectorAll('button[data-save]').forEach(b => { b.onclick = () => { const id = b.getAttribute('data-save'), a = document.getElementById(id); if (a && a.src) { const l = document.createElement('a'); l.href = a.src; l.download = id === 'waterAudio' ? 'water_loop.mp3' : 'string_loop.mp3'; l.click(); } else alert('اختاري ملف أولاً.'); }; });
});
