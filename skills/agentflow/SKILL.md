---
name: agentflow
description: >-
  Use when the user invokes AgentFlow, project guidance requires it, or the
  user asks to run an AgentFlow research, grill, plan, TDD, review, handoff, or
  documentation mode. Route natural-language requests to the matching mode and
  load only that mode's reference. Not for ordinary quick fixes.
license: MIT
---

# AgentFlow

One entrypoint for an ordered development loop:

```text
Research → Grill → Plan → PR → Review → Commit
                          ↑                │
                          └──── Repeat ────┘
```

The user's words choose the mode; exact command syntax is optional. A request
to “research this first” routes to Research, and “let's grill it” routes to
Grill. Read only the selected reference before acting. Do not preload every
mode.

## Modes

| Mode | Use when | Read |
| --- | --- | --- |
| `research` | An unfamiliar area needs a durable map | [references/research.md](references/research.md) |
| `grill` | Product, scope, or architecture decisions are still open | [references/grill.md](references/grill.md) |
| `plan` | Decisions are settled and work needs PR-sized slices | [references/plan.md](references/plan.md) |
| `tdd` | One implementation slice should proceed test-first | [references/tdd.md](references/tdd.md) |
| `review` | A completed slice needs review and local fixes | [references/review.md](references/review.md) |
| `handoff` | Unfinished work is moving to a fresh context | [references/handoff.md](references/handoff.md) |
| `document` | Finished work should become durable project documentation | [references/document.md](references/document.md) |

Accept `code-review` as an alias for `review`. Commands may include a target or
brief in the same request, such as `$agentflow research authentication` or
`/agentflow review the current diff`.

`continue` and `implement` resume delivery rather than load another playbook.
Read the current plan and latest handoff when they exist, then implement only
the first unchecked PR-sized slice. Load [references/tdd.md](references/tdd.md)
only when the user or project requires test-first work.

## Routing

- An explicit mode wins. Read its reference and follow it.
- A clearly implied mode is equivalent to an explicit one. Do not ask the user
  to repeat the request as a command.
- A request to run the whole workflow starts at the earliest necessary phase.
  Skip Research when the area is already understood and Plan when one small
  slice is enough. Load later references only when their phase begins.
- With no mode or actionable request, inspect the conversation and existing
  `.agentflow/` artifacts, then recommend the next mode. Do not begin a
  substantial phase merely because it might be useful.
- If two modes genuinely fit and lead to different immediate work, ask one
  short question. Otherwise choose the narrower mode.

## Shared rules

- Follow the nearest project guide (`AGENTS.md` or equivalent).
- Preserve the user's scope and authority. A mode changes the method, not what
  actions are authorized.
- Keep research, plans, and handoffs under one
  `.agentflow/<feature>/` slug so later phases can find them.
- Settle decisions before planning. Implement one PR-sized slice at a time.
  Review that slice before committing and starting the next.
- A phase may route to the next phase when its own completion rules say so.
  Read the next reference at that point, not earlier.
