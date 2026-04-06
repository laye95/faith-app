# Research → Linear tickets

**Invoke the skill** `linear-backlog-from-research` (if available) and follow it. Otherwise use the workflow below.

## Phase 1 — Research only (no Linear writes)

When I describe what to research or audit in the repo (or I use this command with a topic):

1. Explore the codebase (Read, Grep, SemanticSearch). Do **not** create or update Linear issues in this phase.
2. Reply with:
   - Short **summary** of what you reviewed and main themes.
   - **Numbered list** of proposed tickets: title, scope, suggested priority (Urgent / High / Normal / Low), suggested label names.
3. Optional: run `list_issues` (team **Faith Generation**, project **Bibleschool App** when relevant, `query` = keywords from the topic) to **mention** existing tickets that might overlap — IDs + titles only, no writes.
4. End with: *No tickets created or updated yet. Say **make tickets** (or which numbers) when you want Linear updated.*

## Phase 2 — After I confirm (“make tickets”, etc.)

**Before any create:** for **each** approved item, call `list_issues` with `team` (+ `project` if useful) and `query` (keywords from title/topic). Read issue **state** from results.

| Existing match | State | Action |
|----------------|-------|--------|
| Same topic | **Backlog** or **Todo** | **Update** `save_issue` **with** `id` — merge research into `description` (e.g. dated “Research notes”), adjust priority/labels; **no** duplicate issue. |
| Same topic | In Progress, Done, Canceled, Duplicate, … | **Do not** create a duplicate. Report existing `ID — title — state`. New issue only if scope is genuinely different; link the related issue. |
| No good match | — | **Create** `save_issue` **without** `id`. |

Then: `list_issue_labels` → map to **existing** labels → `create_issue_label` only if nothing fits.

**Creates/updates:** `title`, `team` (Faith Generation), `description` (Markdown: context, problem, approach, **acceptance criteria**, paths), `priority` 1–4, `labels`, `project` (**Bibleschool App**) when applicable.

**Reply with:** updated issues, created issues (links), skipped duplicates (with reason), deferred.

## Rules

- Never skip searching **existing** issues before creating.
- Never create an extra ticket when **Backlog**/**Todo** already covers the same work — **update** that issue.
- Literal newlines in Markdown for Linear (no `\\n` escapes).
