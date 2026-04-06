# Pick Up Linear Ticket

When I say "pick up [ticket name or ID]", follow this exact workflow — no shortcuts.

## Workflow

### 1. Find the Ticket
- If I gave a ticket ID (e.g. `FAI-23`): call `plugin-linear-linear / get_issue` with that ID
- If I gave a title or description: call `plugin-linear-linear / list_issues` with search keywords, then confirm the right one with me

Read the full ticket: title, description, checklist items, and acceptance criteria.

### 2. Research the Codebase
Read every file the ticket mentions or touches. Use Read, Grep, Glob, and SemanticSearch. Do not write a single line of code until you understand the full scope.

### 3. Ask Clarifying Questions (if needed)
If anything is ambiguous — design decisions, scope, approach — ask me now, before starting. Max 3 focused questions with clear options. Do NOT start if the answer would significantly change the implementation.

### 4. Set Ticket to In Progress
```
save_issue: id = "FAI-XX", state = "In Progress"
```
Then immediately post a start comment on the ticket (in Dutch) with:
- Your plan (bullet per change)
- Which files you'll touch
- Your approach (1-2 sentences if non-obvious)

### 5. Implement
Follow all project rules:
- Read every file before editing it
- No TypeScript errors, no unused imports
- All user-facing strings in **all 5 locale files** (en, nl, bg, hi, id)
- `useTheme()` for all colors — no hardcoded hex values
- `t()` for all strings — no hardcoded Dutch or English
- Max ~250 lines per component

Work through the ticket checklist items one by one.

### 6. Post a Completion Comment
Post a comment on the ticket (in Dutch) with:
- What was done (bullet per change)
- Which files were modified and what changed
- Any decisions made or follow-ups needed

### 7. Set Ticket to Done
```
save_issue: id = "FAI-XX", state = "Done"
```

## Rules
- Never skip the In Progress status update
- Never skip the completion comment
- Never skip setting Done
- Always ask before starting if scope is unclear
- Always fix TypeScript/lint errors before moving to the next file
