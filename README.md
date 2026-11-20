# German Learner — Netzwerk neu A1 & A2

A responsive Bengali/German vocabulary-learning website inspired by the visible layout and feature set of the reference site. This is a fresh implementation; it does not include the original site's source code, private assets, or textbook vocabulary database.

## Files
- `index.html` — page structure
- `style.css` — responsive styling
- `app.js` — flashcards, quizzes, search, progress, local backup and settings
- `words.js` — your vocabulary dataset

## Run locally
Open `index.html` in a modern browser. For development, use VS Code Live Server.

## Add vocabulary
Edit `words.js` and add entries to `window.WORDS`:

```js
window.WORDS = [
  {level:"A1", chapter:1, word:"das Buch", article:"das", meaning:"বই", pronunciation:"দাস বুখ"},
  {level:"A1", chapter:1, word:"Hallo", article:"", meaning:"হ্যালো / নমস্কার", pronunciation:"হালো"}
];
```

Use `level` as `A1` or `A2`, and `chapter` from 1 to 12. The app stores progress in the browser's localStorage. Export your progress from the settings panel before changing browsers/devices.

## Publish on GitHub Pages
1. Create a new repository on GitHub.
2. Upload all four files to the repository root.
3. Open **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then Save.
6. Wait for the Pages URL to appear.

Google Fonts are loaded from Google Fonts when online; the site otherwise uses fallback fonts.
