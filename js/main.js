/* ============================================================
   IRON CLOUD MC — main
   Mobile nav, scroll reveals, tagline reveal, counters, copy
   ============================================================ */
(() => {
    'use strict';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Mobile menu ---------- */
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.mobile-menu');

    if (toggle && menu) {
        const links = Array.from(menu.querySelectorAll('a, button'));
        // Stagger link entrance: each item 60ms after the previous, cap 400ms
        const step = links.length > 7 ? 50 : 60;
        links.forEach((link, i) => {
            link.style.transitionDelay = `${Math.min(i * step, 400)}ms`;
        });

        let delayTimer = null;
        const setMenu = (open) => {
            toggle.classList.toggle('open', open);
            menu.classList.toggle('open', open);
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            toggle.setAttribute('aria-pressed', String(open));
            menu.setAttribute('aria-hidden', String(!open));
            if ('inert' in menu) menu.inert = !open;
            document.body.style.overflow = open ? 'hidden' : '';
            clearTimeout(delayTimer);
            if (open) {
                // Clear the entrance delay once the sequence finishes so hover stays snappy
                delayTimer = setTimeout(() => {
                    links.forEach((link) => { link.style.transitionDelay = ''; });
                }, 500);
            }
        };

        toggle.addEventListener('click', () => {
            setMenu(!menu.classList.contains('open'));
        });

        links.forEach((link) => link.addEventListener('click', () => setMenu(false)));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('open')) {
                setMenu(false);
                toggle.focus();
            }
        });

        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !menu.contains(e.target) && menu.classList.contains('open')) {
                setMenu(false);
            }
        });
    }

    /* ---------- Toast ---------- */
    let toastTimer = null;
    window.showToast = (message, type = 'success') => {
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            toast.innerHTML = '<i class="ph ph-check"></i><span></span>';
            document.body.appendChild(toast);
        }
        const icon = toast.querySelector('.ph');
        toast.classList.toggle('error', type === 'error');
        icon.className = `ph ph-${type === 'error' ? 'x' : 'check'}`;
        icon.style.color = type === 'error' ? 'var(--danger)' : '';
        toast.querySelector('span').textContent = message;
        toast.classList.add('visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('visible'), 3400);
    };

    /* ---------- Clipboard (data-copy) ---------- */
    const copyText = (text) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }
        return new Promise((resolve, reject) => {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy') ? resolve() : reject(new Error('copy failed'));
            } catch (err) {
                reject(err);
            } finally {
                document.body.removeChild(ta);
            }
        });
    };

    document.querySelectorAll('[data-copy]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const value = btn.getAttribute('data-copy');
            const copyBtn = btn;
            const original = copyBtn.innerHTML;
            copyText(value)
                .then(() => {
                    copyBtn.innerHTML = '<i class="ph ph-check"></i> Copied to clipboard';
                    window.showToast(`Copied ${value}`);
                    setTimeout(() => {
                        copyBtn.innerHTML = original;
                    }, 2400);
                })
                .catch(() => {
                    window.showToast('Copy failed — copy the IP below', 'error');
                });
        });
    });

    /* ---------- Scroll reveals (once) ---------- */
    const revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');
    if (prefersReduced || !('IntersectionObserver' in window)) {
        revealTargets.forEach((el) => el.classList.add('is-visible'));
    } else {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

        revealTargets.forEach((el) => revealObserver.observe(el));
    }

    /* ---------- Tagline reveal (word by word, B11) ---------- */
    const tagline = document.querySelector('.tagline-inner');
    if (tagline) {
        // Split text into words (preserve spacing and markup)
        const words = tagline.textContent.trim().split(/\s+/);
        tagline.innerHTML = words
            .map((w) => `<span class="word">${w}</span>`)
            .join(' ');
        const wordEls = Array.from(tagline.querySelectorAll('.word'));

        if (prefersReduced || !('IntersectionObserver' in window)) {
            wordEls.forEach((w) => w.classList.add('is-on'));
        } else {
            const wordObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-on');
                        wordObserver.unobserve(entry.target);
                    }
                });
            }, {
                // Words activate one at a time as they cross the trigger line
                threshold: 0.9,
                rootMargin: '-30% 0px -45% 0px',
            });
            wordEls.forEach((w) => wordObserver.observe(w));
        }
    }

    /* ---------- Counters ---------- */
    const counters = document.querySelectorAll('.counter');
    const setCounter = (el, target) => {
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        el.textContent = prefix + target + suffix;
    };

    const animateCounter = (el) => {
        const target = parseFloat(el.getAttribute('data-target')) || 0;
        const startTime = performance.now();
        const duration = 1100;
        const step = (now) => {
            const t = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            const value = Math.round(target * eased);
            setCounter(el, value);
            if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    if (counters.length) {
        if (prefersReduced || !('IntersectionObserver' in window)) {
            counters.forEach((el) => setCounter(el, parseFloat(el.getAttribute('data-target')) || 0));
        } else {
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.6 });
            counters.forEach((el) => counterObserver.observe(el));
        }
    }

    /* ---------- FAQ accordion (one open at a time) ---------- */
    document.querySelectorAll('.faq-group').forEach((group) => {
        const items = Array.from(group.querySelectorAll('details'));
        items.forEach((item) => {
            item.addEventListener('toggle', () => {
                if (item.open) {
                    items.forEach((other) => {
                        if (other !== item && other.open) other.open = false;
                    });
                }
            });
        });
    });
})();
