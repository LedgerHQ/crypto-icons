#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const https = require("https");

const API_BASE_URL = "https://crypto-assets-service.api.ledger.com/v1";
const TOKENS_ENDPOINT = `${API_BASE_URL}/tokens`;
const CURRENCIES_ENDPOINT = `${API_BASE_URL}/currencies`;

const DEFAULT_MAX_FILE_SIZE_KB = 50;

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Read the index.json file
function getMapping() {
  const indexPath = path.join(__dirname, "..", "assets", "index.json");
  const indexContent = fs.readFileSync(indexPath, "utf-8");
  return JSON.parse(indexContent);
}

// Check if icon file exists
function iconFileExists(iconFileName) {
  const iconPath = path.join(__dirname, "..", "assets", iconFileName);
  return fs.existsSync(iconPath);
}

// Get file size in bytes
function getFileSize(iconFileName) {
  const iconPath = path.join(__dirname, "..", "assets", iconFileName);
  try {
    const stats = fs.statSync(iconPath);
    return stats.size;
  } catch (e) {
    return null;
  }
}

// Check if file size exceeds maximum
function checkFileSize(iconFileName, maxSizeKB) {
  const sizeBytes = getFileSize(iconFileName);
  if (sizeBytes === null) {
    return { valid: false, size: null, error: "File not found" };
  }
  const sizeKB = sizeBytes / 1024;
  const maxSizeBytes = maxSizeKB * 1024;
  return {
    valid: sizeBytes <= maxSizeBytes,
    size: sizeKB,
    sizeBytes,
    maxSize: maxSizeKB,
  };
}

// Determine if an ID is a currency (native chain) or a token
// Currencies typically don't have slashes, tokens have format like "chain/type/name"
function isCurrency(id) {
  // If it doesn't contain a slash, it's likely a currency
  // Some exceptions might exist, but this is the general pattern
  return !id.includes("/");
}

// Validate ID against backend API
function validateId(id) {
  return new Promise((resolve) => {
    const encodedId = encodeURIComponent(id);
    // Use currencies endpoint for native chains, tokens endpoint for tokens
    const endpoint = isCurrency(id) ? CURRENCIES_ENDPOINT : TOKENS_ENDPOINT;
    const url = `${endpoint}?id=${encodedId}&limit=1&output=id`;

    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          if (res.statusCode === 200) {
            try {
              const json = JSON.parse(data);
              // Check if the response contains the currency/token
              const isValid =
                json &&
                (Array.isArray(json)
                  ? json.length > 0
                  : Object.keys(json).length > 0);
              resolve({
                valid: isValid,
                statusCode: res.statusCode,
                error: null,
                endpoint: isCurrency(id) ? "currencies" : "tokens",
              });
            } catch (e) {
              resolve({
                valid: false,
                statusCode: res.statusCode,
                error: `Failed to parse response: ${e.message}`,
              });
            }
          } else {
            resolve({
              valid: false,
              statusCode: res.statusCode,
              error: `HTTP ${res.statusCode}`,
            });
          }
        });
      })
      .on("error", (err) => {
        resolve({ valid: false, statusCode: null, error: err.message });
      });
  });
}

