# Pick up Linear ticket

**Always invoke the skill `picking-up-linear-ticket`.** Full procedure: `.cursor/skills/picking-up-linear-ticket/SKILL.md` in this repo if it exists, else `~/.cursor/skills/picking-up-linear-ticket/SKILL.md`. This command file is only a reminder.

## Defaults (Faith Generation app)

| Setting | Value |
|--------|--------|
| Linear team | `Faith Generation` |
| `list_issues` | pass `team` (and `project` when filtering) |
| MCP server | `plugin-linear-linear` |

## Non‑negotiables

- **`get_issue`** with **`includeRelations: true`** for ticket ID.
- **Clarify** unclear scope **before** `In Progress` (max 3 questions).
- **In Progress → implement → verify → completion comment → Done** on **this** issue only; **never** auto-close parent epics when finishing a child.
- **Comments** on the ticket: **Dutch** (Gestart / Afgerond templates in skill).

## Pairing

Backlog created from research → skill **`linear-backlog-from-research`** / command **`research-then-linear`**.
