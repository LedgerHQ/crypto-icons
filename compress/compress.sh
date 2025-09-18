#!/usr/bin/env bash
set -euo pipefail

INPUT_DIR="$(dirname "$0")"
OUTPUT_DIR="$INPUT_DIR/out"

mkdir -p "$OUTPUT_DIR"

shopt -s nullglob
png_files=("$INPUT_DIR"/*.png)
shopt -u nullglob

if [ ${#png_files[@]} -eq 0 ]; then
  echo "❌ No PNG files found in $INPUT_DIR. Please place your 144x144 PNGs at the root of this folder."
  exit 1
fi

for f in "${png_files[@]}"; do
  filename="$(basename "$f")"
  zopflipng -y -m --iterations=20 --filters=01234mepb "$f" "$OUTPUT_DIR/$filename"
done
