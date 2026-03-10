---
name: sprint-quality-patterns
description: >
  Implementation planning quality patterns and pre-build checklists for React/Next.js applications.
  Auto-triggers when reviewing task files, PRDs, sprint plans, or designing page layouts in ANY project.
  Contains TypeScript API typing rules, database migration checklists, and comprehensive
  pre-build validation checklists derived from real production defect history.
version: 2.0.0
---

# Planning Quality Patterns

Prevents defects at the planning stage by applying lessons learned from real production fixes. Works with any planning format: sprints, PRDs, task lists, feature specs, or user stories.

## Pre-Build Validation Checklist

Before starting ANY implementation phase, validate the plan against these categories:

### 1. Every New Page Must Specify
- [ ] Page wrapper uses appropriate padding (e.g., `<div className="p-6">`) — no height constraints
- [ ] Content container uses `max-w-*` for readability
- [ ] Empty state component defined
- [ ] Loading skeleton defined
- [ ] Error state handling defined
- [ ] Mobile responsive behavior described

### 2. Every API Integration Must Specify
- [ ] TypeScript interface for response data (NEVER `Record<string, unknown>`)
- [ ] Error response handling (401, 402, 429, 500)
- [ ] Loading state management
- [ ] Null/undefined handling for optional fields

### 3. Every Database Change Must Specify
- [ ] Migration SQL file path and naming convention
- [ ] `IF NOT EXISTS` / `IF EXISTS` guards for idempotency
- [ ] RLS policies with existence checks (if using Supabase/Postgres)
- [ ] Verification step (query new table after migration)
- [ ] Migration tool procedure documented (CLI, not browser)

## How This Skill Fits with Other Plugin Tools

| Tool | Purpose | When to Use |
|------|---------|-------------|
| **This skill** | Planning-phase knowledge — auto-loaded during plan reviews | Automatic context |
| `/review-plan` | Quick command to validate a plan file | Before starting implementation |
| `/audit-page` | Verify built code matches the plan | After building each feature |
| `/learn-fix` | Capture a new pattern discovered during implementation | After fixing a novel defect |
| **plan-quality-advisor agent** | Deep plan review with full defect catalog | Complex multi-feature plans |
| **ralph-loop** | Iterative implementation with quality gates | Large features |

## Detailed References

- [API Typing Rules](references/api-typing-rules.md) — 5 rules for proper TypeScript API response typing
- [Planning Checklist](references/planning-checklist.md) — 10-section comprehensive pre-build checklist
