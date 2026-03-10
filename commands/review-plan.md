---
description: Validate an implementation plan, sprint file, PRD, or task list against quality patterns before starting work. Identifies risk areas and missing specifications.
argument-hint: <file-path, sprint-number, or "current" to auto-detect>
allowed-tools: ["Read", "Grep", "Glob", "Agent"]
---

# Review Plan

Validate a planning document against the quality guardian's pattern catalog to prevent known defects at the planning stage. Works with any planning format: sprints, PRDs, task lists, feature specs, user stories.

## Instructions

1. **Locate the plan file**:
   - If `$ARGUMENTS` is a file path, read that file directly
   - If `$ARGUMENTS` is a number (e.g., `10`), search for files matching `*sprint*10*`, `*task*10*`, `*phase*10*`, or `*milestone*10*` in common locations (`docs/`, `tasks/`, `plans/`, project root)
   - If `$ARGUMENTS` is `current` or empty, look for recently modified planning files (`.md` files in `docs/`, `tasks/`, `plans/`)

2. **Launch the plan-quality-advisor agent** to perform the review. Pass it:
   - The plan file content
   - The project's layout file (find it: `**/layout.tsx`, `**/layout.jsx`, `**/Layout.*`)
   - The project's type definitions (find: `**/types/*.ts`, `**/types/index.ts`, `**/interfaces/**`)

3. **The agent will**:
   - Identify each planned feature
   - Map features to defect categories (layout, typing, tables, iframes, dialogs, etc.)
   - Check for missing specifications
   - Generate a risk assessment
   - Produce a pre-build checklist

4. **Report results** to the user with:
   - Risk level per feature (High/Medium/Low)
   - Missing specifications that should be added
   - Generated pre-build checklist specific to this plan
   - Recommended task additions
   - Integration tips: when to use `/audit-page`, `/learn-fix`, and ralph-loop

## Example Usage

```
/review-plan docs/tasks/sprint-10-interactive-elements.md
/review-plan 10
/review-plan docs/prd/reporting-feature.md
/review-plan current
```

## What Gets Checked

- Every new page → Layout architecture patterns (LAYOUT-001/002/003)
- Every API integration → TypeScript typing rules (TS-001/002/003)
- Every data table → Visibility and contrast patterns (VIS-001/002/003)
- Every preview feature → iframe measurement patterns (IFRAME-001/002/003)
- Every dialog/modal → Focus trap and close button patterns (DIALOG-001/002/003)
- Every database change → Migration procedure compliance
- Every reused component → Prop extensibility check (REUSE-001/002)
- Every form → Validation and layout check
- Every email feature → Template and tracking check

## Collaboration with Other Tools

After the review:
- **Build the features** with confidence the plan covers known risk areas
- **Run `/audit-page`** on each completed page to verify the build matches the plan
- **Run `/learn-fix`** if you discover a NEW defect pattern during implementation
- **Use ralph-loop** for iterative builds: `/ralph-loop "Build [feature]. After each iteration, run /audit-page to validate."`