// Validate all entries with rate limiting
async function validateAll(
  concurrency = 5,
  maxFileSizeKB = DEFAULT_MAX_FILE_SIZE_KB
) {
  const mapping = getMapping();
  const entries = Object.entries(mapping);
  const total = entries.length;

  log(`\nValidating ${total} icon mappings...\n`, "blue");
  log(`Max file size: ${maxFileSizeKB} KB\n`, "blue");

  const results = {
    missingFiles: [],
    invalidIds: [],
    oversizedFiles: [],
    apiErrors: [],
    valid: 0,
  };

  // Process entries in batches to avoid overwhelming the API
  for (let i = 0; i < entries.length; i += concurrency) {
    const batch = entries.slice(i, i + concurrency);
    const promises = batch.map(async ([id, { icon }]) => {
      const issues = [];

      // Check if icon file exists
      if (!iconFileExists(icon)) {
        issues.push("missing_file");
        results.missingFiles.push({ id, icon });
      } else {
        // Check file size if file exists
        const sizeCheck = checkFileSize(icon, maxFileSizeKB);
        if (!sizeCheck.valid) {
          issues.push("oversized_file");
          results.oversizedFiles.push({
            id,
            icon,
            size: sizeCheck.size,
            maxSize: sizeCheck.maxSize,
          });
        }
      }

      // Validate ID against API
      const apiResult = await validateId(id);
      if (!apiResult.valid) {
        issues.push("invalid_id");
        results.invalidIds.push({
          id,
          icon,
          statusCode: apiResult.statusCode,
          error: apiResult.error,
        });
      }

      if (apiResult.error && apiResult.statusCode !== 404) {
        results.apiErrors.push({ id, error: apiResult.error });
      }

      if (issues.length === 0) {
        results.valid++;
      }

      return { id, icon, issues };
    });

    const batchResults = await Promise.all(promises);

    // Progress indicator
    const processed = Math.min(i + concurrency, entries.length);
    process.stdout.write(
      `\rProgress: ${processed}/${total} (${Math.round(
        (processed / total) * 100
      )}%)`
    );
  }

  process.stdout.write("\n\n");

  return results;
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const concurrency = args.includes("--concurrency")
    ? parseInt(args[args.indexOf("--concurrency") + 1]) || 5
    : 5;

  const maxFileSizeKB = args.includes("--max-size")
    ? parseFloat(args[args.indexOf("--max-size") + 1]) ||
      DEFAULT_MAX_FILE_SIZE_KB
    : DEFAULT_MAX_FILE_SIZE_KB;

  try {
    const results = await validateAll(concurrency, maxFileSizeKB);

    // Print summary
    log("\n=== Validation Summary ===\n", "blue");

    log(`✓ Valid entries: ${results.valid}`, "green");
    log(
      `✗ Missing icon files: ${results.missingFiles.length}`,
      results.missingFiles.length > 0 ? "red" : "green"
    );
    log(
      `✗ Oversized files (>${maxFileSizeKB} KB): ${results.oversizedFiles.length}`,
      results.oversizedFiles.length > 0 ? "red" : "green"
    );
    log(
      `✗ Invalid IDs (not found in API): ${results.invalidIds.length}`,
      results.invalidIds.length > 0 ? "red" : "green"
    );
    log(
      `⚠ API errors: ${results.apiErrors.length}`,
      results.apiErrors.length > 0 ? "yellow" : "green"
    );

    // Print details for missing files
    if (results.missingFiles.length > 0) {
      log("\n=== Missing Icon Files ===", "red");
      results.missingFiles.forEach(({ id, icon }) => {
        log(`  ID: ${id}`);
        log(`  Expected file: ${icon}\n`);
      });
    }

    // Print details for oversized files
    if (results.oversizedFiles.length > 0) {
      log("\n=== Oversized Icon Files ===", "red");
      results.oversizedFiles.forEach(({ id, icon, size, maxSize }) => {
        log(`  ID: ${id}`);
        log(`  File: ${icon}`);
        log(`  Size: ${size.toFixed(2)} KB (max: ${maxSize} KB)`);
        log(`  Recommendation: Run compression script to optimize\n`);
      });
    }

    // Print details for invalid IDs
    if (results.invalidIds.length > 0) {
      log("\n=== Invalid IDs (not found in API) ===", "red");
      results.invalidIds.forEach(({ id, icon, statusCode, error }) => {
        log(`  ID: ${id}`);
        log(`  Icon: ${icon}`);
        if (statusCode) {
          log(`  Status: HTTP ${statusCode}`);
        }
        if (error) {
          log(`  Error: ${error}`);
        }
        log("");
      });
    }

    // Print API errors (non-404)
    if (results.apiErrors.length > 0) {
      log("\n=== API Errors ===", "yellow");
      results.apiErrors.forEach(({ id, error }) => {
        log(`  ID: ${id}`);
        log(`  Error: ${error}\n`);
      });
    }

    // Exit with error code if there are issues
    const hasErrors =
      results.missingFiles.length > 0 ||
      results.invalidIds.length > 0 ||
      results.oversizedFiles.length > 0;
    process.exit(hasErrors ? 1 : 0);
  } catch (error) {
    log(`\nFatal error: ${error.message}`, "red");
    console.error(error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  validateAll,
  validateId,
  iconFileExists,
  getMapping,
  checkFileSize,
  getFileSize,
};
