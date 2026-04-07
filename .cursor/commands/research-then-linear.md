# Research → Linear tickets

**Always invoke the skill `linear-backlog-from-research`.** Full procedure: `.cursor/skills/linear-backlog-from-research/SKILL.md` in this repo if it exists, else `~/.cursor/skills/linear-backlog-from-research/SKILL.md`. This command file is only a reminder.

## Defaults (Faith Generation app)

| Setting | Value |
|--------|--------|
| Linear team | `Faith Generation` |
| Project (when backlog is app-scoped) | `Bibleschool App` |
| MCP server | `plugin-linear-linear` |

## Non‑negotiables

- **Phase 1:** research + summary only — **no** `save_issue` / label creates.
- **Phase 2:** only after explicit go-ahead (“make tickets”, numbered items, etc.).
- **Epics:** title `[EPIC] - …`, label **`Epic`**, children via **`parentId`**.
- **Dedupe** before every create; **update** Backlog/Todo matches instead of duplicating.

## Pairing

Implementation of tickets created here → skill **`picking-up-linear-ticket`** / command **`pick-up-ticket`**.
