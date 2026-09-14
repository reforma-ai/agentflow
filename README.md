# AgentFlow

An opinionated loop for shipping changes with coding agents: research when needed, challenge the decisions, split the work into PR-sized slices, then implement and review one slice at a time.

<p align="left">
  <a href="https://www.npmjs.com/package/@reforma/agentflow"><img src="https://img.shields.io/npm/v/@reforma/agentflow.svg" alt="npm"></a>
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/@reforma/agentflow.svg" alt="MIT License"></a>
  <a href="https://www.skills.sh/reforma-ai/agentflow"><img src="https://skills.sh/b/reforma-ai/agentflow" alt="skills.sh"></a>
</p>

<p align="center">
  <img src="assets/banner.png" alt="AgentFlow — an opinionated workflow for coding agents" width="100%">
</p>

```text
Research → Grill → Plan → PR → Review → Commit
                          ↑                │
                          └──── Repeat ────┘
```

```bash
npx @reforma/agentflow init
```

## Why

An open-ended prompt is usually enough for a tiny change. On larger work, scope grows, decisions disappear into chat history, and the model starts guessing. Edge cases get skipped, validation weakens, or the implementation settles on the wrong abstraction. Start a new chat and the reasoning is gone too.

Spec-driven frameworks such as OpenSpec and Spec Kit solve this by moving intent into proposals, requirements, designs, and task trees. That works, but it comes with a process the whole team has to maintain. For a small fix, the ceremony can cost more than the change.

AgentFlow is what survived six months of shipping real PRs with agents. It keeps three constraints:

- **Specs are working artifacts.** Keep research and plans as durable specs, leave them local, or delete them after the PR. Git and pull requests stay at the center of the workflow.
- **The process starts with the task.** Developers do not need to learn a separate artifact tree before they can use it. The agent carries the workflow after the initial clarification.
- **One slice at a time.** Settle decisions before coding, keep implementation to one PR-sized slice, and review that slice before starting the next. Optional steps can drop out; the order does not change.

## Skills

| Skill | What it does |
| --- | --- |
| `/research` | Saves research that should survive the current chat |
| `/grill` | Questions an idea until the important decisions are clear |
| `/plan` | Splits the work into PR-sized slices |
| `/code-review` | Reviews the slice for reuse, leftover structure, and obvious defects |
| `/handoff` | Saves the context needed to continue in another chat |
| `/tdd` | Works through one red-green slice at a time |
| `/document` | Turns research, a plan, or a shipped change into a project page |

## 🔄 The loop

Research is optional. Most larger tasks need a plan. Almost every task benefits from Grill; a small, obvious change can go from Grill straight to implementation.

1. Learn how the area works, if needed.
2. Sharpen the idea with Grill.
3. Split larger work into PR-sized slices.
4. Implement one slice.
5. Run an agent review.
6. Review the diff yourself, then commit.
7. Refresh the context when needed.
8. Archive or document the result.

Repeat steps 4–7 until the plan is complete.

> [!TIP]
> AgentFlow keeps research, plans, handoffs, and local setup state under `.agentflow/`.
> Ignore the directory for a private workflow, or commit it when the team should share the artifacts.

### 🔍 1. Learn how the area works

Research does not require a skill. A prompt such as "Find out how authentication works in this project" may be enough before implementation.

Use `/research` when the findings need to survive the chat. It runs the investigation in a subagent and writes the result to `.agentflow/<feature>/research/`, where it can be attached after context compaction or in a new chat.

If you skip research, Grill can still surface missing context.

### 🔥 2. Sharpen the idea with Grill

Grill is the core of AgentFlow. Run `/grill` after research, or start there when the area is already familiar.

The agent explains its reading of the task, lists the assumptions and open decisions, and recommends an answer for each one. You confirm or correct the list. If an answer creates another important question, Grill keeps going.

The result is a task the agent does not have to reinterpret while coding.

### 🗂️ 3. Plan PR-sized slices

For larger work, planning follows Grill in the same chat. After you confirm the decisions, Grill loads `/plan` when the change needs more than one slice. You can also run `/plan` directly. Small, confirmed work skips this step.

In a normal chat, `/plan` writes `.agentflow/<slug>/plan.md`. In Native Plan mode, the agent uses the client's planning flow and native plan artifact instead.

The plan keeps the settled Grill decisions and divides the feature into changes that can ship one by one. A slice is the smallest complete change that does something useful and has a clear check; it is not a quota of files or lines. Each slice records why it exists, what it leaves working, and which files it expects to change, so a fresh chat can pick it up without replaying the Grill conversation.

Lower-level work often comes first: behavior-preserving refactoring, shared types, backend work, then the interface that uses them. That is a common sequence, not a template. A small feature can stay vertical, and feature-local wiring should remain with the interface that first needs it.

