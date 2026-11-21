/* ============================================================
   IRON CLOUD MC — store & payment
   Product selection, payment methods, form validation
   ============================================================ */
(() => {
    'use strict';

    /* ---------- External links (no page-transition overlay) ---------- */
    document.querySelectorAll('.category-card').forEach((card) => {
        card.addEventListener('click', (e) => {
            const href = card.getAttribute('href');
            if (!href) return;
            e.preventDefault();
            window.location.href = href;
        });
    });

    /* ---------- Product cards ---------- */
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card) => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('a')) return; // let the Purchase link work normally
            productCards.forEach((c) => c.classList.remove('active'));
            card.classList.add('active');
        });
    });

    /* ---------- Payment page ---------- */
    const form = document.getElementById('payment-form');
    if (!form) return;

    const currency = (n) => `৳${n}`;
    const readQuery = () => new URLSearchParams(window.location.search);

    const applyProduct = (product, price) => {
        const selected = document.getElementById('selected-product');
        const productField = document.getElementById('product');
        const priceView = document.getElementById('product-price');
        const total = document.getElementById('total-price');
        const bkash = document.getElementById('bkash-amount');
        const nagad = document.getElementById('nagad-amount');

        if (selected) selected.textContent = product || 'None';
        if (productField) productField.value = product || 'None';
        if (priceView) priceView.textContent = price ? currency(price) : '৳0';
        if (total) total.textContent = price ? currency(price) : '৳0';
        if (bkash) bkash.textContent = price ? currency(price) : '৳0';
        if (nagad) nagad.textContent = price ? currency(price) : '৳0';
    };

    const params = readQuery();
    const qProduct = params.get('product');
    const qPrice = params.get('price');
    if (qProduct && qPrice) applyProduct(qProduct, qPrice);

    /* ---------- Payment method selection ---------- */
    const methods = document.querySelectorAll('.payment-method');
    const details = document.querySelectorAll('.payment-details');

    const activateMethod = (method) => {
        methods.forEach((m) => {
            m.classList.remove('active');
            m.setAttribute('aria-pressed', 'false');
        });
        details.forEach((d) => d.classList.remove('active'));
        method.classList.add('active');
        method.setAttribute('aria-pressed', 'true');
        const type = method.getAttribute('data-payment');
        const panel = document.querySelector(`.payment-details[data-payment="${type}"]`);
        if (panel) panel.classList.add('active');
    };

    methods.forEach((method) => {
        method.addEventListener('click', () => activateMethod(method));
        method.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activateMethod(method);
            }
        });
    });

    /* ---------- Validation ---------- */
    const setError = (id, message) => {
        const field = document.getElementById(id);
        const error = field ? field.closest('.form-group')?.querySelector('.form-error') : null;
        if (field) field.classList.toggle('invalid', Boolean(message));
        if (error) {
            error.textContent = message || '';
            error.classList.toggle('visible', Boolean(message));
        }
    };

    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username');
        const email = document.getElementById('email');
        const product = document.getElementById('product');
        const activeMethod = document.querySelector('.payment-method.active');

        const usernameVal = username.value.trim();
        const emailVal = email.value.trim();
        const productVal = (product ? product.value : '').trim();

        let valid = true;

        if (usernameVal.length < 3) {
            setError('username', 'Enter your Minecraft username (3+ characters).');
            valid = false;
        } else setError('username', '');

        if (!isValidEmail(emailVal)) {
            setError('email', 'Enter a valid email address.');
            valid = false;
        } else setError('email', '');

        if (!productVal || productVal.toLowerCase() === 'none') {
            window.showToast('Select a product first — head back to the store.', 'error');
            valid = false;
        }

        if (!activeMethod) {
            window.showToast('Please select a payment method.', 'error');
            valid = false;
        }

        if (!valid) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalLabel = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="ph ph-circle-dashed"></i> Sending…';

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalLabel;
            window.showToast('Purchase details sent. Complete the payment and keep your transaction ID.');
            form.reset();
            applyProduct('None', '');
            methods.forEach((m) => m.classList.remove('active'));
            details.forEach((d) => d.classList.remove('active'));
        }, 1400);
    });
})();
