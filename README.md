# Towarzystwo Miłośników Rydułtów — strona internetowa

Nowa strona dla TMR. Single-page (one-page) HTML/CSS/JS, zoptymalizowana pod GitHub Pages.

## 🏗️ Struktura projektu

```
tmr-rydultowy/
├── index.html          ← strona główna (one-page)
├── css/
│   └── style.css       ← cały styl strony
├── js/
│   └── main.js         ← interaktywność (menu, accordion, lightbox)
├── img/
│   ├── logo.png        ← herb TMR
│   ├── header-bg.png   ← tło z poprzedniej strony
│   ├── menu-item.png
│   └── galeria/        ← zdjęcia z wydarzeń (do uzupełnienia)
├── pdf/
│   └── kluka/          ← numery gazety w PDF (do uzupełnienia)
├── README.md
└── .gitignore
```

## 🚀 Uruchomienie lokalnie

Najprościej — otwórz `index.html` w przeglądarce.

Albo uruchom mały serwer (lepiej, bo niektóre rzeczy wymagają HTTP):

```bash
# Python 3
python3 -m http.server 8000

# Node.js (jeśli masz npx)
npx serve

# PHP
php -S localhost:8000
```

Następnie wejdź na `http://localhost:8000`.

## 🌐 Deploy na GitHub Pages

1. **Stwórz repo na GitHubie** (np. `tmr-rydultowy`).
2. **Wrzuć projekt:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TWOJ-USER/tmr-rydultowy.git
   git push -u origin main
   ```
3. **Włącz GitHub Pages:**
   - Wejdź w repo → **Settings** → **Pages**
   - W **Source** wybierz: `Deploy from a branch`
   - W **Branch** wybierz `main` i folder `/ (root)`
   - Zapisz
4. Strona pojawi się pod adresem `https://TWOJ-USER.github.io/tmr-rydultowy/` (czasem trzeba poczekać 1-2 minuty).

### Własna domena (np. `tmrrydultowy.pl`)

1. W folderze projektu utwórz plik `CNAME` (bez rozszerzenia) z zawartością:
   ```
   tmrrydultowy.pl
   ```
2. U dostawcy domeny ustaw rekordy DNS:
   - **Typ A** → `185.199.108.153`
   - **Typ A** → `185.199.109.153`
   - **Typ A** → `185.199.110.153`
   - **Typ A** → `185.199.111.153`
3. W Settings → Pages w polu **Custom domain** wpisz `tmrrydultowy.pl` i włącz **Enforce HTTPS**.

## ✏️ Edycja treści

### Aktualności
W `index.html` znajdź sekcję `<!-- ===== AKTUALNOŚCI ===== -->`. Każda aktualność to blok `<article class="news-card">`. Skopiuj, zmień datę, tag i treść.

### Numery gazety Kluka
W sekcji `<!-- ===== KLUKA ===== -->` znajdziesz `<div class="archive-year">` dla każdego roku. Wewnątrz `<ul class="archive-list">` dodaj nowy `<li>` z linkiem do PDFa:
```html
<li><a href="pdf/kluka/kluka-485.pdf">
    <span class="issue-num">nr 485</span>
    <span class="issue-date">15 maja 2026</span>
    <span class="issue-pdf">PDF →</span>
</a></li>
```

PDFy wrzuć do folderu `pdf/kluka/`.

### Galeria
W folderze `img/galeria/` umieść zdjęcia, np. `wydarzenie-2025-01.jpg`. W `index.html` w sekcji `<!-- ===== GALERIA ===== -->` zmień placeholdery na:
```html
<a href="img/galeria/wydarzenie-2025-01.jpg" class="gallery-item" data-caption="Wybory Rydułtowika 2025">
    <img src="img/galeria/wydarzenie-2025-01.jpg" alt="">
</a>
```

### Logotypy partnerów
W folderze `img/` umieść logotypy (np. `partner-cieplownia.png`). W sekcji `<!-- ===== PARTNERZY ===== -->` zamień placeholder na:
```html
<a href="https://strona-partnera.pl" class="partner-card" target="_blank" rel="noopener">
    <img src="img/partner-cieplownia.png" alt="Ciepłownia">
</a>
```

## 📧 Formularz kontaktowy

Formularz na razie wyświetla tylko alert. Aby działał, podepnij jeden z serwisów:

### Opcja 1: Formspree (najprostsza, darmowy plan)
1. Załóż konto na [formspree.io](https://formspree.io)
2. W `index.html` zmień `<form id="contactForm">` na:
   ```html
   <form id="contactForm" action="https://formspree.io/f/TWOJ-ID" method="POST">
   ```
3. W `js/main.js` usuń `e.preventDefault()` w handlerze submit

### Opcja 2: EmailJS (więcej kontroli)
Zobacz [emailjs.com](https://emailjs.com) i podepnij według ich dokumentacji.

## 🎨 Customizacja kolorów

Wszystkie kolory są w zmiennych CSS na górze pliku `css/style.css`:

```css
:root {
    --blue-primary: #1E4A8A;       /* główny niebieski */
    --blue-secondary: #2D6CB8;     /* jaśniejszy niebieski */
    --yellow-pastel: #FFE44D;      /* żółty z logo */
    /* ... */
}
```

Zmień raz tutaj — zmieni się wszędzie.

## 📋 Co jest do zrobienia (TODO)

- [ ] Wgrać prawdziwe numery gazety Kluka (PDF) do `pdf/kluka/`
- [ ] Wgrać prawdziwe zdjęcia do galerii
- [ ] Wgrać logotypy partnerów
- [ ] Podpiąć formularz kontaktowy (Formspree)
- [ ] Sprawdzić i zaktualizować dane kontaktowe (telefon, mail)
- [ ] Sprawdzić aktualne władze TMR (na starej stronie był Henryk Machnik)
- [ ] Dodać prawdziwe statystyki (rok założenia: 1993 — sprawdzony)
- [ ] Skonfigurować Decap CMS (opcjonalnie, jak chcecie żeby ktoś z TMR sam edytował)
- [ ] Dodać favicon (na razie używa logo.png)
- [ ] SEO: dodać tagi Open Graph / Twitter Card
- [ ] Dodać Google Analytics (opcjonalnie)

## 🛠️ Technologie

- **HTML5** — semantyczny markup
- **CSS3** — zmienne, grid, flex, animacje, media queries
- **JavaScript (vanilla)** — bez zależności, bez frameworków
- **Google Fonts** — Cormorant Garamond + Source Sans 3

## 📜 Licencja

Treści: © Towarzystwo Miłośników Rydułtów
Kod: użyj jak chcesz, niczego nie obiecuję.
