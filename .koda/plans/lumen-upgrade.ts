// Experimental: upgrades Lumen to latest and opens a PR. Owned by the Lumen team.
import { agent, allTools, plan, retryShellSlot, task, variable } from "@cairn/plan";
import { z } from "zod";

// Slack runs don't always run the config's setup, so the plan installs its own deps.
// corepack pnpm needs no global shim and picks the packageManager version.
const pnpm = "COREPACK_ENABLE_DOWNLOAD_PROMPT=0 corepack pnpm";
const verifyCommand = `cd lib && ${pnpm} build && ${pnpm} knip && ${pnpm} lint && ${pnpm} test`;

const prUrl = variable("prUrl", z.string().url(), {
  description: "Pull request URL opened by the upgrade.",
});

const result = variable(
  "result",
  z.discriminatedUnion("status", [
    z.object({
      status: z.literal("pr-created"),
      summary: z.string().describe("What the upgrade changed."),
      prUrl: z.string().url(),
    }),
    z.object({
      status: z.literal("skipped"),
      reason: z.string().describe("Why no PR was opened."),
    }),
  ]),
  { description: "Terminal result returned by run-plan." },
);

const verify = retryShellSlot("verify");

const upgrader = agent("upgrader")
  .prompt(
    `You upgrade the @ledgerhq/lumen-* packages in lib/.
Fix only what the failing checks report. Keep behavior and unrelated code unchanged.
Run pnpm as "corepack pnpm": there is no global pnpm.
Never edit lib/pnpm-lock.yaml by hand and never downgrade a Lumen package.`,
  )
  .tools(allTools())
  .limits({ maxTurns: 30, timeoutMinutes: 20 });

const recorder = agent("recorder")
  .prompt("You write the terminal result of the run. Do not edit files.")
  .tools("read")
  .limits({ maxTurns: 4, timeoutMinutes: 5 });

// An open upgrade PR is updated, never duplicated: `createBranch` adds a unique suffix to every
// branch, so without this each run would open another PR.
// TODO: if someone other than koda-bot committed to the open PR's branch, comment on the PR and
// return `skipped` instead of pushing onto it.
const openPrExitCode = variable("openPrExitCode", z.number());
const openPr = variable("openPr", z.string(), {
  description: "The open upgrade PR as JSON, with its url and headRefName. Empty when none is open.",
});

// Exit 0: no open upgrade PR. Exit 1: one is open (stdout is its JSON). Exit 2: `gh` failed.
const checkOpenPrTask = task("check-open-pr")
  .runs(
    `open=$(gh pr list --state open --json url,headRefName --jq '[.[] | select(.headRefName | startswith("chore/lumen-upgrade"))] | first // empty') || exit 2; [ -z "$open" ] || { echo "$open"; exit 1; }`,
  )
  .continueOnError()
  .writes({ exit_code: openPrExitCode, stdout: openPr });

const reuseBranchTask = task("reuse-branch")
  .uses(upgrader)
  .message(
    `An upgrade PR is already open: its url and branch (headRefName) are in openPr. Update that PR instead of opening a new one.
Run git fetch, check out that branch, and merge the default branch (origin/HEAD) into it.
On a conflict in lib/package.json or lib/pnpm-lock.yaml take the default branch's version: the next steps redo the bump.`,
  )
  .with({ openPr });

const createBranchTask = task("create-branch")
  .uses(upgrader)
  .createBranch({ name: "chore/lumen-upgrade" });

const installTask = task("install").runs(`cd lib && ${pnpm} install --frozen-lockfile`);

const bumpTask = task("bump").runs(
  `cd lib && ${pnpm} up @ledgerhq/lumen-ui-react@latest @ledgerhq/lumen-ui-rnative@latest @ledgerhq/lumen-design-core@latest`,
);

// Always `@latest`: the index only knows the releases published before the CLI version.
const migrationsCli = "npx @ledgerhq/lumen-migrations@latest";

