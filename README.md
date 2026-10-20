# PetPal (HTML refactor)

This is the Stage 24 working package of the PetPal HTML app. It is intended to be run locally in a browser; it is not a replacement for the untouched production source file.

## Run locally (Windows)

1. Extract this folder to your working directory, for example `E:\Documents\petpal\refactor`.
2. Open PowerShell or Command Prompt in the folder containing `index.html`.
3. Start a local web server:

   ```powershell
   python -m http.server 8000
   ```

4. Open `http://localhost:8000/` in your browser. If you put the folder inside another directory, include that directory in the URL.
5. To stop the server, press `Ctrl+C` in the terminal.

Do not rely on opening `index.html` directly with `file://`; relative assets and browser storage behave more predictably over localhost.

## Before using real family data

- Keep a separate untouched copy of the production HTML and a backup of the browser's PetPal data.
- Test in a separate browser profile or browser storage context first.
- Open Developer Tools (F12) → Console and check for missing module files, uncaught errors, and failed asset requests.
- Run the checklist in [`PETPAL_PROJECT_BASELINE.md`](PETPAL_PROJECT_BASELINE.md).

## Project notes

- `index.html` is the current Stage 24 HTML entry point.
- `modules/` contains extracted classic scripts. They deliberately use classic script loading and preserve script order; do not convert them to ES modules or wrap globals without a verified migration plan.
- `assets/gus/hats/` contains custom hat SVG artwork.
- `tests/` contains manual verification guidance.
- `PETPAL_PROJECT_BASELINE.md` is the source-of-truth guide for architecture, invariants, and recovery.

**Important:** This package is a refactor checkpoint, not proof that every browser workflow has been regression-tested. The most recent explicit user test confirmation was that Stage 18 hat unlocking/display worked; Stage 24's daily target extraction passed static checks but still needs full browser regression testing.
