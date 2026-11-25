// @ts-nocheck
/**
 * Upgrades Lumen to latest (Lumen ADR 027). Continues the open upgrade PR when there is one:
 * rebases it on the base branch, then bumps and migrates again. Opens a new PR otherwise.
 * Generic: copied unchanged from LedgerHQ/lumen. Repo specifics live in `.koda/lumen/settings.ts`.
 */
import {
  agent,
  allTools,
  input,
  inputsOf,
  literal,
  plan,
  retryShellSlot,
  task,
  variable,
} from "@cairn/plan";
import { z } from "zod";
import { settings } from "../lumen/settings.ts";

const prBodyTemplate = `### 📝 Description

Automated Lumen upgrade, run by Koda from \`.koda/plans/lumen-upgrade.ts\`. Each Lumen release rebases this PR on \`${settings.baseBranch}\` and moves it to the new latest, so review its latest state.

### 👀 Needs a human

<humanReview>

### 🔗 Context

- **ADR**: [ADR 027: Automated Lumen upgrades in consumer repos](https://ledgerhq.atlassian.net/wiki/spaces/DLS/pages/7689666642)`;

/** What the Lumen workflow sends, plus `dryRun` to stop before committing. All optional. */
const planInput = z
  .object({
    dryRun: z.boolean(),
    targetVersions: z.record(z.string(), z.string()),
    pr: z.object({ title: z.string(), labels: z.array(z.string()) }),
    changeset: z.boolean(),
    upstreamPackages: z.array(z.object({ package: z.string(), repo: z.string() })),
  })
  .partial();
const inputs = inputsOf(planInput);

const openBranch = variable("openBranch", z.string(), {
  description: "Branch of the open upgrade PR this run continues. Empty when a new PR is opened.",
});
const humanReview = variable("humanReview", z.array(z.string()), {
  description:
    "What the migrations leave for a human to decide, one item per entry, with the file paths. Empty when nothing.",
});
const prBody = variable("prBody", z.object({ body: z.string() }), {
  description: "The pull request body, in Markdown.",
});
const prUrl = variable("prUrl", z.string().url(), { description: "The upgrade PR's URL." });
const changesExitCode = variable("changesExitCode", z.number());
const result = variable(
  "result",
  z.discriminatedUnion("status", [
    z.object({
      status: z.enum(["pr-created", "pr-updated"]),
      summary: z.string().describe("What the upgrade changed."),
      prUrl: z.string().url(),
    }),
    z.object({
      status: z.literal("skipped"),
      reason: z.string().describe("Why nothing was pushed."),
    }),
    z.object({ status: z.literal("failed"), reason: z.string().describe("The failing step.") }),
  ]),
  { description: "Terminal result returned by run-plan." },
);
const rebase = retryShellSlot("rebase");
const verify = retryShellSlot("verify");

const upgrader = agent("upgrader")
  .prompt(
    `You upgrade the @ledgerhq/lumen-* packages in this repository. ${settings.agentGuidance}
Fix only what the migrations, conflicts or failing checks require. Keep behavior and unrelated code unchanged.
Never edit lockfiles by hand and never downgrade a Lumen package. Keep peerDependencies ranges unless the new version falls outside them.`,
  )
  .tools(allTools())
  .limits({ maxTurns: 40, timeoutMinutes: 30 });

const recorder = agent("recorder")
  .prompt("You write the terminal result of the run. Do not edit files.")
  .tools("read")
  .limits({ maxTurns: 4, timeoutMinutes: 5 });

/** A recorder task that writes the terminal result. */
const record = (name, message, context) => {
  const recordTask = task(name).uses(recorder).message(message);
  return (context ? recordTask.with(context) : recordTask).writes(result);
};

/** Checks out the newest open upgrade PR's branch and prints its name; prints nothing when none. */
const checkoutOpenPrTask = task("checkout-open-pr")
  .runs(
    `set -eo pipefail
branch=$(gh pr list --state open --limit 100 --json headRefName --jq '[.[].headRefName | select(startswith("${settings.branchPrefix}"))][0] // ""')
if [ -n "$branch" ]; then
  GIT_TERMINAL_PROMPT=0 timeout 300 git fetch --quiet origin "$branch:refs/remotes/origin/$branch"
  git checkout --quiet -B "$branch" "origin/$branch"
fi
printf %s "$branch"`,
  )
  .writes({ stdout: openBranch });

const createBranchTask = task("create-branch")
  .uses(upgrader)
  .createBranch({ name: settings.branchPrefix });

/** Fails while a rebase is in progress, so the resolver runs until the rebase is done. */
const rebaseCommand = `set -e
test ! -d .git/rebase-merge
test ! -d .git/rebase-apply
GIT_TERMINAL_PROMPT=0 timeout 300 git fetch --quiet origin ${settings.baseBranch}
git rebase origin/${settings.baseBranch}`;

const resolveConflictsTask = shellOutput =>
  task("resolve-conflicts")
    .uses(upgrader)
    .message(
      `The rebase on origin/${settings.baseBranch} stopped on conflicts. Resolve them, \`git add\` the files and run \`GIT_EDITOR=true git rebase --continue\`, until the rebase is done.
- Lockfiles: take origin/${settings.baseBranch}'s version (\`git checkout --ours <file>\`). The bump regenerates them.
- Code: keep the changes from origin/${settings.baseBranch}, adapted to the Lumen API this branch upgrades to.`,
    )
    .with({ stdout: shellOutput.field("stdout"), stderr: shellOutput.field("stderr") });

const bumpTask = task("bump").runs(`set -e\nnode .koda/lumen/bump.mjs\n${settings.relockCommand}`);

/** Exit code 0 when the bump changed files: a newer Lumen is out. */
const checkChangesTask = task("check-changes")
  .runs('test -n "$(git status --porcelain)"')
  .continueOnError()
  .writes({ exit_code: changesExitCode });

