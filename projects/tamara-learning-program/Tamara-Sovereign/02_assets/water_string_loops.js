/* water_string_loops.js - محرك معاينة الماء والوتر
   يربط أزرار اختيار الملفات ومعاينة يوتيوب في صفحة water_string_loops.html
*/

document.addEventListener('DOMContentLoaded', () => {
    function updateStatus(elementId, message, isOnline) {
        const el = document.getElementById(elementId);
        if (el) {
            el.textContent = message;
            if (isOnline) el.classList.add('online');
            else el.classList.remove('online');
        }
    }

    // 1. أزرار اختيار الملفات المحلية (الماء والوتر)
    const fileButtons = document.querySelectorAll('button[data-file-input]');
    fileButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const inputId = btn.getAttribute('data-file-input');
            const input = document.getElementById(inputId);
            if (input) input.click();
        });
    });

    // 2. عند اختيار ملف
    const waterInput = document.getElementById('waterInput');
    const stringInput = document.getElementById('stringInput');
    const waterAudio = document.getElementById('waterAudio');
    const stringAudio = document.getElementById('stringAudio');

    if (waterInput && waterAudio) {
        waterInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                waterAudio.src = URL.createObjectURL(file);
                updateStatus('waterStatus', 'تم تحميل ملف الماء بنجاح. اضغطي تشغيل.', true);
            }
        });
    }

    if (stringInput && stringAudio) {
        stringInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                stringAudio.src = URL.createObjectURL(file);
                updateStatus('stringStatus', 'تم تحميل ملف الوتر بنجاح. اضغطي تشغيل.', true);
            }
        });
    }

    // 3. أزرار معاينة YouTube
    const youtubeButtons = document.querySelectorAll('button[data-youtube]');
    youtubeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const url = btn.getAttribute('data-youtube');
            if (url) window.open(url, '_blank');
        });
    });

    // 4. أزرار الحفظ (تنزيل الملف الصوتي)
    const saveButtons = document.querySelectorAll('button[data-save]');
    saveButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const audioId = btn.getAttribute('data-save');
            const audio = document.getElementById(audioId);
            if (audio && audio.src) {
                const a = document.createElement('a');
                a.href = audio.src;
                a.download = audioId === 'waterAudio' ? 'water_loop.mp3' : 'string_loop.mp3';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                alert('الرجاء اختيار ملف صوتي أولاً.');
            }
        });
    });
});
