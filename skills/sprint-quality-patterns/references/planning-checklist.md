# Comprehensive Sprint Planning Checklist

Use this checklist when reviewing or creating sprint task files. Each section addresses a defect category that has historically caused production issues.

---

## 1. Page Architecture Checklist

For every new page in the sprint:

- [ ] **Layout integration verified** — Page sits inside dashboard layout (`min-h-screen` pattern)
- [ ] **No height constraints on page wrapper** — Uses `<div className="p-6">` only
- [ ] **Content max-width specified** — `max-w-4xl`, `max-w-[700px]`, etc.
- [ ] **Short-content test planned** — Will the page look correct with minimal data?
- [ ] **Empty state designed** — What shows when there's no data?
- [ ] **Loading skeleton planned** — Avoid layout shift during data fetch
- [ ] **Error state designed** — User-friendly error messages, not raw error text

## 2. Data Table Checklist

For every table/list component:

- [ ] **Row separators visible** — `border-slate-200` (not `border-slate-50`)
- [ ] **Column widths specified** — Prevent content from pushing layout
- [ ] **Empty state row** — "No items found" message
- [ ] **Loading skeleton rows** — Animated placeholders during fetch
- [ ] **Pagination or virtual scroll** — For lists > 50 items
- [ ] **Mobile responsive** — Horizontal scroll or stacked layout on mobile
- [ ] **Row hover state** — `hover:bg-slate-50/50`
- [ ] **Selection state** — If bulk actions needed, checkbox column planned

## 3. Form Page Checklist

For every form:

- [ ] **Zod validation schema defined** — All required/optional fields typed
- [ ] **Error messages positioned** — Below each field, red text
- [ ] **Submit button states** — Normal, loading (disabled + spinner), success
- [ ] **No phantom gap** — Form page tested for layout gap below submit button
- [ ] **Auto-save considered** — Debounced save for long forms
- [ ] **Keyboard navigation** — Tab order logical, Enter submits

## 4. API Integration Checklist

For every API call:

- [ ] **Response interface defined** — Named TypeScript interface (never `Record<string, unknown>`)
- [ ] **Error handling for all status codes:**
  - 401 → Redirect to auth
  - 402 → Show upgrade modal
  - 429 → Rate limit message
  - 500 → Generic error with retry
- [ ] **Loading state managed** — `setLoading(true)` before fetch, `false` in finally
- [ ] **Auth token included** — `Authorization: Bearer ${token}` header
- [ ] **basePath applied** — Using `apiUrl()` for all fetch URLs

## 5. Preview/iframe Checklist

For any preview feature:

- [ ] **CSS injection for measurement** — `html,body{height:auto!important}`
- [ ] **`body.offsetHeight` for true height** — Not `scrollHeight`
- [ ] **Wrapper `overflow:hidden`** — Clips absolute positioned iframe bleed
- [ ] **Cross-origin try/catch** — Graceful fallback for measurement failure
- [ ] **Scale factor documented** — `transform: scale(X)` with `transformOrigin: top left`
- [ ] **Sandbox attribute** — `sandbox="allow-same-origin"` for preview iframes

## 6. Dialog/Modal Checklist

For every modal:

- [ ] **Separate Radix Dialog instances** — Not raw divs inside existing Dialog
- [ ] **Sticky close button** — `showCloseButton={false}` + explicit X in sticky header
- [ ] **Max height constraint** — `max-h-[90vh] overflow-y-auto`
- [ ] **Auto-sizing for iframe content** — `onLoad` handler sets height
- [ ] **Focus management** — Radix handles this if using separate Dialog instances
- [ ] **Escape key closes** — Default Radix behavior, verify not overridden

## 7. Database Migration Checklist

For every schema change:

- [ ] **Migration file created** — `supabase/migrations/YYYYMMDDHHMMSS_name.sql`
- [ ] **Idempotent guards** — `IF NOT EXISTS`, `IF EXISTS`, `DO $$ ... END $$`
- [ ] **RLS policies included** — With existence checks in DO blocks
- [ ] **Supabase CLI procedure** — `npx supabase db push --linked` (never browser SQL Editor)
- [ ] **Verification query** — Script to confirm table/column exists after migration
- [ ] **Rollback considered** — What if we need to undo?

## 8. Component Reuse Checklist

When reusing existing components:

- [ ] **Check for hardcoded text** — Should it be a prop?
- [ ] **Add props with defaults** — Backward compatible
- [ ] **Non-blocking loading** — Primary data shows first, secondary in background
- [ ] **Prop types documented** — Interface with JSDoc comments for complex props

## 9. Email/Newsletter Feature Checklist

For sending features:

- [ ] **All 3 template styles tested** — minimal, modern, bold
- [ ] **Unsubscribe link present** — Tokenized, working on production URL
- [ ] **Batch sending** — 100/batch via Resend API
- [ ] **Event tracking** — open/click/bounce webhooks configured
- [ ] **A/B variant support** — If applicable

## 10. Performance Checklist

- [ ] **No unnecessary re-renders** — Memoize expensive computations
- [ ] **Dynamic imports for heavy components** — `dynamic(() => import(...), { ssr: false })`
- [ ] **Image optimization** — Next.js `<Image>` component
- [ ] **Bundle size** — No large libraries imported for small features

---

## Sprint Task File Quality Criteria

A well-written sprint task file should:

1. **List all new files** to be created with their paths
2. **List all existing files** to be modified
3. **Define database schema** changes with SQL
4. **Include TypeScript interfaces** for new data types
5. **Reference the design system** (design.md) for UI specifications
6. **Include acceptance criteria** that can be verified
7. **Note risk areas** from this checklist that apply

## Red Flags in Sprint Plans

Watch for these indicators of likely defects:

- "Create a new dashboard page" without layout integration notes
- "Fetch data from API" without response type definition
- "Add a preview feature" without iframe measurement strategy
- "Show data in a table" without empty/loading state design
- "Add a dialog" without close button and sizing strategy
- "Modify the layout" without testing short-content pages
