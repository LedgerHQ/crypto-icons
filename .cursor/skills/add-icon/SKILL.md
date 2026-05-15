---
name: add-icon
description: >-
  Add new crypto icon(s) to the project: compress PNGs, update _record.json,
  regenerate index, and open a PR. Use when the user says /add-icon, asks to add
  a crypto icon, or wants to register a new token icon.
---

# Add Icon

Add one or more crypto icons to the repository, end-to-end.

## Step 1 — Gather inputs

Use the **AskQuestion** tool to collect:

1. **Icon file path(s)** — absolute path or `~/`-relative path to each 144×144 PNG.
2. **Ledger ID(s)** — one or more ledger IDs per icon (e.g. `hyperevm/erc20/token_name_0xaddress`).
3. **Ticker / record key** — short uppercase key used as the PNG filename and `_record.json` key (e.g. `KHYPE`). If not provided, infer from the filename.

Present one question per icon if multiple icons are being added at once; otherwise batch into a single prompt.

## Step 2 — Copy to compress folder

```bash
cp <source_png> compress/<TICKER>.png
```

Repeat for each icon.

## Step 3 — Compress

```bash
cd lib && pnpm compress
```

This runs `zopflipng` on every PNG in `compress/`. It can be slow.

After compression, verify each output in `compress/out/` is **≤ 50 KB**.

## Step 4 — Move to assets

```bash
cp compress/out/<TICKER>.png assets/<TICKER>.png
```

## Step 5 — Update `_record.json`

Open `assets/_record.json` and insert a new entry **in alphabetical order**:

```json
"<TICKER>": {
  "ids": [
    "<ledger_id_1>",
    "<ledger_id_2>"
  ]
}
```

Keep the file sorted by key.

## Step 6 — Regenerate index

```bash
cd lib && pnpm generate:index
```

Confirm the new entries appear in `assets/index.json`.

## Step 7 — Clean up

Remove the working files from the compress folder:

```bash
rm compress/<TICKER>.png compress/out/<TICKER>.png
```

## Step 8 — Create a PR

1. Create a branch: `git checkout -b feat/add-<ticker(s)>-icon`.
2. Stage `assets/<TICKER>.png`, `assets/_record.json`, and `assets/index.json`.
3. Commit with message: `feat: add <TICKER> icon(s)`.
4. Push and open a PR via `gh pr create`.

The repo has a PR template at `.github/PULL_REQUEST_TEMPLATE.md`. Fill it in:

- **Summary**: one line per icon — `Add <TICKER> icon (<Full Name>) — <ledger_id>`
- **Checklist**: tick every box (`[x]`) since all steps were completed.
