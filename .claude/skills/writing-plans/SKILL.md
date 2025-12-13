---
name: writing-plans
description: Use when design is complete and you need detailed implementation tasks for engineers with zero codebase context - creates comprehensive implementation plans with exact file paths, complete code examples, and verification steps assuming engineer has minimal domain knowledge
---

# Writing Plans

## Overview

Write comprehensive implementation plans assuming the engineer has zero context for our codebase and questionable taste. Document everything they need to know: which files to touch for each task, code, docs they might need to check. Give them the whole plan as bite-sized tasks. DRY. YAGNI. Frequent commits.

Assume they are a skilled developer, but know almost nothing about our toolset or problem domain.

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

**Save plans to:** the same folder as the design document (e.g. `docs/plans/YYYY-MM-DD-<feature-name>/plan.md`)

## Bite-Sized Task Granularity

**Each step is one action (2-5 minutes):**

- "Implement function/component" - step
- "Verify it works (run type check and linting and testing in case of tests)" - step

## Plan Document Header

**Every plan MUST start with this header:**

```markdown
# [Feature Name] Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: use executing-plans skill to implement this plan task-by-task.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

---
```

## Task Structure

````markdown
### Task N: [Component/Feature Name]

**Files:**

- Create: `exact/path/to/file.ts`
- Modify: `exact/path/to/existing.ts:123-145`

**Step 1: Implement functionality**

```typescript
export function processUserData(input: UserInput): ProcessedData {
  return {
    id: input.id,
    name: input.name.trim(),
    status: "active",
  };
}
```

**Step 2: Verify functionality**

Run type checking and linting:

```bash
bun check-types
bun check
```

Expected: No type errors or linting issues
````

## Remember

- Exact file paths always
- Complete code in plan (not "add validation")
- Exact commands/verification steps with expected output
- Reference relevant skills with @ syntax
- DRY, YAGNI, frequent commits

## Execution Handoff

After saving the plan, offer execution choice:

**"Plan complete and saved to `docs/plans/<filename>.md`. Ready for execution:**

Ask user if they want to execute the plan now or later. If they want to execute it now, use executing-plans skill to execute the plan. If they want to execute it later, ask them to execute it later.
