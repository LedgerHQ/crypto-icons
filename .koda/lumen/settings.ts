/** This repo's settings for the generic Lumen upgrade plan (`.koda/plans/lumen-upgrade.ts`). */
export const settings = {
  baseBranch: "main",
  branchPrefix: "chore/lumen-upgrade",
  commitMessage: "chore(deps): upgrade Lumen",
  /** Added to the PR on top of Cairn's `cairn` label. */
  labels: [],
  agentGuidance:
    "The only package is lib/ (@ledgerhq/crypto-icons): read lib/README.md, and run pnpm from lib/ as `COREPACK_ENABLE_DOWNLOAD_PROMPT=0 corepack pnpm` (there is no global pnpm). The add-icon skill in .claude/skills is for adding icons and does not apply.",
  /** Updates the lockfile and installs after the bump. */
  relockCommand:
    "cd lib && COREPACK_ENABLE_DOWNLOAD_PROMPT=0 corepack pnpm install --no-frozen-lockfile",
  /** Lint only: build, knip, tests and the icon checks run in the PR's CI. */
  verifyCommand: "cd lib && COREPACK_ENABLE_DOWNLOAD_PROMPT=0 timeout 1200 corepack pnpm lint",
  /** Runs after the bump, before the migrations. Empty to skip. */
  afterBumpCommand: "",
  /** Runs after the commit; what it changes is committed too. Empty to skip. */
  afterCommitCommand: "",
};
