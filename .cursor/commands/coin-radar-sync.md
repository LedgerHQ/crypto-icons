---
name: coin-radar-sync
description: Sync ledger IDs from Coinradar API into _record.json
---

# Sync Coinradar

Sync cryptocurrency ledger IDs from Ledger's Coinradar API into `assets/_record.json`.

## Prompt Variables

$SYNC_MODE

> Choose sync mode: top-N | specific
> - `top-N`: Sync top N tokens by market cap (e.g., top-50, top-100)
> - `specific`: Sync specific token tickers (e.g., USDC, BTC ETH USDT)

$TOKENS

> If $SYNC_MODE is "top-N": Number of top tokens (e.g., 50, 100, 200)
> If $SYNC_MODE is "specific": Space-separated token tickers (e.g., USDC BTC ETH)

## Instructions

### Step 1: Determine Sync Mode

Parse the prompt variables to determine what to sync:

- If $SYNC_MODE is "top-N": Sync top $TOKENS tokens
- If $SYNC_MODE is "specific": Sync the specific tickers in $TOKENS

### Step 2: Fetch Currency List

Fetch the top currencies from Coinradar API:

```
https://api.coinradar.ledger.com/v1/live/currencies?limit={limit}&offset=0
```

**Limit values:**
- For top-N mode: Use $TOKENS as limit (max 1000)
- For specific mode: Use 1000 to ensure all tokens are available

### Step 3: Filter Tokens (if specific mode)

If $SYNC_MODE is "specific":
1. Parse $TOKENS into array of tickers (e.g., ["USDC", "BTC", "ETH"])
2. Filter the API response to only include currencies with matching tickers (case-insensitive)
3. If any ticker not found, log a warning

### Step 4: Fetch Ledger IDs for Each Token

For each currency in the list:

1. Extract `coinradarId` and `ticker`
2. Fetch detailed currency data:
   ```
   https://api.coinradar.ledger.com/v1/live/currency-nested/{coinradarId}
   ```
3. Extract all `ledgerId` values from the `currencies` array
4. Skip any entries where `ledgerId` is null
5. Store: `{ ticker, ledgerIds }`

**Important**: All ledger IDs from the same `coinradarId` share the same icon (except L1/L2 exceptions like Base, Optimism, Arbitrum).

### Step 5: Load Current Mappings

Read `assets/_record.json`:

```bash
cat assets/_record.json
```

Parse the JSON into memory.

### Step 6: Merge Ledger IDs

For each token processed:

1. Convert ticker to UPPERCASE
2. Check if entry exists in `_record.json`
3. If exists:
   - Get existing IDs from `record[TICKER].ids`
   - Merge with new IDs: `[...existingIds, ...newIds]`
   - Remove duplicates
   - Sort alphabetically
4. If not exists:
   - Create new entry: `{ "TICKER": { "ids": [newIds] } }`
5. Track stats: how many tokens updated, how many new IDs added

### Step 7: Save Updated Mappings

Write the updated record back to `assets/_record.json`:

- Maintain alphabetical order of keys
- Use 2-space indentation
- Add newline at end of file

### Step 8: Generate Index

Run the index generation command:

```bash
cd lib && pnpm generate:index
```

This updates `assets/index.json` from `_record.json`.

### Step 9: Output Summary

Display a summary:

```
✅ Sync complete!

Processed: {N} tokens
Updated: {M} tokens
New ledger IDs added: {X}

Files updated:
- assets/_record.json
- assets/index.json
```

## Example Executions

### Example 1: Top 50 tokens

**Variables:**
- $SYNC_MODE: "top-N"
- $TOKENS: "50"

**Expected output:**
```
🔄 Syncing top 50 tokens from Coinradar...

[1/50] BTC (Bitcoin)
  ✓ Found 1 ledger ID
  ✓ Added 0 new (already up to date)

[2/50] ETH (Ethereum)
  ✓ Found 1 ledger ID
  ✓ Added 0 new (already up to date)

[3/50] USDT (Tether USD)
  ✓ Found 20 ledger IDs
  ✓ Added 2 new

...

✅ Sync complete!

Processed: 50 tokens
Updated: 12 tokens
New ledger IDs added: 47
```

### Example 2: Specific tokens

**Variables:**
- $SYNC_MODE: "specific"
- $TOKENS: "USDC BTC ETH"

**Expected output:**
```
🔄 Syncing specific tokens: USDC, BTC, ETH

[1/3] USDC (USD Coin)
  ✓ Found 31 ledger IDs
  ✓ Added 1 new

[2/3] BTC (Bitcoin)
  ✓ Found 1 ledger ID
  ✓ Added 0 new (already up to date)

[3/3] ETH (Ethereum)
  ✓ Found 1 ledger ID
  ✓ Added 0 new (already up to date)

✅ Sync complete!

Processed: 3 tokens
Updated: 1 token
New ledger IDs added: 1
```

## Error Handling

**Token not found in API:**
```
⚠️ Warning: PEPE not found in Coinradar API
   Skipping...
```

**API request failed:**
```
❌ Error: Failed to fetch from Coinradar API
   Reason: {error message}
   Stopping sync...
```

**Invalid limit:**
```
❌ Error: Invalid limit value: {value}
   Must be between 1 and 1000
```

## Notes

- Maximum limit for Coinradar API is 1000 tokens
- All tokens with the same `coinradarId` should share the same icon
- The ticker from the API is converted to UPPERCASE for consistency
- Ledger IDs are always sorted alphabetically in the output
- The command automatically runs `pnpm generate:index` after updating
