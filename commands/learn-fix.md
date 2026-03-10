---
description: Capture a new defect pattern from a fix you just made. Adds it to the quality guardian's knowledge base for future prevention across all projects.
argument-hint: [optional description of the fix]
allowed-tools: ["Read", "Write", "Edit", "Glob"]
---

# Learn Fix

Capture a new UI/UX defect pattern from a recent fix and add it to the quality guardian's knowledge base. This makes the pattern detectable in ALL future projects.

## Instructions

1. **Identify the fix**: If `$ARGUMENTS` is provided, use it as context. Otherwise, review the recent conversation to identify the last defect fix.

2. **Extract the pattern** by answering these questions:
   - **What was the anti-pattern?** (the code that caused the defect)
   - **What was the symptom?** (what the user saw)
   - **What was the root cause?** (why the anti-pattern caused the symptom)
   - **What was the fix?** (the corrected code)
   - **How to detect it?** (grep pattern or code review check)
   - **Which category?** (Layout, Visibility, iframe, Dialog, TypeScript, Reusability, Responsive, or NEW)

3. **Assign a pattern ID** following the convention:
   - Layout: `LAYOUT-NNN`
   - Visibility: `VIS-NNN`
   - iframe: `IFRAME-NNN`
   - Dialog: `DIALOG-NNN`
   - TypeScript: `TS-NNN`
   - Reusability: `REUSE-NNN`
   - Responsive: `RESP-NNN`
   - New category: `NEW-NNN` (will be recategorized later)

4. **Add to knowledge base** by editing these files:
   - Add the pattern to the appropriate section in: `~/.claude/plugins/cache/code-quality-guardian/code-quality-guardian/2.0.0/skills/ui-quality-patterns/references/common-defects.md`
   - Add the before/after code to: `~/.claude/plugins/cache/code-quality-guardian/code-quality-guardian/2.0.0/skills/ui-quality-patterns/references/fix-catalog.md`
   - If it's a layout pattern, also add to: `~/.claude/plugins/cache/code-quality-guardian/code-quality-guardian/2.0.0/skills/ui-quality-patterns/references/layout-patterns.md`

5. **Update the hook** if the pattern can be detected by regex:
   - Add a new rule to the `RULES` list in: `~/.claude/plugins/cache/code-quality-guardian/code-quality-guardian/2.0.0/hooks/validate_changes.js`

6. **Update the agent** if the pattern introduces a new check:
   - Add to the Defect Pattern Catalog in: `~/.claude/plugins/cache/code-quality-guardian/code-quality-guardian/2.0.0/agents/ui-ux-auditor.md`

7. **Confirm** the pattern has been captured by listing:
   - Pattern ID and name
   - Files updated
   - Whether hook detection was added

## Example Output

```
## Pattern Captured: LAYOUT-004

**Name:** Content container min-h-screen inside dashboard
**Anti-pattern:** `<div className="min-h-screen p-6">` inside dashboard main
**Symptom:** Double scroll bars, content stretched beyond natural height
**Fix:** Remove min-h-screen from inner containers

### Files Updated:
- common-defects.md — Added LAYOUT-004
- fix-catalog.md — Added before/after code
- layout-patterns.md — Added LAYOUT-004 section
- validate_changes.js — Added regex rule
- ui-ux-auditor.md — Added to Layout category

Pattern will now be detected automatically on future edits across ALL projects.
```

## The Learning Loop

This command is part of a continuous improvement cycle:

```
Fix a defect → /learn-fix captures pattern → Hook detects anti-pattern in future edits
                                            → Agent flags in future audits (/audit-page)
                                            → Advisor prevents in future plans (/review-plan)
```

Every fix makes the guardian smarter. Over time, entire categories of defects become impossible to introduce.
