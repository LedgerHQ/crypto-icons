---
name: update-ledger-ids
description: Synchronizes ledger IDs for cryptocurrency tokens from Ledger's mapping API into the project's _record.json file. Use when the user asks to update, sync, or add ledger IDs for specific token tickers (like USDC, USDT, BTC, ETH) or mentions updating the record file with API data.
---

# Update Ledger IDs

Automatically syncs cryptocurrency token ledger IDs from Ledger's Coingecko mapping API into `assets/_record.json`.

## When to Use

- User provides token ticker(s) and asks to update ledger IDs
- User mentions syncing with Ledger API
- User asks to add missing ledger IDs for specific tokens

## Process

### 1. Fetch API Data

Use the Ledger Coingecko mapping API to get all assets:
```
https://mapping-service.api.ledger.com/v1/coingecko/mapped-assets
```

This endpoint returns all mapped assets with their ledger IDs and provider IDs. No pagination needed.

**Important**: All ledger IDs sharing the same `providerId` should use the same icon.

### 2. Read Current State

Load `assets/_record.json` to see existing mappings.

### 3. Find Matching Assets

The API returns an array of asset objects. Each object has:
- `ledgerId` - The unique ledger ID (e.g., `"ethereum/erc20/usd__coin"`)
- `providerId` - The grouping identifier (e.g., `"usd-coin"`)
- `ticker` - The token ticker (e.g., `"USDC"`)
- `name` - The full name
- `network` - The blockchain network
- `data.img` - Direct URL to the icon image

**Key Concept**: Assets with the same `providerId` share the same icon and should be grouped together.

### 4. Match Token to Provider ID

When the user provides a ticker (e.g., "USDC"):

1. Search the API response for assets matching the ticker (case-insensitive)
2. Identify the `providerId` for this ticker:
   - For most tokens, there's one main `providerId` (e.g., "usd-coin" for USDC)
   - Some tokens may have multiple `providerId` groups (e.g., wrapped versions, protocol-specific versions)
3. Determine which `providerId` to use:
   - If there's only one `providerId` for the ticker, use it
   - If multiple exist, prefer the one with the most ledger IDs or matches the standard version
   - Common examples:
     - USDC → `providerId: "usd-coin"` (31 ledger IDs)
     - AAVE → `providerId: "aave"` (9 ledger IDs)
     - 1INCH → `providerId: "1inch"` (3 ledger IDs)

### 5. Extract All Ledger IDs for Provider

Once you've identified the correct `providerId`, collect ALL `ledgerId` values from assets with that `providerId`.

Example for USDC with `providerId: "usd-coin"`:
```json
[
  "algorand/asa/31566704",
  "aptos/fungible_asset/usdc_0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b",
  "arbitrum/erc20/usd_coin",
  "base/erc20/usd_coin",
  "ethereum/erc20/usd__coin",
  "solana/spl/epjfwdd5aufqssqem2qn1xzybapc8g4weggkzwytdt1v",
  ...
]
```

### 6. Merge with Existing

- Keep all existing IDs from `_record.json`
- Add new IDs from API
- Remove duplicates
- Sort alphabetically

### 7. Update File

Replace the token's `ids` array in `assets/_record.json` with the merged list.

## File Format

`assets/_record.json` structure:
```json
{
  "TOKEN_TICKER": {
    "ids": [
      "network/standard/token_identifier",
      "another_network/standard/token_identifier"
    ]
  }
}
```

## Examples

**User request:** "Met à jour les ledger IDs pour USDC"

**Steps:**
1. Fetch `https://mapping-service.api.ledger.com/v1/coingecko/mapped-assets`
2. Load `assets/_record.json`
3. Search for assets with ticker "USDC" (case-insensitive)
4. Identify main `providerId` (likely "usd-coin")
5. Extract all `ledgerId` values for assets with `providerId: "usd-coin"`
6. Merge with existing IDs in "USDC" entry
7. Update file with sorted, deduplicated list

**User request:** "Ajoute les ledger IDs manquants pour AAVE et 1INCH"

**Steps:**
1. Fetch API data
2. Load `assets/_record.json`
3. Find assets with ticker "AAVE" → `providerId: "aave"` → collect all ledger IDs
4. Find assets with ticker "1INCH" → `providerId: "1inch"` → collect all ledger IDs
5. Merge with existing IDs for "AAVE" and "1INCH" entries
6. Update file

## Edge Cases

**Token not in API**: Inform user that the token wasn't found in the Ledger mapping API response.

**Token not in _record.json**: Ask user if they want to create a new entry with the ticker name (UPPERCASE).

**Multiple provider IDs for one ticker**: 
- Show the user the different `providerId` options found
- Ask which one to use, or use the one with most ledger IDs
- Example: USDC has `providerId` like "usd-coin", "axlusdc", "fluid-usdc", etc.

**No new IDs**: Inform user that the token is already up to date.

## Important Notes

- Token tickers in `_record.json` use UPPERCASE
- Always preserve existing IDs
- Sort final list alphabetically for consistency
- Maintain JSON formatting with 2-space indentation
- The API endpoint is production: `mapping-service.api.ledger.com`
- All assets sharing the same `providerId` should use the same icon
- The `data.img` field can be used to download icons if needed
- Native blockchain currencies (BTC, ETH, SOL) might not have a providerId in this API