/** Always `@latest`: the index only knows releases published before the CLI version. */
const migrationsCli = "npx --yes @ledgerhq/lumen-migrations@latest";

const migrateTask = task("migrate")
  .uses(upgrader)
  .message(
    `Apply the Lumen migrations for the upgrade range with the migrations CLI.
1. Get the previous version of each bumped @ledgerhq/lumen-* package from origin/${settings.baseBranch}: from the package.json files that declare it, or from the pnpm catalog in pnpm-workspace.yaml (\`git show origin/${settings.baseBranch}:<path>\`), without a leading ^ or ~. The new version is in the working tree, the same way. When files declare different previous versions, use the lowest.
2. For each of them, run \`${migrationsCli} list --package <name> --from <previous> --to <new> --json\`.
3. For each migration listed, run \`${migrationsCli} show <id>\` and follow it (Before → after, Decide). A previous run on this branch may have applied some already: leave those as they are.
4. For each package, run \`${migrationsCli} check --package <name> --from <previous> --to <new>\` from the repo root, so every package using Lumen is scanned. Exit code 1 means \`expect: none\` patterns still have hits: fix them and run it again. Hits listed as review are for a human: do not edit them.
5. Write what you cannot decide, and every review hit, as humanReview.`,
  )
  .writes(humanReview);

const fixChecksTask = shellOutput =>
  task("fix")
    .uses(upgrader)
    .message("Checks failed after the Lumen upgrade. Fix them.")
    .with({ stdout: shellOutput.field("stdout"), stderr: shellOutput.field("stderr") });

const commitTask = task("commit").uses(upgrader).commit({ message: settings.commitMessage });

/** Cairn's `push()` never forces, and a rebased branch needs it. The lease keeps others' pushes. */
const pushTask = task("push").runs("git push --quiet --force-with-lease -u origin HEAD");

const prBodyTask = task("pr-body")
  .uses(recorder)
  .message(
    "Write prBody: the template with <humanReview> replaced by humanReview as a Markdown list, or by `Nothing.` when it is empty. Change nothing else.",
  )
  .with({ template: literal(prBodyTemplate), humanReview })
  .writes(prBody);

const createPrTask = task("create-pr")
  .uses(upgrader)
  .createPr({ title: settings.prTitle, body: prBody.field("body") })
  .writes({ url: prUrl });

/** A separate step: `createPr` has no labels option. */
const labelsTask = task("labels")
  .uses(upgrader)
  .message(
    "If pr.labels is not empty, add them to prUrl with `gh pr edit <prUrl> --add-label <label>`, one flag per label. Skip a label the repo doesn't have.",
  )
  .with({ prUrl, pr: inputs.pr });

const openPrUrlTask = task("open-pr-url")
  .runs('printf %s "$(gh pr view --json url --jq .url)"')
  .writes({ stdout: prUrl });

const updatePrBodyTask = task("update-pr-body")
  .uses(upgrader)
  .message(
    "Add humanReview to the `Needs a human` list in prUrl's body, keeping its items and replacing `Nothing.`, with `gh pr edit <prUrl> --body-file`. Change nothing else.",
  )
  .with({ prUrl, humanReview });

const recordPrTask = record(
  "record-pr",
  "Write the terminal result as pr-created when openBranch is empty, pr-updated otherwise, with a one-sentence summary and prUrl.",
  { openBranch, prUrl },
);
const recordDryRunTask = record(
  "record-dry-run",
  "Write the terminal result as skipped: a dry run, nothing committed or pushed. As the reason, say whether it would have updated openBranch or opened a new PR, and list humanReview.",
  { openBranch, humanReview },
);
const recordUpToDateTask = record(
  "record-up-to-date",
  "Write the terminal result as skipped: Lumen is already at the latest version on this branch.",
);
const recordRebaseFailedTask = record(
  "record-rebase-failed",
  "Write the terminal result as failed: the rebase conflicts could not be resolved. Give the conflicting files from the rebase output as the reason.",
  { rebase },
);
const recordVerifyFailedTask = record(
  "record-verify-failed",
  "Write the terminal result as failed. Give the failing check from the verify output as the reason.",
  { verify },
);

const publish = b =>
  b
    .do(commitTask)
    .do(pushTask)
    .if(openBranch.eq(""), c => c.do(prBodyTask).do(createPrTask).do(labelsTask))
    .else(c => c.do(openPrUrlTask).do(updatePrBodyTask))
    .do(recordPrTask);

const migrateAndVerify = b =>
  b
    .do(migrateTask)
    .retryShell("verify", { max: 3, command: settings.verifyCommand, fixer: fixChecksTask })
    .if(verify.field("exit_code").ne(0), c => c.do(recordVerifyFailedTask))
    .elseif(input("dryRun").eq(true), c => c.do(recordDryRunTask))
    .else(publish);

/** Bumps, runs the repo's after-bump step when it has one, then migrates if anything moved. */
const upgrade = b => {
  const bumped = b.do(bumpTask);
  const afterBump = settings.afterBumpCommand;
  return (afterBump ? bumped.do(task("after-bump").runs(afterBump)) : bumped)
    .do(checkChangesTask)
    .if(changesExitCode.eq(0), migrateAndVerify)
    .else(c => c.do(recordUpToDateTask));
};

export default plan("lumen-upgrade")
  .input(planInput)
  .do(checkoutOpenPrTask)
  .do(createBranchTask, { when: openBranch.eq("") })
  .retryShell("rebase", { max: 3, command: rebaseCommand, fixer: resolveConflictsTask })
  .if(rebase.field("exit_code").eq(0), upgrade)
  .else(b => b.do(recordRebaseFailedTask));
