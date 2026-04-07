---
name: linear-backlog-from-research
description: Repository research or code review → executive summary first, then (after explicit confirmation only) create/update Linear issues with epic grouping, dedupe against Backlog/Todo, parentId children. Use for audits, tech-debt sweeps, "make tickets", or turning findings into Linear without auto-spamming issues.
---

# Linear backlog from research

## When this applies

- Broad codebase research, audits, improvement lists, or "turn this into tickets."
- User wants Linear updated **only after** they confirm (not on first message).
- Trigger Phase 2 on phrases like: "make tickets", "create the Linear issues", "maak de tickets", "zet dit in Linear", "go ahead", **or** a numbered subset ("alleen 1 en 3").

## Defaults (adjust if user names another team/project)

| Key | Typical value |
|-----|----------------|
| `team` | `Faith Generation` |
| `project` | `Bibleschool App` when work is product backlog for this app; omit if not applicable |
| MCP server | `plugin-linear-linear` |

Read Linear tool **descriptor JSON** in the MCP folder before the first `save_issue` / `list_issues` / etc. in the session.

## Hard rule: two phases

### Phase 1 — Research & summary only

- Use Read, Grep, Glob, SemanticSearch as needed.
- **Do not** call `save_issue`, `create_issue_label`, or any write that creates backlog items.
- **Do not** create labels in Phase 1.

**Optional:** `list_issues` with `team` + `query` (topic keywords) to mention overlapping existing tickets by ID + title — still no writes.

**End Phase 1 with:**

1. **Executive summary** — what you reviewed, health/themes, main risks (if any).
2. **Grouped proposals** — cluster by **component/theme**:
   - **2+ discrete outcomes** in the same theme → one **epic block**: title **`[EPIC] - <Theme name>`**, one-line epic scope, suggested priority, labels (**`Epic`** + area).
   - **Under each epic**, numbered **sub-issues**: title **without** `[EPIC] -`, scope, priority, labels (area/feature; not `Epic` on children by default).
   - **Singletons** → standalone proposed issues (no parent).
3. **Navigable numbering** so the user can say "only epic A + children" or "items 1, 4, 5" or "everything."
4. **Wait line** — no Linear writes yet. Dutch example: *Ik heb nog geen Linear-tickets aangemaakt. Zeg **make tickets** of geef aan welke nummers.* Use English if the user writes in English.

---

### Phase 2 — Create/update only after explicit go-ahead

**Pre-flight**

1. Confirm the user's intent: full list vs **numbered subset** vs **named epic blocks**. If unclear, ask **one** short question before writing.
2. `list_issue_labels` → ensure label **`Epic`** exists (`create_issue_label` if missing).
3. **Priority map** (Linear `save_issue`):

| Words | `priority` |
|-------|------------|
| Urgent | `1` |
| High | `2` |
| Normal | `3` |
| Low | `4` |

**Security:** never paste secrets, tokens, or private customer data into issue descriptions.

---

**Ordered procedure (follow in order; avoids duplicate searches and wrong parent order)**

**A. Per theme cluster that should have an epic (2+ children in this batch, or Phase 1 already defined an epic for that theme)**

1. **Find existing epic:** `list_issues` with `team` (+ `project` if used), `query` = theme keywords and/or `[EPIC]`.
2. **If** a matching epic exists **and** state is **Backlog** or **Todo**: `save_issue` with `id` to **merge** new research into description (e.g. dated `## Research notes`); adjust labels/priority if clearly better.
3. **If** no match: **create epic first** — `save_issue` without `id`, without `parentId`, `title` = `[EPIC] - <Theme>`, `labels` include **`Epic`**, full Markdown description. Capture returned **identifier** (e.g. `FAI-123`).

**B. For each child issue in that cluster (only those the user approved)**

1. `list_issues` dedupe by keywords from **child** title/topic.
2. If duplicate in Backlog/Todo → **update** that issue; set `parentId` to epic id if it was missing and policy is to nest under epic.
3. If no duplicate → `save_issue` without `id`, **`parentId`** = epic identifier, child title **without** `[EPIC] -`.

**C. Standalone issues (not in an epic group, or single-outcome items)**

1. For each: `list_issues` → same match table as below → create or update.

**Match table**

| Existing issue | State | Action |
|----------------|-------|--------|
| Same topic | **Backlog** or **Todo** | `save_issue` + `id`: merge description, no second issue |
| Same topic | In Progress, Done, Canceled, Duplicate, … | Do **not** duplicate; report `ID — title — state`; new issue only if scope is genuinely different; link related |
| No match | — | `save_issue` without `id` |

**Descriptions (create/update):** Markdown with context, problem, approach, **acceptance criteria** (testable), **file paths**. Literal newlines in strings (no `\\n` escapes).

**Reply:** epics created/updated (with identifiers), children under each epic, standalones, updated issues, skipped duplicates, deferred items, anything that failed API validation.

---

## Edge cases

- **Subset only:** If the user picks **child numbers** whose epic was **not** in the approved set, either create the epic first (if theme needs it) or create children **without** parent — **ask one question** if nesting is ambiguous.
- **User wants flat issues:** If they explicitly refuse epics, create standalones only; do not force `[EPIC]`.
- **API failure:** Report the error; do not claim success. Partial creates: list what succeeded and what to retry.

## Ticket quality bar

- One **discrete outcome** per non-epic issue; epics **rollup** only.
- Acceptance criteria: checklist or Given/When/Then.
- Paths: `app/...`, `services/...`, not vague areas.
- Urgent only for production/security risk.

## Anti-patterns

- Creating issues during Phase 1.
- Skipping `list_issues` before a create.
- A second epic for the same theme when one exists in Backlog/Todo — **update** and add children.
- Many new labels instead of reusing team labels.
- Guessing `team`/`project` — ask once if unknown.

## Related workflow

Implementing an issue → **`picking-up-linear-ticket`**.
