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
    function initArchiveAccordion() {
        const archiveYears = document.querySelectorAll('.archive-year');

        archiveYears.forEach(function(yearBlock) {
            const toggle = yearBlock.querySelector('.archive-year-toggle');
            if (toggle && !toggle.dataset.bound) {
                toggle.dataset.bound = '1';  // zabezpieczenie przed podwójnym bindem
                toggle.addEventListener('click', function() {
                    const isOpen = yearBlock.classList.contains('open');
                    yearBlock.classList.toggle('open');
                    toggle.setAttribute('aria-expanded', !isOpen);
                });
            }
        });
    }

    initArchiveAccordion();

    /* ---------- Auto-load archiwum Kluki z GitHub API ----------
       Po skonfigurowaniu poniżej (user + repo), JS pobiera listę PDFów
       z folderu pdf/kluka/ na GitHubie i automatycznie generuje archiwum.

       Aby włączyć:
       1. Wpisz swój GitHub username (user) i nazwę repo (repo)
       2. Push plików PDF do pdf/kluka/ z nazwami w formacie:
          KlukaStyczen2026.pdf, KlukaLuty2026.pdf, KlukaMarzec2026.pdf, itd.
          (BEZ polskich znaków! Styczen nie Styczeń)

       Gdy `user` jest pusty, używana jest statyczna lista wpisana w HTML.
       --------------------------------------------------------------- */
    const GITHUB_CONFIG = {
        user: 'dominikszewczyk224180', // ← Twój GitHub username
        repo: 'tmrrydultowy',          // ← nazwa repo (bez myślnika)
        branch: 'main',                // ← branch (zwykle 'main', czasem 'master')
        pdfPath: 'pdf/kluka',          // ← folder z PDFami Kluki
        cacheMinutes: 0                // ← 0 = bez cache, zawsze pobiera świeżą listę z GitHuba
    };

    const KLUKA_MONTHS = {
        'styczen':     { display: 'Styczeń',     num: 1 },
        'luty':        { display: 'Luty',        num: 2 },
        'marzec':      { display: 'Marzec',      num: 3 },
        'kwiecien':    { display: 'Kwiecień',    num: 4 },
        'maj':         { display: 'Maj',         num: 5 },
        'czerwiec':    { display: 'Czerwiec',    num: 6 },
        'lipiec':      { display: 'Lipiec',      num: 7 },
        'sierpien':    { display: 'Sierpień',    num: 8 },
        'wrzesien':    { display: 'Wrzesień',    num: 9 },
        'pazdziernik': { display: 'Październik', num: 10 },
        'listopad':    { display: 'Listopad',    num: 11 },
        'grudzien':    { display: 'Grudzień',    num: 12 }
    };

    function pluralizeNumery(count) {
        if (count === 1) return '1 numer';
        if (count >= 2 && count <= 4) return count + ' numery';
        return count + ' numerów';
    }

    function parseKlukaFilename(name) {
        // KlukaStyczen2026.pdf, KlukaLut2026.pdf (skrót), kluka-styczen-2026.pdf — wszystkie warianty
        const match = name.match(/^kluka[\-_]?([a-zA-Z]+)[\-_]?(\d{4})\.pdf$/i);
        if (!match) return null;

        const monthRaw = match[1].toLowerCase();
        const year = parseInt(match[2], 10);

        // Spróbuj znaleźć miesiąc — najpierw dokładnie, potem przez prefix (Lut → Luty)
        let monthData = KLUKA_MONTHS[monthRaw];
        if (!monthData) {
            for (const key in KLUKA_MONTHS) {
                if (key.startsWith(monthRaw) || monthRaw.startsWith(key)) {
                    monthData = KLUKA_MONTHS[key];
                    break;
                }
            }
        }
        if (!monthData) return null;

        return {
            filename: name,
            year: year,
            monthName: monthData.display,
            monthNum: monthData.num
        };
    }

    async function fetchKlukaListFromGitHub() {
        const cacheKey = 'tmr_kluka_list';
        const cacheTimeKey = 'tmr_kluka_time';
        const cacheMaxAge = GITHUB_CONFIG.cacheMinutes * 60 * 1000;

        // Sprawdź cache (sessionStorage — żywe tylko podczas sesji przeglądarki)
        try {
            const cached = sessionStorage.getItem(cacheKey);
            const cachedTime = parseInt(sessionStorage.getItem(cacheTimeKey) || '0', 10);
            if (cached && (Date.now() - cachedTime) < cacheMaxAge) {
                return JSON.parse(cached);
            }
        } catch (e) { /* sessionStorage może być zablokowany */ }

        // Fetch z GitHub Contents API
        const url = 'https://api.github.com/repos/' +
                    GITHUB_CONFIG.user + '/' + GITHUB_CONFIG.repo +
                    '/contents/' + GITHUB_CONFIG.pdfPath +
                    '?ref=' + GITHUB_CONFIG.branch;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('GitHub API zwrócił status: ' + response.status);
        }
        const files = await response.json();

        // Cache
        try {
            sessionStorage.setItem(cacheKey, JSON.stringify(files));
            sessionStorage.setItem(cacheTimeKey, Date.now().toString());
        } catch (e) { /* ok */ }

        return files;
    }

    function renderKlukaArchive(files) {
        const container = document.getElementById('klukaArchive');
        if (!container) return;

        // Parsuj nazwy plików, odfiltruj te które nie pasują
        const issues = files
            .filter(function(f) { return f.type === 'file' && /\.pdf$/i.test(f.name); })
            .map(function(f) { return parseKlukaFilename(f.name); })
            .filter(Boolean);

        if (issues.length === 0) {
            return; // nic nie znaleziono — zostaw to co jest w HTML jako fallback
        }

        // Grupuj po latach
        const byYear = {};
        issues.forEach(function(issue) {
            if (!byYear[issue.year]) byYear[issue.year] = [];
            byYear[issue.year].push(issue);
        });

        // Sortuj lata malejąco
        const years = Object.keys(byYear).map(Number).sort(function(a, b) { return b - a; });

        // Buduj HTML
        let html = '<h3 class="subsection-title">Archiwum numerów</h3>';

        years.forEach(function(year, idx) {
            // Sortuj miesiące malejąco (od najnowszego)
            const yearIssues = byYear[year].sort(function(a, b) { return b.monthNum - a.monthNum; });
            const isOpen = (idx === 0); // tylko najnowszy rok rozwinięty domyślnie

            html += '<div class="archive-year' + (isOpen ? ' open' : '') + '" data-year="' + year + '">';
            html += '<button class="archive-year-toggle" aria-expanded="' + isOpen + '">';
            html += '<span class="archive-year-label">' + year + '</span>';
            html += '<span class="archive-year-count">' + pluralizeNumery(yearIssues.length) + '</span>';
            html += '<span class="archive-chevron" aria-hidden="true">▾</span>';
            html += '</button>';
            html += '<ul class="archive-list">';

            yearIssues.forEach(function(issue) {
                const href = GITHUB_CONFIG.pdfPath + '/' + issue.filename;
                html += '<li><a href="' + href + '" target="_blank" rel="noopener">';
                html += '<span class="issue-month">' + issue.monthName + '</span>';
                html += '<span class="issue-year">' + issue.year + '</span>';
                html += '<span class="issue-pdf">PDF →</span>';
                html += '</a></li>';
            });

            html += '</ul></div>';
        });

        html += '<p class="archive-note">Pełne archiwum sięga 1993 roku. W razie pytań o starsze wydania prosimy o kontakt: <a href="mailto:kluka.tmr@interia.pl">kluka.tmr@interia.pl</a></p>';

        container.innerHTML = html;

        // Re-init accordion na nowych elementach
        initArchiveAccordion();
    }

    // Uruchom auto-load tylko jeśli skonfigurowane
    if (GITHUB_CONFIG.user && GITHUB_CONFIG.user !== '') {
        fetchKlukaListFromGitHub()
            .then(function(files) {
                if (Array.isArray(files)) {
                    renderKlukaArchive(files);
                }
            })
            .catch(function(err) {
                console.warn('TMR — auto-load Kluki nie zadziałał, używam statycznej listy z HTML.', err);
            });
    }

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
