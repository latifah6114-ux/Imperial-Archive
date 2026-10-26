/* preview.js - شاشة عرض صفحات HTML (من القالب أو من الجهاز) */

document.addEventListener('DOMContentLoaded', () => {
    const frame = document.getElementById('htmlFrame');
    const empty = document.getElementById('emptyMessage');
    const select = document.getElementById('pageSelect');
    const input = document.getElementById('htmlInput');
    const status = document.getElementById('status');

    function show() {
        frame.style.display = 'block';
        empty.style.display = 'none';
    }

    function clear(message) {
        frame.removeAttribute('src');
        frame.removeAttribute('srcdoc');
        frame.removeAttribute('sandbox');
        frame.style.display = 'none';
        empty.style.display = 'block';
        select.value = '';
        input.value = '';
        status.textContent = message;
    }

    // 1. صفحة من القالب: تُفتح بمسارها فتعمل أصواتها وملفاتها المرتبطة
    select.addEventListener('change', () => {
        if (!select.value) return clear('جاهز.');
        frame.removeAttribute('srcdoc');
        frame.removeAttribute('sandbox');
        frame.src = select.value;
        show();
        status.textContent = 'يتم عرض: ' + select.options[select.selectedIndex].text;
    });

    // 2. ملف HTML من الجهاز: يُعرض في إطار معزول عن القالب
    document.getElementById('chooseHtml').addEventListener('click', () => input.click());
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            frame.removeAttribute('src');
            frame.setAttribute('sandbox', 'allow-scripts allow-forms allow-modals allow-popups');
            frame.srcdoc = reader.result;
            select.value = '';
            show();
            status.textContent = 'يتم عرض ملف من الجهاز: ' + file.name + ' (الصور والملفات المرتبطة به لا تظهر إلا إذا كانت داخل الملف نفسه)';
        };
        reader.readAsText(file);
    });

    document.getElementById('clearButton').addEventListener('click', () => clear('تم مسح الشاشة.'));
});
