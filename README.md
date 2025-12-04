# crypto-icons

Provide crypto icons assets by ledgerId

## Disclaimer

Some of the icons provided are trademarks: they are the property of their respective owners.

## @ledgerhq/crypto-icons

See @ledgerhq/crypto-icons library README here: [lib/README.md](lib/README.md)

## How to upload a new icon

### Prerequisites

- Find the ledgerIds of the coin on various networks using [CoinRadar](https://coinradar.ledger.com/)
- Prepare a 144x144 PNG file with a background (no transparent background). If in doubt, contact the design team or WXP team
- Use a recognizable name for the PNG file (ticker or coin name)

### Compress the images

1. Add the PNG files to the `compress/` folder
2. Run `pnpm compress` from the `lib` folder
3. Move the compressed files to the `assets/` folder

### Mapping

Add the ledgerIds in `assets/_record.json` following this structure:

```json
"{png_file_name}": {
  "ids": [
    "{first_ledger_id}",
    "{second_ledger_id}"
  ]
}
```

Then run `pnpm generate:index` to update the mapping in `assets/index.json`.

### Note

Storybook relies on the icons already in production, so if you don't see your icon in your storybook branch, that's expected.
