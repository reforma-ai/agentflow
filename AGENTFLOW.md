# AgentFlow

Ordered loop for work larger than a quick fix. The `agentflow` skill owns every
step and loads only the reference for the current mode. This file sequences the
modes and names artifact paths.

```text
Research → Grill → Plan → PR → Review → Commit
                          ↑                  │
                          └──── Next PR ─────┘
```

Skip Research when the area is already clear. Skip Plan when one small slice is
enough. Run Handoff only when unfinished work moves to a fresh context. Run
Document when the work should become a project page.

## 1. Research (optional)

Explore the area before proposing the change. Run `agentflow research` when
findings must survive this chat. The investigation runs in a subagent.

**Done when:** the agent can name what it will change, or the step was skipped
because that is already known.

Artifacts: `.agentflow/<feature>/research/`.

## 2. Grill

Run `agentflow grill`. Settle assumptions, scope, and how the result will be
checked.

**Done when:** the user confirmed the settled list and no open decision can
change how the work will be done.

## 3. Plan (larger work)

Run `agentflow plan` when the confirmed work needs more than one shippable
slice. Small confirmed work continues at step 4 without a plan file.

**Done when:** `.agentflow/<feature>/plan.md` exists with the settled list and
ordered unchecked PRs, or the plan was skipped for a single small slice.

## 4. Implement one PR

Implement only the first PR whose Complete box is unchecked. Nested tasks
are progress inside that PR. Without a plan, keep one reviewable slice. Load
project craft skills named in `AGENTS.md`. Run `agentflow tdd` for test-first
work.

**Done when:** the slice meets its verify checks, its Complete box is checked
(if a plan exists), and later PRs match what remains.

## 5. Review

Run `agentflow review` on the completed slice. The review runs in a subagent
with what changed and why. Local shrinks and obvious fixes land there. Anything
left unfixed is a decision the reviewer could not make.

**Done when:** leftover production structure is gone, obvious defects are
fixed, and every unfixed problem is in front of the user with how to fix it.

## 6. Commit

Commit with the project's normal workflow, then return to step 4 for the next
unchecked PR.

**Done when:** the slice is committed (or staged per project rules) and the next
PR is identified or the plan is complete.

## 7. Handoff (fresh context)

Run `agentflow handoff` before moving unfinished work to another chat. Attach
the plan and handoff there, then resume at step 4.

**Done when:** `.agentflow/<feature>/handoff.md` exists, or the current chat
continues without a context move.

## 8. Archive / document (optional)

Run `agentflow document` when research, a plan, or a shipped change should
become a project page. It updates the existing domain page when one exists.
Otherwise it writes into the human docs tree, or
`.agentflow/docs/<domain>/`, then removes the packaged
`.agentflow/<slug>/` working files.

**Done when:** the domain page is current, or the step was skipped.
