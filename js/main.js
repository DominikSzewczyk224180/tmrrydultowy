/* =============================================
   TOWARZYSTWO MIŁOŚNIKÓW RYDUŁTÓW
   Main JavaScript
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
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });

    /* ---------- Mobile menu toggle ---------- */
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            const isOpen = mainNav.classList.toggle('open');
            menuToggle.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Zamknij menu po kliknięciu w link
        mainNav.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                mainNav.classList.remove('open');
                menuToggle.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Zamknij menu po kliknięciu poza nim
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
        const scrollPos = window.pageYOffset + 100;
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

    /* ---------- Archiwum Kluki — accordion ---------- */
    const archiveYears = document.querySelectorAll('.archive-year');

    archiveYears.forEach(function(yearBlock) {
        const toggle = yearBlock.querySelector('.archive-year-toggle');

        if (toggle) {
            toggle.addEventListener('click', function() {
                const isOpen = yearBlock.classList.contains('open');

                // Opcja: zamknij inne (jak chcesz tylko jeden otwarty na raz)
                // archiveYears.forEach(y => y.classList.remove('open'));

                if (isOpen) {
                    yearBlock.classList.remove('open');
                    toggle.setAttribute('aria-expanded', 'false');
                } else {
                    yearBlock.classList.add('open');
                    toggle.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });

    /* ---------- Lightbox dla galerii ---------- */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

    function openLightbox(caption) {
        if (!lightbox) return;
        lightboxCaption.textContent = caption || '';
        // Placeholder dla zdjęcia — gdy będą prawdziwe pliki, podmień na <img>
        lightboxImage.textContent = caption || 'Zdjęcie';
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

    galleryItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const caption = item.getAttribute('data-caption');
            openLightbox(caption);
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    /* ---------- Scroll reveal — fade in dla sekcji ---------- */
    const fadeElements = document.querySelectorAll('.section-header, .pillar, .news-card, .stat-card, .partner-card, .gallery-item, .bank-feature, .archive-year');

    fadeElements.forEach(function(el) {
        el.classList.add('fade-in');
    });

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry, index) {
                if (entry.isIntersecting) {
                    setTimeout(function() {
                        entry.target.classList.add('visible');
                    }, index * 60);
                    observer.unobserve(entry.target);
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
        // Fallback dla starych przeglądarek
        fadeElements.forEach(function(el) {
            el.classList.add('visible');
        });
    }

    /* ---------- Formularz kontaktowy ---------- */
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Walidacja podstawowa (HTML required już to robi, ale dla pewności)
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                alert('Proszę wypełnić wszystkie wymagane pola.');
                return;
            }

            // TODO: tutaj podpiąć backend (np. Formspree, Netlify Forms, EmailJS)
            // Na razie tylko placeholder — informujemy użytkownika
            alert('Dziękujemy za wiadomość!\n\nFormularz nie jest jeszcze podłączony do skrzynki — prosimy o bezpośredni kontakt: kluka.tmr@interia.pl');
            contactForm.reset();
        });
    }

})();
