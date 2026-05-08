/* =============================================
   TOWARZYSTWO MIŁOŚNIKÓW RYDUŁTÓW
   Main JavaScript (v2)
   ============================================= */

(function() {
    'use strict';

    /* ---------- Aktualny rok w stopce ---------- */
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    /* ---------- Sticky header — cień przy scrollu ---------- */
    const header = document.querySelector('.site-header');

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    /* ---------- Mobile menu toggle ---------- */
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = mainNav.classList.toggle('open');
            menuToggle.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        mainNav.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                mainNav.classList.remove('open');
                menuToggle.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('click', function(e) {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target) && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                menuToggle.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    /* ---------- Highlight aktualnej sekcji w nawigacji ---------- */
    const navLinks = document.querySelectorAll('.main-nav a');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollPos = window.pageYOffset + 120;
        let currentSection = '';

        sections.forEach(function(section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    /* ---------- Aktualności — accordion (klikalne karty) ---------- */
    const newsItems = document.querySelectorAll('.news-item');

    newsItems.forEach(function(item) {
        const toggle = item.querySelector('.news-toggle');
        if (toggle) {
            toggle.addEventListener('click', function() {
                const isOpen = item.classList.contains('open');
                item.classList.toggle('open');
                toggle.setAttribute('aria-expanded', !isOpen);
            });
        }
    });

    /* ---------- Archiwum Kluki — accordion ---------- */
    const archiveYears = document.querySelectorAll('.archive-year');

    archiveYears.forEach(function(yearBlock) {
        const toggle = yearBlock.querySelector('.archive-year-toggle');
        if (toggle) {
            toggle.addEventListener('click', function() {
                const isOpen = yearBlock.classList.contains('open');
                yearBlock.classList.toggle('open');
                toggle.setAttribute('aria-expanded', !isOpen);
            });
        }
    });

    /* ---------- Lightbox dla galerii (z nawigacją) ---------- */
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    const lightboxPrev = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
    const lightboxNext = lightbox ? lightbox.querySelector('.lightbox-next') : null;

    let currentIndex = 0;

    function showImage(index) {
        if (!lightbox || index < 0 || index >= galleryItems.length) return;
        currentIndex = index;
        const item = galleryItems[index];
        const href = item.getAttribute('href');
        const caption = item.getAttribute('data-caption') || '';

        lightboxImage.src = href;
        lightboxImage.alt = caption;
        lightboxCaption.textContent = caption;
    }

    function openLightbox(index) {
        if (!lightbox) return;
        showImage(index);
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function showPrev() {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : galleryItems.length - 1;
        showImage(newIndex);
    }

    function showNext() {
        const newIndex = currentIndex < galleryItems.length - 1 ? currentIndex + 1 : 0;
        showImage(newIndex);
    }

    galleryItems.forEach(function(item, index) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            openLightbox(index);
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', function(e) { e.stopPropagation(); showPrev(); });
    if (lightboxNext) lightboxNext.addEventListener('click', function(e) { e.stopPropagation(); showNext(); });

    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('keydown', function(e) {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    /* ---------- Scroll reveal — fade in dla sekcji ---------- */
    const fadeElements = document.querySelectorAll('.section-header, .pillar, .news-item, .stat-card, .partner-card, .gallery-event, .bank-service, .bank-contact-card, .archive-year, .contact-block');

    fadeElements.forEach(function(el) {
        el.classList.add('fade-in');
    });

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
                    const indexInParent = siblings.indexOf(el);
                    const delay = Math.min(indexInParent * 80, 400);

                    setTimeout(function() {
                        el.classList.add('visible');
                    }, delay);
                    observer.unobserve(el);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(function(el) {
            observer.observe(el);
        });
    } else {
        fadeElements.forEach(function(el) {
            el.classList.add('visible');
        });
    }

})();
