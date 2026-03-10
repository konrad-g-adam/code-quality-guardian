---
description: Audit a page or component against 30+ UI/UX quality patterns. Checks layout, visibility, TypeScript typing, iframe, dialog, reusability, and responsive defects.
argument-hint: <page-path, component-path, or route like /dashboard/settings>
allowed-tools: ["Read", "Grep", "Glob", "Bash", "Agent"]
---

# Audit Page

Run a comprehensive UI/UX quality audit on the specified file, page, or component. Works with any React/Next.js project.

## Instructions

1. **Identify the target**: Use `$ARGUMENTS` to determine which file(s) to audit.
   - If a file path is given (e.g., `src/pages/Settings.tsx`), use it directly
   - If a route is given (e.g., `/dashboard/settings`), resolve it by searching `app/`, `pages/`, or `src/` directories
   - If a component name is given (e.g., `DataTable`), search for it with Glob

2. **Launch the ui-ux-auditor agent** to perform the audit. Pass it:
   - The target file path
   - All related component imports (read the file first to find imports)
   - The layout file (find: `**/layout.tsx`, `**/layout.jsx`) if the target is a page

3. **Report results** to the user in the structured format defined by the agent.

4. **If new patterns are detected**, flag them for capture via `/learn-fix`.

## Example Usage

```
/audit-page src/pages/Settings.tsx
/audit-page components/DataTable.tsx
/audit-page /dashboard/subscribers
/audit-page app/(app)/dashboard/analytics/page.tsx
```

## What Gets Checked (30+ patterns across 7 categories)

| Category | Patterns | Common Issues |
|----------|----------|---------------|
| Layout & Spacing | LAYOUT-001/002/003 | Phantom gaps, missing sticky nav, over-constrained containers |
| Visibility & Contrast | VIS-001/002/003 | Invisible borders, low-contrast text, missing hover states |
| iframe & Preview | IFRAME-001/002/003 | Wrong height measurement, overflow bleed, cross-origin errors |
| Dialog & Modal | DIALOG-001/002/003 | Focus trap conflicts, scrolling close button, no auto-sizing |
| TypeScript & API | TS-001/002/003 | Unknown types, null access, implicit any |
| Component Reuse | REUSE-001/002 | Hardcoded text, blocking data loads |
| Responsive & Mobile | RESP-001/002 | Missing mobile close, fixed widths without breakpoints |

## After the Audit

- **Issues found?** Fix them, then re-run `/audit-page` to verify
- **New pattern discovered?** Run `/learn-fix` to capture it for future audits
- **Want iterative fix cycles?** Use ralph-loop: `/ralph-loop "Fix all issues from /audit-page on [file]"`
- **Planning next feature?** Run `/review-plan` on your task file first
