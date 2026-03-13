# Code Quality Guardian

A Claude Code plugin that captures learned UI/UX defect patterns from real production fixes and uses them to prevent defects across ALL projects. It validates code in real-time via hooks, audits pages on demand, reviews implementation plans, and learns continuously from every fix.

**Works with any React/Next.js/Tailwind project. Not tied to any specific codebase.**

---

## Quick Start

After installing, you have 4 layers of quality protection:

| Layer | Tool | How It Works |
|-------|------|--------------|
| **Automatic** | PreToolUse Hooks | Warns when you Edit/Write code containing known anti-patterns |
| **On-Demand Audit** | `/audit-page <path>` | Full 50+ pattern check on any page or component |
| **Plan Review** | `/review-plan <path>` | Validates plans/PRDs/sprints before you start building |
| **Learning** | `/learn-fix` | Captures new patterns from fixes you just made |

---

## Commands

### `/audit-page <path>`
Run a comprehensive UI/UX quality audit on a page or component.

```bash
/audit-page src/pages/Settings.tsx          # Direct file path
/audit-page /dashboard/analytics            # Route path (auto-resolved)
/audit-page components/DataTable.tsx        # Component file
```

**What it checks:** 50+ patterns across 11 categories — Layout, Visibility, iframe, Dialog, TypeScript, Reusability, Responsive, Security, Email/Sending, Text/State Persistence, API Completeness.

### `/review-plan <path>`
Validate an implementation plan before you start building.

```bash
/review-plan docs/tasks/sprint-10.md        # Sprint file
/review-plan 10                             # Sprint number (auto-finds file)
/review-plan docs/prd/reporting.md          # PRD document
/review-plan current                        # Most recent plan file
```

**What it checks:** Maps every planned feature to defect categories, identifies missing specifications, generates a pre-build checklist.

### `/learn-fix [description]`
Capture a new defect pattern after fixing it. Makes the pattern detectable in ALL future projects.

```bash
/learn-fix                                  # Auto-detects from recent conversation
/learn-fix "Fixed z-index stacking issue"   # With description hint
```

**What it does:** Extracts the anti-pattern, symptom, root cause, and fix → adds to knowledge base → adds hook rule if regex-detectable → updates agent catalog.

---

## Agents

### ui-ux-auditor
Autonomous page/component auditor. Invoked automatically when you use `/audit-page` or can be triggered directly.

**When it runs:**
- After building or modifying any page or component
- When asked to "review", "audit", or "check" UI code
- Pre-deployment quality gates

### plan-quality-advisor
Autonomous plan reviewer. Invoked by `/review-plan` or directly.

**When it runs:**
- Before starting implementation of a sprint, PRD, or feature
- When designing new pages with forms, tables, iframes, or dialogs
- When validating feature scope

---

## Hooks (Automatic)

The plugin registers **PreToolUse hooks** on `Edit` and `Write` operations. When you edit code, the hook automatically checks for these anti-patterns:

| Rule | Anti-Pattern | Consequence |
|------|-------------|-------------|
| LAYOUT-001 | `h-screen` + `overflow-hidden` on layout | Phantom gaps on short pages |
| LAYOUT-001b | `flex-1 overflow-y-auto` on main area | Same phantom gap issue |
| VIS-001 | `border-slate-50` | Invisible table borders |
| TS-001 | `Record<string, unknown>` in useState | TypeScript build failures |
| IFRAME-001 | `scrollHeight` for iframe measurement | Wrong content height |
| DIALOG-002 | Scrollable DialogContent without sticky close | Close button scrolls away |
| ASYNC-001 | Inline `async` callback in useEffect | Unhandled promise rejections |
| FE-003 | `"use client"` + metadata export in same page | Metadata silently ignored |
| TS-004 | `useState<unknown[]>` | Downstream type errors on props |
| TRUNC-001 | `.substring(0,N) + "..."` in JSX | Hard-cut text, broken on mobile |
| DEBOUNCE-001 | `setTimeout(async` without useRef cleanup | Memory leak on unmount |

If a match is found, you'll see a **warning** (not a block) with the pattern ID and fix recommendation.

---

## Skills (Knowledge Base)

### ui-quality-patterns
50+ defect patterns with before/after code examples. Auto-loaded as context when relevant.

