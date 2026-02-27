# `query-results` CLI

Query survey results from the command line without running the dev server.

```bash
pnpm query-results <question> [--year=YYYY] [--format=text|json] [--filter=question=choice]
```

## Arguments

- `<question>` — question ID (e.g. `profile-q-0`) or case-insensitive label substring (e.g. `gender`). Must resolve to exactly one question.
- `--year=YYYY` — target year (default: latest available)
- `--format=text|json` — output format (default: `json`)
- `--filter=question=choice` — repeatable; AND logic. `question` resolves same as main arg. `choice` is either a numeric index or a case-insensitive label substring.

## Examples

```bash
# Basic query
pnpm query-results "gender"
pnpm query-results "profile-q-0" --format=text

# Filter by single condition
pnpm query-results "tech-q-3" --filter="gender=Female"
pnpm query-results "tech-q-3" --filter="profile-q-0=1"        # choice by index

# Filter by multiple conditions (AND)
pnpm query-results "work-q-4" --filter="gender=Female" --filter="profile-q-1=2"

# Text format with filter
pnpm query-results "gender" --format=text --filter="profile-q-1=25 to 34"
```

## JSON output

```json
{
  "id": "tech-q-3",
  "question": "What are the front-end frameworks/libraries you are using on a daily basis?",
  "multiple": true,
  "total": 84,
  "skipped": 35,
  "choices": [
    { "label": "React.js", "count": 28, "percentage": 33.3 }
  ],
  "filters": [{ "question": "What is your gender?", "choice": "Female" }],
  "year": 2025
}
```

`filters` is only present when `--filter` args are used.
