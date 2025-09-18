# Icon Compression

This folder is used to **optimize new icons** before adding them to the project.

## Usage

1. Place your **144×144 PNG icons** in this folder.
2. Run:
   ```bash
   pnpm compress
   ```
3. Optimized files will be output to `/compress/out/`.

⚠️ _The compression algorithm is very thorough and can be quite slow, especially when processing multiple files._
