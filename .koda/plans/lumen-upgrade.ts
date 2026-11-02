// Experimental: upgrades Lumen to latest and opens a PR. Owned by the Lumen team.
import { agent, allTools, plan, retryShellSlot, task, variable } from "@cairn/plan";
import { z } from "zod";

const verifyCommand = "cd lib && pnpm build && pnpm knip && pnpm lint && pnpm test";

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
Never edit lib/pnpm-lock.yaml by hand and never downgrade a Lumen package.`,
  )
  .tools(allTools())
  .limits({ maxTurns: 30, timeoutMinutes: 20 });

const recorder = agent("recorder")
  .prompt("You write the terminal result of the run. Do not edit files.")
  .tools("read")
  .limits({ maxTurns: 4, timeoutMinutes: 5 });

const createBranchTask = task("create-branch")
  .uses(upgrader)
  .createBranch({ name: "chore/lumen-upgrade" });

const bumpTask = task("bump").runs(
  "cd lib && pnpm up @ledgerhq/lumen-ui-react@latest @ledgerhq/lumen-ui-rnative@latest @ledgerhq/lumen-design-core@latest",
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

const recordFailureTask = task("record-failure")
  .uses(recorder)
  .message("Write the terminal result as skipped. Give the failing check from the verify output as the reason.")
  .with({ verify })
  .writes(result);

export default plan("lumen-upgrade")
  .input(z.object({}))
  .do(createBranchTask)
  .do(bumpTask)
  .retryShell("verify", {
    max: 3,
    command: verifyCommand,
    fixer: (shellOutput) =>
      task("fix")
        .uses(upgrader)
        .message("Checks failed after the Lumen upgrade. Fix them.")
        .with({ stdout: shellOutput.field("stdout"), stderr: shellOutput.field("stderr") }),
  })
  .if(verify.field("exit_code").eq(0), (b) =>
    b.do(commitTask).do(pushTask).do(createPrTask).do(recordPrCreatedTask),
  )
  .else((b) => b.do(recordFailureTask));
