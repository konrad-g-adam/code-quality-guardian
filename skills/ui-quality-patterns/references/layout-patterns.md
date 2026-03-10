# Layout Patterns — Detailed Reference

## LAYOUT-001: Phantom Gap (Critical)

**The most common dashboard defect.** Occurs when `h-screen` + `overflow-hidden` + `flex-1 overflow-y-auto` is used on the dashboard layout shell.

### Root Cause
```
flex h-screen overflow-hidden          ← Forces layout to exactly viewport height
  sidebar                              ← Stretches via flex parent
  flex-1 flex flex-col overflow-hidden ← Right pane = viewport width
    topbar                             ← Fixed height (e.g., h-16)
    main flex-1 overflow-y-auto        ← Gets ALL remaining height
      {children}                       ← Content may be shorter than main
```

When `{children}` content is shorter than the computed `main` height, the remaining space appears as a visible empty gap below the content.

### Anti-Pattern (WRONG)
```tsx
<div className="flex h-screen max-h-screen bg-slate-50 overflow-hidden">
  <Sidebar />
  <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
    <TopBar />
    <main className="flex-1 overflow-y-auto bg-slate-50">
      {children}
    </main>
  </div>
</div>
```

### Correct Pattern
```tsx
<div className="flex min-h-screen bg-slate-50">
  <Sidebar />  {/* Must have: sticky top-0 h-screen */}
  <div className="flex-1 flex flex-col min-w-0">
    <TopBar />  {/* Must have: sticky top-0 z-10 */}
    <main className="flex-1 bg-slate-50">
      {children}
    </main>
  </div>
</div>
```

### Why It Works
- `min-h-screen`: Outer container is AT LEAST viewport height but can GROW with content
- `sticky top-0 h-screen` on sidebar: Sidebar stays locked to viewport during scroll
- `sticky top-0 z-10` on topbar: Topbar stays pinned at top
- No `overflow-y-auto` on main: Uses native browser scroll instead of internal scroll container
- Short pages: No gap because container only grows to fit content
- Long pages: Native scroll works, sidebar and topbar stay sticky

### Detection
```bash
# Check for the anti-pattern
grep -r "h-screen.*overflow-hidden" app/
grep -r "flex-1.*overflow-y-auto" app/
```

### Pages Most Affected
- Form pages (generate, settings, create-list)
- Empty state pages (first-time user views)
- Pages with conditional content (loading states)

---

## LAYOUT-002: Missing Sticky Navigation

When using `min-h-screen` layout, the sidebar and topbar MUST be sticky.

### Sidebar Pattern
```tsx
<aside className="hidden md:flex flex-col bg-[#0f2744] sticky top-0 h-screen w-[240px]">
  {/* h-screen keeps it full viewport height */}
  {/* sticky top-0 locks it during scroll */}
</aside>
```

### TopBar Pattern
```tsx
<header className="flex items-center h-16 px-6 bg-white border-b sticky top-0 z-10">
  {/* z-10 ensures it stays above scrolled content */}
</header>
```

### Detection
```bash
grep -r "sticky top-0" components/dashboard/Sidebar.tsx
grep -r "sticky top-0" components/dashboard/TopBar.tsx
```

---

## LAYOUT-003: Content Container Over-Constraint

### Anti-Pattern
```tsx
{/* WRONG: Inner container forces viewport height inside scrollable area */}
<div className="min-h-screen p-6">
  <form>...</form>
</div>
```

### Correct Pattern
```tsx
{/* RIGHT: Let content flow naturally */}
<div className="p-6">
  <form>...</form>
</div>
```

### Rule
Never apply `min-h-screen`, `h-screen`, or `h-full` to content containers INSIDE the dashboard main area. These height constraints belong ONLY on the layout shell (outer div, sidebar, topbar).

---

## Layout Checklist for New Pages

When creating any new dashboard page:

- [ ] Page wrapper uses simple padding: `<div className="p-6">`
- [ ] No `min-h-screen` or `h-full` on page wrapper
- [ ] Content uses `max-w-*` for readability (e.g., `max-w-4xl mx-auto`)
- [ ] Layout.tsx still uses `min-h-screen` (not `h-screen`)
- [ ] Sidebar has `sticky top-0 h-screen`
- [ ] TopBar has `sticky top-0 z-10`
- [ ] Test page with minimal content to verify no phantom gap
- [ ] Test page with lots of content to verify scroll works
