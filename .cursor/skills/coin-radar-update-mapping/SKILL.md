---
name: coin-radar-update-mapping
description: Updates ledger ID mappings using Ledger's Coinradar API to sync the top cryptocurrencies. Use when the user asks to update mappings from Coinradar, sync top tokens, or mentions the Coinradar API.
---

# Coin Radar Update Mapping

Automatically syncs cryptocurrency token ledger IDs from Ledger's Coinradar API into `assets/_record.json`. This approach fetches the top tokens by market cap and their complete ledger ID mappings.

## When to Use

- User asks to update mappings from Coinradar
- User wants to sync the top N tokens (e.g., "top 50", "top 100")
- User mentions using the Coinradar API
- User wants to update multiple tokens at once based on market rank

## Process

### 1. Fetch Top Currencies List

Use the Coinradar currencies endpoint to get the top tokens by market cap:

```
https://api.coinradar.ledger.com/v1/live/currencies?limit=50&offset=0
```

**Parameters:**
- `limit` - Number of tokens to fetch (start with 50, max 1000)
- `offset` - Pagination offset (use 0 to start from the top)

**Response structure:**
```json
[
  {
    "name": "Bitcoin",
    "ticker": "BTC",
    "rank": 1,
    "image": "https://proxycgassets.api.live.ledger.com/coins/images/1/large/bitcoin.png",
    "coinradarId": "672de245673914b8252e64fae57cf88d56cb930e18f172e96498e0041970e127",
    "supported": true,
    "swap": true,
    "buy": true,
    "currencies": null
  }
]
```

**Key field:** `coinradarId` - Use this to fetch detailed ledger IDs for each token.

### 2. Fetch Ledger IDs for Each Token

For each `coinradarId` from step 1, call the nested currency endpoint:

```
https://api.coinradar.ledger.com/v1/live/currency-nested/{coinradarId}
```

**Response structure:**
```json
{
  "name": "Tether USD",
  "ticker": "USDT",
  "rank": 3,
  "image": "https://proxycgassets.api.live.ledger.com/coins/images/325/large/Tether.png",
  "coinradarId": "b19f92c398a6f639793b7a21cb678d75c4d8383f9fa4bf2bbc5afb4e212e57c7",
  "currencies": [
    {
      "name": "Tether USD",
      "ticker": "USDT",
      "network": "ethereum",
      "contract": "0xdac17f958d2ee523a2206206994597c13d831ec7",
      "ledgerId": "ethereum/erc20/usd_tether__erc20_",
      "supported": true
    },
    {
      "name": "Tether USD",
      "ticker": "USDT",
      "network": "bsc",
      "contract": "0x55d398326f99059ff775485246999027b3197955",
      "ledgerId": "bsc/bep20/binance-peg_bsc-usd",
      "supported": true
    }
  ]
}
```

### 3. Extract All Ledger IDs

From the `currencies` array, extract all `ledgerId` values (ignore entries where `ledgerId` is null).

**Important Rule:** All ledger IDs returned for a single `coinradarId` should use the same icon/image, with the following exceptions:
- **L1 and L2 exceptions:** Base, Optimism, Arbitrum, and other Layer 1/Layer 2 networks may have their own specific icons
- For most tokens, all networks share the same icon
- The `image` field from the parent object provides the standard icon URL

### 4. Read Current State

Load `assets/_record.json` to see existing mappings.

### 5. Match or Create Token Entry

For each token from the API:

1. Look for an existing entry in `_record.json` using the ticker (UPPERCASE)
2. If found, prepare to merge ledger IDs
3. If not found, prepare to create a new entry with the ticker in UPPERCASE

### 6. Merge Ledger IDs

For each token:
- Keep all existing IDs from `_record.json`
- Add new IDs from the Coinradar API
- Remove duplicates
- Sort alphabetically

### 7. Update File

Update `assets/_record.json` with the merged ledger ID lists for all processed tokens.

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

**User request:** "Update les mappings pour les top 50 tokens avec Coinradar"

**Steps:**
1. Fetch `https://api.coinradar.ledger.com/v1/live/currencies?limit=50&offset=0`
2. For each token in the response:
   - Extract `coinradarId` and `ticker`
   - Fetch `https://api.coinradar.ledger.com/v1/live/currency-nested/{coinradarId}`
   - Extract all `ledgerId` values from the `currencies` array
3. Load `assets/_record.json`
4. For each token:
   - Find or create entry for the ticker (UPPERCASE)
   - Merge new ledger IDs with existing ones
   - Sort and deduplicate
5. Update `assets/_record.json` with all changes
6. Report summary: how many tokens processed, how many updated, how many created

**User request:** "Sync BTC, ETH, and USDT from Coinradar"

**Steps:**
1. Fetch `https://api.coinradar.ledger.com/v1/live/currencies?limit=100&offset=0`
2. Filter the response to only BTC, ETH, and USDT by ticker
3. For each of these 3 tokens:
   - Extract `coinradarId`
   - Fetch nested currency data
   - Extract all ledger IDs
4. Load `assets/_record.json`
5. Merge ledger IDs for "BTC", "ETH", and "USDT" entries
6. Update file

## Edge Cases

**Token not in Coinradar API**: Inform user that the token wasn't found in the top N tokens from Coinradar.

**Token not in _record.json**: Create a new entry with the ticker in UPPERCASE.

**No new IDs**: Inform user that the token already has all ledger IDs from Coinradar.

**Null ledgerId**: Skip entries where `ledgerId` is null in the currencies array.

**API rate limiting**: If processing many tokens, consider adding small delays between requests.

**Large limit values**: Start with limit=50 for testing. Can go up to 1000 for full sync.

## Important Notes

- Token tickers in `_record.json` use UPPERCASE
- Always preserve existing IDs from `_record.json`
- Sort final list alphabetically for consistency
- Maintain JSON formatting with 2-space indentation
- The API endpoint is production: `api.coinradar.ledger.com`
- All ledger IDs for the same `coinradarId` share the same icon (except L1/L2 exceptions)
- The `image` field provides the direct URL to the token's icon
- Skip any currency entries where `ledgerId` is null
- Process tokens in order of their market cap rank
- Consider fetching in batches (e.g., 50 at a time) for large syncs

## Performance Tips

- Start with small limits (50) for testing
- For full sync, can use limit=1000 but will take longer
- Show progress to user (e.g., "Processing token 10/50: USDC")
- Batch write to `_record.json` at the end rather than per-token
