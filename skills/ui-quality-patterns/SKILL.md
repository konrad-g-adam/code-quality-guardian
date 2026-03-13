---
name: ui-quality-patterns
description: >
  Comprehensive UI/UX quality pattern library learned from real production defect fixes in
  React/Next.js + Tailwind CSS + Radix UI applications. Auto-triggers when building or
  modifying pages, components, layouts, iframes, dialogs, tables, or forms in ANY project.
  Contains 50+ anti-patterns with proven fixes across 11 categories: Layout, Visibility,
  iframe/Preview, Dialog/Modal, TypeScript/API, Component Reusability, Responsive design,
  Security/Auth, Email/Sending, Text/State Persistence, and API Completeness.
  Use this knowledge to prevent defects before they happen.
version: 2.0.0
---

# UI Quality Patterns

This skill provides a comprehensive catalog of UI/UX defect patterns learned from real production fixes across multiple projects. Each pattern includes the anti-pattern, root cause, symptoms, and proven fix.

## Quick Reference — Top 5 Most Common Defects

1. **Phantom Gap** — `h-screen` + `flex-1` on layout creates empty space below short-content pages. Fix: `min-h-screen` + sticky nav. See [layout-patterns.md](references/layout-patterns.md)

2. **Unknown Type Build Failure** — `Record<string, unknown>` for API responses causes TypeScript build errors. Fix: Define proper interfaces. See [common-defects.md](references/common-defects.md#ts-001)

3. **Invisible Table Lines** — `border-slate-50` is nearly invisible on white backgrounds. Fix: `border-slate-200`. See [common-defects.md](references/common-defects.md#vis-001)

4. **iframe Height Mismatch** — `scrollHeight` returns viewport height, not content height. Fix: CSS injection + `body.offsetHeight`. See [common-defects.md](references/common-defects.md#iframe-001)

5. **Dialog Close Button Lost** — Close button scrolls away in long dialogs. Fix: Sticky header with explicit X. See [common-defects.md](references/common-defects.md#dialog-002)

## When to Apply These Patterns

- **Building a new page** → Check Layout patterns + Form patterns
- **Adding a data table or list** → Check Visibility patterns
- **Creating an iframe preview** → Check iframe patterns (ALL 3)
- **Adding a modal/dialog** → Check Dialog patterns (ALL 3)
- **Connecting to an API endpoint** → Check TypeScript patterns
- **Reusing an existing component** → Check Reusability patterns
- **Building responsive UI** → Check Responsive patterns

## Pattern Categories

| Category | Patterns | Reference |
|----------|----------|-----------|
| Layout & Spacing | LAYOUT-001 to LAYOUT-003 | [layout-patterns.md](references/layout-patterns.md) |
| Visibility & Contrast | VIS-001 to VIS-003 | [common-defects.md](references/common-defects.md) |
| iframe & Preview | IFRAME-001 to IFRAME-003 | [common-defects.md](references/common-defects.md) |
| Dialog & Modal | DIALOG-001 to DIALOG-003 | [common-defects.md](references/common-defects.md) |
| TypeScript & API | TS-001 to TS-003 | [common-defects.md](references/common-defects.md) |
| Component Reusability | REUSE-001 to REUSE-002 | [common-defects.md](references/common-defects.md) |
| Responsive & Mobile | RESP-001 to RESP-002 | [common-defects.md](references/common-defects.md) |
| Security & Auth | SEC-001 to SEC-004 | [common-defects.md](references/common-defects.md) |
| Email & Sending | EMAIL-001 to EMAIL-004 | [common-defects.md](references/common-defects.md) |
| Text & State | TRUNC-001, STATE-001, DEBOUNCE-001 | [common-defects.md](references/common-defects.md) |
| API Completeness | API-001 to API-003 | [common-defects.md](references/common-defects.md) |

## Fix Implementation Guide

For detailed before/after code examples for every pattern, see [fix-catalog.md](references/fix-catalog.md).

## How This Skill Fits with Other Plugin Tools

| Tool | Purpose | When to Use |
|------|---------|-------------|
| **This skill** | Knowledge base — patterns auto-loaded during code edits | Automatic context |
| `/audit-page` | Run full audit on a page/component | After building or modifying UI |
| `/learn-fix` | Capture a NEW pattern into this skill's references | After fixing a novel defect |
| `/review-plan` | Check a plan against these patterns before building | Before implementation |
| **PreToolUse hooks** | Automatic real-time warnings on Edit/Write | Always active |
| **ralph-loop** | Iterative build-and-audit loops | Complex feature builds |

## Adding New Patterns

When you discover a new defect pattern:
1. Run `/learn-fix` to capture the pattern
2. The command will add it to the appropriate reference file
3. Assign a pattern ID following the convention: `CATEGORY-NNN`
4. Include: anti-pattern, symptom, root cause, fix, check method
5. If detectable by regex, a hook rule is also added for real-time prevention
