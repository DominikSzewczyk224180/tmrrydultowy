# Towarzystwo Miłośników Rydułtów — strona internetowa

Nowa strona dla TMR. Single-page (one-page) HTML/CSS/JS, zoptymalizowana pod GitHub Pages.

## 🏗️ Struktura projektu

```
tmr-rydultowy/
├── index.html          ← strona główna (one-page)
├── css/
│   └── style.css       ← cały styl strony
├── js/
│   └── main.js         ← interaktywność + auto-load Kluki z GitHub
├── img/
│   ├── herb-tmr.png        ← herb TMR (do nawigacji, favicon)
│   ├── herb-tmr-large.png  ← duży herb (do hero)
│   └── galeria/            ← zdjęcia z wydarzeń
├── pdf/
│   └── kluka/          ← TUTAJ wrzucasz numery gazety w PDF
├── README.md
└── .gitignore
```

## 🚀 Uruchomienie lokalnie

Otwórz `index.html` w przeglądarce. Albo lepiej — uruchom mały serwer:

```bash
# Python 3
python3 -m http.server 8000

# Node.js
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
4. Strona pojawi się pod adresem `https://TWOJ-USER.github.io/tmr-rydultowy/`.

## 📚 Auto-load Kluki — najważniejsze!

Strona ma **automatyczne ładowanie listy Kluki** z GitHuba. Wrzucasz PDFy do folderu `pdf/kluka/` na GitHub i strona sama wyświetla je w archiwum — **bez edytowania HTMLa**.

### Krok 1: Skonfiguruj `js/main.js`

Otwórz `js/main.js`, znajdź na początku blok:

```javascript
const GITHUB_CONFIG = {
    user: '',                  // ← wpisz tutaj swój GitHub username
    repo: 'tmr-rydultowy',
    branch: 'main',
    pdfPath: 'pdf/kluka',
    cacheMinutes: 30
};
```

Wpisz tam **swojego GitHub username** (np. `'jankowalski'`). Zapisz, push.

### Krok 2: Nazwy plików PDF

Pliki w `pdf/kluka/` muszą mieć ścisły format nazwy:

```
KlukaMIESIAC ROK.pdf
```

**Przykłady:**
- `KlukaStyczen2026.pdf`
- `KlukaLuty2026.pdf`
- `KlukaMarzec2026.pdf`
- `KlukaGrudzien2025.pdf`

**⚠️ WAŻNE:** Nazwy miesięcy **bez polskich znaków**:

| Plik         | Wyświetli się jako |
|--------------|-------------------|
| Styczen      | Styczeń           |
| Luty         | Luty              |
| Marzec       | Marzec            |
| Kwiecien     | Kwiecień          |
| Maj          | Maj               |
| Czerwiec     | Czerwiec          |
| Lipiec       | Lipiec            |
| Sierpien     | Sierpień          |
| Wrzesien     | Wrzesień          |
| Pazdziernik  | Październik       |
| Listopad     | Listopad          |
| Grudzien     | Grudzień          |

### Krok 3: Push i koniec!

```bash
git add pdf/kluka/KlukaMarzec2026.pdf
git commit -m "Dodano marcową Klukę"
git push
```

Strona po max 30 minutach (cache) sama pokaże nową Klukę. Jeśli chcesz natychmiast — w przeglądarce `Ctrl+F5` (hard refresh).

### Co robi auto-load?

JavaScript pobiera listę plików z GitHuba przez ich publiczne API:
```
https://api.github.com/repos/USER/REPO/contents/pdf/kluka
```

Następnie:
1. Filtruje pliki `.pdf` z prefixem `Kluka`
2. Parsuje miesiąc i rok z nazwy
3. Grupuje po latach (najnowszy rok rozwinięty domyślnie)
4. Sortuje miesiące malejąco (od najnowszego)
5. Cache w sessionStorage (30 min) żeby nie wybijać limitu API (60 req/h)

Jeśli auto-load **nie zadziała** (np. nie wpisałeś usera) — zostaje wyświetlona lista z HTML jako fallback.

## ✏️ Inne zmiany w treści

### Aktualności (klikalne karty)
W `index.html` znajdź `<!-- ===== AKTUALNOŚCI ===== -->`. Skopiuj blok `<article class="news-item">`, zmień:
- `data-news="cos"` (unikalna nazwa)
- `news-tag` (Ważne / Zespół / itd.)
- `news-date-text`, `news-title`, `news-excerpt`
- Treść w `news-body-inner` z gridem `news-info-grid` na 2-4 bloki info

### Galeria — dodaj kolejne wydarzenie
W sekcji `<!-- ===== GALERIA ===== -->` skopiuj cały `<div class="gallery-event">`, zmień:
- numer (`gallery-event-number`: 04, 05, ...)
- tytuł (`gallery-event-title`)
- linki/atrybuty `data-caption` w `<a class="gallery-item">`

Zdjęcia wrzuć do `img/galeria/`.

### Logotypy partnerów
W `img/` umieść logotypy (np. `partner-cieplownia.png`). W sekcji `<!-- ===== PARTNERZY ===== -->`:
```html
<a href="https://strona-partnera.pl" class="partner-card" target="_blank" rel="noopener">
    <img src="img/partner-cieplownia.png" alt="Ciepłownia">
</a>
```

## 🎨 Customizacja kolorów

Wszystkie kolory w zmiennych CSS na początku `css/style.css`:

```css
:root {
    --blue-primary: #417bb8;       /* jasny niebieski z logo */
    --blue-deep: #1E4A8A;          /* ciemniejszy do tła */
    --blue-darkest: #143862;       /* najciemniejszy do stopki */
    --yellow-pastel: #f8e45d;      /* żółty z logo */
    /* ... */
}
```

Zmień raz tutaj — zmieni się wszędzie.

## 📋 Co zostało (TODO)

- [ ] Skonfigurować `GITHUB_CONFIG.user` w `js/main.js`
- [ ] Wgrać prawdziwe numery gazety Kluka (PDF) do `pdf/kluka/` z odpowiednimi nazwami
- [ ] Wgrać `pdf/Regulamin-BUL.pdf`
- [ ] Wrzucić logotypy partnerów do `img/` i podmienić placeholdery w HTML
- [ ] Dodać własną domenę (opcjonalnie — `tmrrydultowy.pl`)

### Własna domena (np. `tmrrydultowy.pl`)

1. W folderze projektu utwórz plik `CNAME` z zawartością:
   ```
   tmrrydultowy.pl
   ```
2. U dostawcy domeny ustaw rekordy DNS:
   - **Typ A** → `185.199.108.153`
   - **Typ A** → `185.199.109.153`
   - **Typ A** → `185.199.110.153`
   - **Typ A** → `185.199.111.153`
3. W Settings → Pages → Custom domain wpisz `tmrrydultowy.pl` i włącz Enforce HTTPS.

## 🛠️ Technologie

- **HTML5** — semantyczny markup
- **CSS3** — zmienne, grid, flex, animacje, media queries
- **JavaScript (vanilla)** — bez bibliotek, bez frameworków
- **Google Fonts** — Spectral + Manrope
- **GitHub Contents API** — auto-load listy Kluki

## 📜 Licencja

Treści: © Towarzystwo Miłośników Rydułtów
Kod: użyj jak chcesz.