**References:**
- `references/layout-patterns.md` — Layout architecture patterns (LAYOUT-001 to 003)
- `references/common-defects.md` — All other categories (VIS, IFRAME, DIALOG, TS, REUSE, RESP)
- `references/fix-catalog.md` — Before/after code for every pattern

### sprint-quality-patterns
Planning-phase checklists and rules. Auto-loaded when reviewing plans.

**References:**
- `references/api-typing-rules.md` — 5 rules for TypeScript API response typing
- `references/planning-checklist.md` — 14-section pre-build checklist

---

## Integration with ralph-loop

The Quality Guardian and [ralph-loop](https://github.com/geoffrey-huntley/ralph-loop) are complementary:

| ralph-loop | Quality Guardian |
|------------|-----------------|
| Iteration engine — repeats until done | Prevention engine — catches defects per iteration |
| Self-corrects via file observation | Detects anti-patterns via hooks + audit |
| Stops on completion promise | Provides quality criteria for the promise |

### Example: Build with quality gates

```bash
/ralph-loop "Build the settings page with form validation.
After implementation, run the ui-ux-auditor agent to check for
layout, typing, and component defects. Continue until ZERO issues found.
Output <promise>AUDIT PASSED</promise>" \
--completion-promise "AUDIT PASSED" \
--max-iterations 15
```

### Example: Fix all audit issues iteratively

```bash
# First, audit the page
/audit-page src/pages/Dashboard.tsx

# Then loop until all issues are fixed
/ralph-loop "Fix all Quality Guardian issues in src/pages/Dashboard.tsx.
Re-run the audit after each fix. Output <promise>ALL FIXED</promise>
when zero issues remain." \
--completion-promise "ALL FIXED" \
--max-iterations 10
```

### Example: Plan → Build → Verify cycle

```bash
# 1. Review the plan first
/review-plan docs/tasks/feature-auth.md

# 2. Build iteratively with quality checks
/ralph-loop "Implement the auth feature from docs/tasks/feature-auth.md.
After each page is complete, audit it with the ui-ux-auditor.
Output <promise>FEATURE COMPLETE</promise> when all pages pass audit." \
--completion-promise "FEATURE COMPLETE" \
--max-iterations 30

# 3. If new patterns were discovered during the build
/learn-fix "Found that..."
```

---

## The Learning Loop

Every defect fix makes the guardian smarter:

```
Fix a defect
    ↓
/learn-fix captures pattern
    ↓
┌─────────────────────────────────────────────┐
│  Hook warns on anti-pattern in future edits │
│  Agent flags in future /audit-page audits   │
│  Advisor prevents in future /review-plan    │
└─────────────────────────────────────────────┘
    ↓
Over time, entire defect categories become impossible to introduce
```

---

## File Structure

```
code-quality-guardian/
├── .claude-plugin/
│   └── plugin.json              # Plugin manifest (v2.0.0)
├── agents/
│   ├── ui-ux-auditor.md         # Post-build page/component auditor
│   └── plan-quality-advisor.md  # Pre-build plan reviewer
├── commands/
│   ├── audit-page.md            # /audit-page command
│   ├── learn-fix.md             # /learn-fix command
│   └── review-plan.md           # /review-plan command
├── hooks/
│   ├── hooks.json               # Hook registration (PreToolUse)
│   └── validate_changes.js      # Real-time anti-pattern detection
├── skills/
│   ├── ui-quality-patterns/
│   │   ├── SKILL.md             # Pattern catalog overview
│   │   └── references/
│   │       ├── layout-patterns.md    # LAYOUT-001 to 003
│   │       ├── common-defects.md     # VIS, IFRAME, DIALOG, TS, REUSE, RESP
│   │       └── fix-catalog.md        # Before/after code examples
│   └── sprint-quality-patterns/
│       ├── SKILL.md             # Planning checklist overview
│       └── references/
│           ├── api-typing-rules.md   # TypeScript API typing rules
│           └── planning-checklist.md # 14-section pre-build checklist
└── README.md                    # This file
```

---

## Adding to New Projects

This plugin is installed globally at `~/.claude/code-quality-guardian/` and works automatically with every Claude Code session. No per-project setup needed.

To customize patterns for a specific project, add project-specific anti-patterns via `/learn-fix` — they'll be captured in the global knowledge base and apply everywhere.
