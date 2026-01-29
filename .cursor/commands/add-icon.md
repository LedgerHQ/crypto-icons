---
name: add-icon
description: Add a new cryptocurrency icon to the project with proper compression and mapping
---

# Add Icon

Guide user through adding a new cryptocurrency icon following the project's README.md guidelines.

## Prompt Variables

$TICKER

> The token ticker (will be used as PNG filename in UPPERCASE)
> Examples: USDC, BTC, PEPE, RSETH

$FETCH_LEDGER_IDS

> Should ledger IDs be fetched from Coinradar? yes | no
>
> - `yes`: Automatically fetch ledger IDs from Coinradar API
> - `no`: User will provide ledger IDs manually or they already exist in \_record.json

$SKIP_COMPRESSION

> Skip the compression step? yes | no
>
> - `yes`: File is already compressed and in assets/ folder
> - `no`: File needs to be compressed from compress/ folder (default)

$RUN_GENERATE_INDEX

> Run pnpm generate:index after updating? yes | no
>
> - `yes`: Automatically generate index.json (default)
> - `no`: Skip index generation (user will run manually)

## Instructions

**⚠️ Important:** All file paths in these instructions are relative to the workspace root. When running commands or checking files, ensure you're using paths from the workspace root or absolute paths to avoid confusion with relative paths.

### Step 1: Validate Prerequisites

According to README.md, the icon must meet these requirements:

**PNG File Requirements:**

- Size: 144x144 pixels
- Format: PNG
- Background: Required (no transparent background)
- Max size after compression: ≤50 KB (aim for smaller, 41 KB is already large)
- Naming: Use ticker or recognizable name (e.g., PEPE.png, USDC.png)

Inform the user of these requirements.

### Step 2: Fetch Ledger IDs (if requested)

If $FETCH_LEDGER_IDS is "yes":

1. Fetch top 1000 currencies from Coinradar:

   ```
   https://api.coinradar.ledger.com/v1/live/currencies?limit=1000&offset=0
   ```

2. Find the currency matching $TICKER (case-insensitive)

3. If found:
   - Extract `coinradarId`
   - Fetch detailed data:
     ```
     https://api.coinradar.ledger.com/v1/live/currency-nested/{coinradarId}
     ```
   - Extract all `ledgerId` values where `ledgerId !== null`
   - Store for later use

4. If not found:
   - Log warning: "Token not found in Coinradar API"
   - Continue without ledger IDs (user can add manually)

If $FETCH_LEDGER_IDS is "no":

- Skip this step
- Check if $TICKER already exists in `_record.json`

### Step 3: Prepare PNG File

The filename will be: `{$TICKER}.png` (uppercase)

**If $SKIP_COMPRESSION is "no" (default):**

1. Instruct user:

   ```
   Please add your PNG file to the compress/ folder:
   compress/{$TICKER}.png

   Requirements:
   - 144x144 pixels
   - PNG format with background
   - Named: {$TICKER}.png

   Type 'ready' when the file is in place.
   ```

2. Wait for user confirmation

3. Verify file exists at `compress/{$TICKER}.png` (use absolute path from workspace root)

4. Run compression:

   ```bash
   cd lib && pnpm compress
   ```

   **IMPORTANT:** The compression script outputs to `compress/out/{$TICKER}.png`, not `compress/`!

5. Verify compressed file exists:

   ```bash
   ls -lh compress/out/{$TICKER}.png
   ```

6. Move compressed file to assets:

   ```bash
   mv compress/out/{$TICKER}.png assets/{$TICKER}.png
   ```

   **Note:** Always use paths from the workspace root or absolute paths to avoid confusion.

7. Clean up source files:
   ```bash
   rm compress/{$TICKER}.png
   rmdir compress/out 2>/dev/null || true
   ```

**If $SKIP_COMPRESSION is "yes":**

1. Verify file exists at `assets/{$TICKER}.png`
2. If not found, error and exit

### Step 5: Verify File Size

Check the file size of `assets/{$TICKER}.png`:

```bash
ls -lh assets/{$TICKER}.png
```

**Note:** If the file is not found, ensure you're using the path from the workspace root, or use the absolute path to avoid confusion.

**Validation:**

- If ≤50 KB: ✅ "File size: {size} KB (within limit)"
- If >50 KB: ⚠️ "Warning: File exceeds 50 KB limit ({size} KB). Consider optimizing further."

### Step 6: Update \_record.json

1. Read `assets/_record.json`

2. Convert $TICKER to UPPERCASE

