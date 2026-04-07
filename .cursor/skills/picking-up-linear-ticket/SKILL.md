---
name: picking-up-linear-ticket
description: User says pick up / work on / implement a Linear issue by ID or title — full flow get_issue → parent epic context → research → clarify → In Progress → implement → verify → Dutch comments → Done. Handles epics, sub-issues, and standalones.
---

# Picking up a Linear ticket

## When this applies

- "Pick up FAI-23", "work on the profile ticket", "implement LIN-…", same intent in any language.

## Defaults

| Key | Typical value |
|-----|----------------|
| `team` | `Faith Generation` |
| `list_issues` | always pass `team`; add `project` when narrowing |
| MCP server | `plugin-linear-linear` |

Read Linear tool **descriptors** before first use in the session.

---

## Step 1 — Get the issue

**By ID:**

```
CallMcpTool: plugin-linear-linear / get_issue
  id: "<FAI-XX or full id>"
  includeRelations: true
```

**By title only:**

```
CallMcpTool: plugin-linear-linear / list_issues
  query: "<keywords>"
  team: "Faith Generation"
  limit: 8
```

Confirm with the user if multiple matches.

Read: title, description, checklist, acceptance criteria, labels, priority, state.

### 1b — Parent epic (mandatory)

1. **Sub-issue:** If the payload shows a **parent** (or relations/subIssues in your API), `get_issue` on the **parent** id. Cache **parentId + title** for comments.
2. **If parent is not obvious** from the first response, search `list_issues` with parent identifier or ask the user once — do not invent parent links.
3. **Epic issue** (`[EPIC] -` in title and/or **`Epic`** label): treat as **rollup**. If **children exist**, default to clarifying: implement **this** epic vs a **child** — unless the user explicitly chose the epic. If the epic is one big description with no children, narrow scope in Step 3 (max 3 questions).
4. **Standalone:** no special parent handling.

**Rule:** Finishing a **child** does **not** auto-close the **epic**. Only call `save_issue` … `state: Done` on the issue you were assigned.

---

## Step 2 — Research the codebase

Cover paths from the ticket, implied modules, shared components, `i18n/locales/*.json` if UI strings change, services, types.

Do **not** code until scope is clear.

---

## Step 3 — Clarify (before In Progress)

If scope, design, **epic vs child**, or acceptance is ambiguous — **max 3 questions**, options welcome.

**Do not** set In Progress while still blocked on answers.

**Empty or vague AC:** derive testable criteria from the description or ask **one** focused question.

---

## Step 4 — In Progress + start comment

When and **only when** you can execute without blocking questions:

```
save_issue: id: "<issue id>", state: "In Progress"
```

Then **immediately** `save_comment` on **the same issue** (Dutch):

```markdown
## Gestart

**Epic (indien van toepassing):**
- Onderdeel van FAI-YY — [titel]  *(of: N.v.t.)*

**Plan:**
- …

**Bestanden:**
- `…`

**Aanpak:**
…
```

If `list_issue_statuses` shows your workspace uses a different name than `"In Progress"`, use that state name.

---

## Step 5 — Implement

Follow `.cursor/rules/ai-rules.mdc` and workspace rules: theme, `t()`, five locales, `useTheme()`, no unused imports, ~250 lines per component, `undefined` not `null` for optional fields.

Work ticket checklist / AC in order.

---

## Step 5b — Verify before completion

Run what the repo provides: e.g. `npx tsc --noEmit`, `npm run lint` / `expo lint` on touched scope.

- Fix **new** issues you introduced.
- Pre-existing failures: one line in the completion comment.

If work **cannot** be completed (blocked, out of scope), **do not** set Done — discuss with the user: leave In Progress, or move to a blocked/canceled state if your Linear workflow has it (`list_issue_statuses`).

---

## Step 6 — Completion comment (Dutch)

```markdown
## Afgerond

**Epic (indien van toepassing):**
- …

**Wat er gedaan is:**
- …

**Bestanden gewijzigd:**
- …

**Opmerkingen / verificatie:**
- …
```

---

## Step 7 — Done

```
save_issue: id: "<issue id>", state: "Done"
```

Use the workspace’s **completed** state name from `list_issue_statuses` if not literally `Done`.

**Only this issue.** Do not close the parent epic unless this ticket **is** the epic and all its scope is intentionally completed here.

---

## Rules (strict)

| # | Rule |
|---|------|
| 1 | No code before In Progress for this ticket (except research reads). |
| 2 | No In Progress until clarifications resolved (unless truly trivial). |
| 3 | Start comment in the same turn as In Progress. |
| 4 | Verify before completion comment when tools run. |
| 5 | Completion comment before Done. |
| 6 | Comments Dutch unless the project explicitly uses English on tickets. |

---

## Anti-patterns

- Skipping parent epic fetch for sub-issues.
- Setting **epic** Done when only a **child** was done.
- One giant implementation across an epic without splitting or explicit approval.
- Marking Done with failing checks you caused.

---

## Related workflow

Research → backlog (epics + children) → **`linear-backlog-from-research`**.

---

## Linear MCP quick reference

| Need | Tool |
|------|------|
| Fetch issue | `get_issue` |
| Search | `list_issues` |
| Status names | `list_issue_statuses` |
| Update/create | `save_issue` |
| Comment | `save_comment` |