// The bump is not committed yet, so `git diff` on lib/package.json shows the installed → target range.
const migrateTask = task("migrate")
  .uses(upgrader)
  .message(
    `Apply the Lumen migrations for the upgrade range with the migrations CLI.
1. Run \`git diff -- lib/package.json\` to get the previous and new version of each bumped @ledgerhq/lumen-* package.
2. For each of them, run \`${migrationsCli} list --package <name> --from <previous> --to <new> --json\`.
3. For each migration listed, run \`${migrationsCli} show <id>\` and follow it (Before → after, Decide).
4. For each package, run \`${migrationsCli} check --cwd lib --package <name> --from <previous>\`. Exit code 1 means \`expect: none\` patterns still have hits: fix them and run it again. Hits it lists as review are for a human: do not edit them.
5. List what you cannot decide for a human.`,
  );

const commitTask = task("commit").uses(upgrader).commit({ message: "chore(deps): upgrade Lumen" });

const pushTask = task("push").uses(upgrader).push();

const createPrTask = task("create-pr")
  .uses(upgrader)
  .createPr({
    title: "chore(deps): upgrade Lumen",
    body: {
      summary: "Automated Lumen upgrade to the latest versions, run by Koda from .koda/plans/lumen-upgrade.ts.",
      verification: verifyCommand,
      notes: "Experimental run. Review before merging.",
    },
  })
  .writes({ url: prUrl });

const recordPrCreatedTask = task("record-pr-created")
  .uses(recorder)
  .message("Write the terminal result as pr-created, with a one-sentence summary and the pull request URL as prUrl.")
  .with({ prUrl, verify })
  .writes(result);

const recordPrUpdatedTask = task("record-pr-updated")
  .uses(recorder)
  .message("Write the terminal result as pr-created: the open PR in openPr was updated. Give a one-sentence summary and its url as prUrl.")
  .with({ openPr, verify })
  .writes(result);

// Nothing to commit when Lumen was already at the latest version.
const changesExitCode = variable("changesExitCode", z.number());
const checkChangesTask = task("check-changes")
  .runs('test -n "$(git status --porcelain)"')
  .continueOnError()
  .writes({ exit_code: changesExitCode });

const recordUpToDateTask = task("record-up-to-date")
  .uses(recorder)
  .message("Write the terminal result as skipped: the upgrade changed nothing because Lumen is already up to date.")
  .writes(result);

const recordFailureTask = task("record-failure")
  .uses(recorder)
  .message("Write the terminal result as skipped. Give the failing check from the verify output as the reason.")
  .with({ verify })
  .writes(result);

export default plan("lumen-upgrade")
  .input(z.object({}))
  .do(checkOpenPrTask)
  .if(
    openPrExitCode.eq(1),
    (b) => b.do(reuseBranchTask),
    (b) =>
      b.if(
        openPrExitCode.eq(0),
        (c) => c.do(createBranchTask),
        (c) =>
          c.do(
            task("fail-open-pr-check").runs(
              "echo 'Unable to check for an open Lumen upgrade PR' >&2; exit 2",
            ),
          ),
      ),
  )
  .do(installTask)
  .do(bumpTask)
  .do(migrateTask)
  .retryShell("verify", {
    max: 3,
    command: verifyCommand,
    fixer: (shellOutput) =>
      task("fix")
        .uses(upgrader)
        .message("Checks failed after the Lumen upgrade. Fix them.")
        .with({ stdout: shellOutput.field("stdout"), stderr: shellOutput.field("stderr") }),
  })
  .if(
    verify.field("exit_code").eq(0),
    (b) =>
      b.do(checkChangesTask).if(
        changesExitCode.eq(0),
        (c) =>
          c.do(commitTask).do(pushTask).if(
            openPrExitCode.eq(1),
            (d) => d.do(recordPrUpdatedTask),
            (d) => d.do(createPrTask).do(recordPrCreatedTask),
          ),
        (c) => c.do(recordUpToDateTask),
      ),
    (b) => b.do(recordFailureTask),
  );