3. Check if entry exists:

   **If exists:**
   - Get existing IDs: `record[$TICKER].ids`
   - If we have new ledger IDs from Step 2:
     - Merge: `[...existingIds, ...newIds]`
     - Remove duplicates
     - Sort alphabetically
     - Update: `record[$TICKER].ids = mergedIds`
   - Log: "Updated existing entry for {$TICKER}"

   **If not exists:**
   - Create new entry: `record[$TICKER] = { ids: ledgerIds }`
   - Ensure alphabetical insertion in the JSON object
   - Log: "Created new entry for {$TICKER}"

4. Write updated record to `assets/_record.json`
   - Maintain alphabetical order of keys
   - Use 2-space indentation
   - Add newline at end of file

### Step 7: Generate Index

If $RUN_GENERATE_INDEX is "yes" (default):

```bash
cd lib && pnpm generate:index
```

This updates `assets/index.json` from `_record.json`.

If "no":

- Skip and remind user: "Remember to run: cd lib && pnpm generate:index"

### Step 8: Output Summary

Display completion message:

```
✅ Icon for {$TICKER} added successfully!

Files updated:
✓ assets/{$TICKER}.png ({size} KB)
✓ assets/_record.json
✓ assets/index.json

Ledger IDs: {count} total
```

### Step 9: Suggest Next Steps

Suggest running verification:

```
Next steps:
- Verify icon: node scripts/verify-icons.js
- View icon: open assets/{$TICKER}.png
```

## Example Execution

**Variables:**

- $TICKER: "PEPE"
- $FETCH_LEDGER_IDS: "yes"
- $SKIP_COMPRESSION: "no"
- $RUN_GENERATE_INDEX: "yes"

**Expected flow:**

```
🎨 Adding icon for PEPE...

Step 1: Fetching ledger IDs from Coinradar...
  ✓ Found: Pepe (PEPE)
  ✓ Fetched 3 ledger IDs

Step 2: Preparing PNG file...
  📝 Please add your PNG file to: compress/PEPE.png

  Requirements:
  - 144x144 pixels
  - PNG format with background
  - Named: PEPE.png

  Type 'ready' when the file is in place.

[User types: ready]

  ✓ File found at compress/PEPE.png
  🔄 Running compression...
  ✓ Compression complete (output: compress/out/PEPE.png)
  ✓ Verified compressed file
  ✓ Moved to assets/PEPE.png

Step 3: Verifying file size...
  ✓ File size: 28.4 KB (within 50 KB limit)

Step 4: Updating _record.json...
  ✓ Created new entry for PEPE
  ✓ Added 3 ledger IDs

Step 5: Generating index...
  🔄 Running pnpm generate:index...
  ✓ Index generated successfully

✅ Icon for PEPE added successfully!

Files updated:
✓ assets/PEPE.png (28.4 KB)
✓ assets/_record.json
✓ assets/index.json

Ledger IDs: 3 total
  - arbitrum/erc20/pepe
  - ethereum/erc20/pepe
  - linea/erc20/pepe

Next steps:
- Verify icon: node scripts/verify-icons.js
- View icon: open assets/PEPE.png
```

## Error Handling

**File not found after user confirmation:**

```
❌ Error: File not found at compress/PEPE.png
   Please ensure the file is in place and try again.
```

**Compression failed:**

```
❌ Error: Compression failed
   Reason: {error message}
   You may need to optimize the source file manually.
```

**File too large:**

```
⚠️  Warning: File size is 68.2 KB (exceeds 50 KB limit)
   The icon was added, but consider re-optimizing the source file.
   Aim for <50 KB (ideally much smaller).
```

**Token not found in Coinradar:**

```
⚠️  Warning: PEPE not found in Coinradar API
   Icon will be added without ledger IDs.
   You can add them manually to _record.json later.
```

**generate:index failed:**

```
❌ Error: Failed to generate index
   Reason: {error message}
   You can run it manually: cd lib && pnpm generate:index
```

## Notes

- PNG filename becomes the key in `_record.json` (without .png extension)
- All tickers are converted to UPPERCASE for consistency
- Compression is done via `pnpm compress` which:
  - Reads from `compress/` folder
  - Outputs compressed files to `compress/out/` folder
  - Files must then be moved from `compress/out/` to `assets/`
- The verification script (`scripts/verify-icons.js`) validates file sizes and ledger IDs
- Storybook shows production icons only, so new icons won't appear in storybook branches
- If design/UX help is needed for the icon, user should contact the design or WXP team
- Always use paths from workspace root or absolute paths when verifying file locations
