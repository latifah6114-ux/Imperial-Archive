/* preview.js - شاشة عرض صفحات HTML والصور (من القالب أو من الجهاز) */

document.addEventListener('DOMContentLoaded', () => {
    const frame = document.getElementById('htmlFrame');
    const empty = document.getElementById('emptyMessage');
    const select = document.getElementById('pageSelect');
    const input = document.getElementById('htmlInput');
    const imageInput = document.getElementById('imageInput');
    const stage = document.getElementById('imageStage');
    const img = document.getElementById('imageView');
    const imageControls = document.getElementById('imageControls');
    const fitToggle = document.getElementById('fitToggle');
    const brightness = document.getElementById('brightness');
    const status = document.getElementById('status');

    // حالة الصورة: التكبير، التدوير، الإزاحة، وطريقة الملاءمة
    const view = { scale: 1, rotation: 0, x: 0, y: 0, fill: false };
    let imageUrl = null;
    let pendingReader = null; // قراءة ملف HTML الجارية؛ تُلغى عند تغيير العرض

    function hideImage() {
        stage.style.display = 'none';
        imageControls.style.display = 'none';
        img.removeAttribute('src');
        if (imageUrl) { URL.revokeObjectURL(imageUrl); imageUrl = null; }
        imageInput.value = '';
    }

    function hideFrame() {
        pendingReader = null;
        frame.removeAttribute('src');
        frame.removeAttribute('srcdoc');
        frame.removeAttribute('sandbox');
        frame.style.display = 'none';
        select.value = '';
        input.value = '';
    }

    function showFrame() {
        hideImage();
        frame.style.display = 'block';
        empty.style.display = 'none';
    }

    function clear(message) {
        hideFrame();
        hideImage();
        empty.style.display = 'block';
        status.textContent = message;
    }

    // 1. صفحة من القالب: تُفتح بمسارها فتعمل أصواتها وملفاتها المرتبطة
    select.addEventListener('change', () => {
        if (!select.value) return clear('جاهز.');
        pendingReader = null;
        frame.removeAttribute('srcdoc');
        frame.removeAttribute('sandbox');
        frame.src = select.value;
        showFrame();
        status.textContent = 'يتم عرض: ' + select.options[select.selectedIndex].text;
    });

    // 2. ملف HTML من الجهاز: يُعرض في إطار معزول عن القالب
    // تفريغ القيمة قبل الفتح حتى يعمل اختيار الملف نفسه مرة ثانية
    document.getElementById('chooseHtml').addEventListener('click', () => { input.value = ''; input.click(); });
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        pendingReader = reader;
        reader.onload = () => {
            if (reader !== pendingReader) return; // اختارت المستخدمة شيئاً آخر أثناء القراءة
            pendingReader = null;
            frame.removeAttribute('src');
            frame.setAttribute('sandbox', 'allow-scripts allow-forms allow-modals allow-popups');
            frame.srcdoc = reader.result;
            select.value = '';
            showFrame();
            status.textContent = 'يتم عرض ملف من الجهاز: ' + file.name + ' (الصور والملفات المرتبطة به لا تظهر إلا إذا كانت داخل الملف نفسه)';
        };
        reader.readAsText(file);
    });

    // 3. صورة من الجهاز مع أدوات التحكم
    function fitSize() {
        const w = stage.clientWidth, h = stage.clientHeight;
        const iw = img.naturalWidth, ih = img.naturalHeight;
        if (!iw || !ih) return;
        const sideways = view.rotation % 180 !== 0;
        const bw = sideways ? ih : iw, bh = sideways ? iw : ih;
        const ratio = view.fill ? Math.max(w / bw, h / bh) : Math.min(w / bw, h / bh);
        img.style.width = (iw * ratio) + 'px';
        img.style.height = (ih * ratio) + 'px';
    }

    function render() {
        fitSize();
        img.style.transform = 'translate(-50%, -50%) translate(' + view.x + 'px, ' + view.y + 'px) rotate(' + view.rotation + 'deg) scale(' + view.scale + ')';
        img.style.filter = 'brightness(' + brightness.value + '%)';
        fitToggle.textContent = view.fill ? '⤡ احتواء' : '⤢ ملء الشاشة';
    }

    function resetView() {
        Object.assign(view, { scale: 1, rotation: 0, x: 0, y: 0, fill: false });
        brightness.value = 100;
        render();
    }

    document.getElementById('chooseImage').addEventListener('click', () => { imageInput.value = ''; imageInput.click(); });
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            status.textContent = 'الملف المختار ليس صورة: ' + file.name;
            return;
        }
        hideFrame();
        if (imageUrl) URL.revokeObjectURL(imageUrl);
        imageUrl = URL.createObjectURL(file);
        img.onload = () => resetView();
        img.onerror = () => clear('تعذّر عرض هذه الصورة: ' + file.name);
        img.src = imageUrl;
        stage.style.display = 'block';
        imageControls.style.display = 'flex';
        empty.style.display = 'none';
        status.textContent = 'يتم عرض صورة: ' + file.name + ' — اسحبي الصورة لتحريكها.';
    });

    document.getElementById('zoomIn').addEventListener('click', () => { view.scale = Math.min(view.scale * 1.25, 8); render(); });
    document.getElementById('zoomOut').addEventListener('click', () => { view.scale = Math.max(view.scale / 1.25, 0.2); render(); });
    document.getElementById('rotate').addEventListener('click', () => { view.rotation = (view.rotation + 90) % 360; view.x = view.y = 0; render(); });
    fitToggle.addEventListener('click', () => { view.fill = !view.fill; view.scale = 1; view.x = view.y = 0; render(); });
    document.getElementById('resetImage').addEventListener('click', resetView);
    brightness.addEventListener('input', render);
    window.addEventListener('resize', () => { if (img.src) render(); });

    // سحب الصورة بالإصبع أو الماوس
    let drag = null;
    stage.addEventListener('pointerdown', (e) => {
        drag = { x: e.clientX - view.x, y: e.clientY - view.y };
        stage.setPointerCapture(e.pointerId);
        stage.style.cursor = 'grabbing';
    });
    stage.addEventListener('pointermove', (e) => {
        if (!drag) return;
        view.x = e.clientX - drag.x;
        view.y = e.clientY - drag.y;
        render();
    });
    const endDrag = () => { drag = null; stage.style.cursor = 'grab'; };
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);

    document.getElementById('clearButton').addEventListener('click', () => clear('تم مسح الشاشة.'));
});