Keep the plan current as the work changes.

### 🛠️ 4. Implement one slice

Implement the first unchecked slice and stop there. Without a plan, keep the change small enough to review. You can stay in the current chat, start a fresh one, or write the code yourself. When context moves, bring the plan and latest handoff. Use `/tdd` for test-first work.

Load relevant skills named in `AGENTS.md`. If implementation spills into a later slice, update the plan instead of quietly expanding the current one.

Before review, update `plan.md`. Check off the slice only after its checks pass, then record any scope changes that affect later work.

### 🤖 5. Run an agent review

Run `/code-review` on the completed slice. A subagent reviews what changed and why. It applies local fixes directly; anything it cannot decide comes back with the problem and a proposed fix.

### ✅ 6. Review and commit

Read the diff yourself, then commit it through the project's normal workflow.

### 🔄 7. Refresh the context

Stay in the current chat while its context is useful. When it gets noisy, summarize it or start a fresh one. `/handoff` records what shipped, what changed, and which slice comes next.

Attach the plan and handoff to the new chat, then return to step 4.

### 📚 8. Archive or document the result

Run `/document` when the work belongs in a durable project page. It updates an existing page for that domain when one exists; otherwise it writes to the project's docs tree or `.agentflow/docs/<domain>/`. It then removes the packaged `.agentflow/<slug>/` working files.

Skip this step when the work does not need a page.

## 📦 Install

### CLI

```bash
npx @reforma/agentflow init
```

`init` installs the AgentFlow skills through the `skills` CLI, which asks for the target agents, scope, and installation method. AgentFlow then asks whether to set up project docs. If you choose yes, it writes `AGENTFLOW.md` and adds this pointer to `AGENTS.md`:

```text
Larger than a quick fix: follow @AGENTFLOW.md.
```

Do not edit `AGENTFLOW.md` by hand. `init` and `update` replace it.

Update the installed workflow:

```bash
npx @reforma/agentflow@latest update
```

After setup, `update` runs without prompts and refreshes only the parts selected during initialization. If AgentFlow is not installed yet, it starts the same setup as `init`.

Other useful forms:

```bash
npx @reforma/agentflow init --global --agent cursor
npx @reforma/agentflow init --yes
npx skills add reforma-ai/agentflow --skill grill
```

### Agent plugin

The portable Agent Plugin installs the skills as one package. It reads them directly from `skills/`; there is no generated copy or separate plugin build. Use the CLI above when AgentFlow should also configure project docs and `AGENTFLOW.md`.

For Claude Code:

```bash
claude plugin marketplace add reforma-ai/agentflow
claude plugin install agentflow@agentflow
```

For Codex and ChatGPT:

```bash
codex plugin marketplace add reforma-ai/agentflow
```

Then install **AgentFlow** from the Plugins Directory. If your Codex CLI does not recognize `codex plugin`, update Codex or use the CLI installation.

Cursor supports the portable root manifest. Install AgentFlow from **Customize** when it is available in your marketplace; until then, use the CLI installation to add the same skills to Cursor.

The root `plugin.json` and `skills/` directory are the source of truth. `.claude-plugin`, `.agents/plugins`, and `.cursor-plugin` contain client-specific distribution metadata. On release, keep the npm package, portable plugin, and Claude plugin versions in sync. Marketplace entries inherit the plugin version instead of duplicating it.

## ⚖️ How it compares

[OpenSpec](https://github.com/Fission-AI/OpenSpec) keeps proposals, requirements, designs, tasks, and completed changes in a spec tree. That fits teams whose development process centers on specs. AgentFlow keeps one plan and creates a handoff only when context moves.

[Spec Kit](https://github.com/github/spec-kit) defines a phase-based process around a constitution, specs, plans, and tasks. AgentFlow orders the work without moving the rest of the development process into the framework.

An unstructured chat is still the shortest path for a small fix. AgentFlow starts to pay for itself when a change spans decisions, reviewable slices, or more than one context window.

## 🔗 Related project

Need better prose alongside the development workflow? [Prosecraft](https://github.com/reforma-ai/prosecraft) provides skills for humanizing drafts, writing technical documentation and UI copy, and creating agent skills.

## 🚀 Release

Add a changeset for every publishable change:

```bash
bun run changeset
```

When the changeset reaches `main`, the publish workflow tests the package, updates its version and changelog, publishes to npm through trusted publishing, and commits the release files back to `main`. A separate job publishes the same version as an Agent Skills release on GitHub.

Validate a release without publishing it:

```bash
gh skill publish --dry-run
bun run test
bun publish --dry-run
```

## 📄 License

AgentFlow is available under the [MIT License](LICENSE).

## 👤 Maintainer

Maintained by [@kachurun](https://github.com/kachurun).
