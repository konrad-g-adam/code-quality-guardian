# Common Defects Catalog

## Visibility & Contrast

### VIS-001: Invisible Table Separators
- **Anti-pattern:** `border-slate-50` on `<tr>` elements
- **Symptom:** Table rows appear merged — no visible grid lines on white backgrounds
- **Root cause:** `slate-50` (#f8fafc) is nearly indistinguishable from white (#ffffff)
- **Fix:** Use `border-slate-200` (#e2e8f0) for clear row separation
- **Check:** `grep -r "border-slate-50" components/`

### VIS-002: Low-Contrast Text
- **Anti-pattern:** `text-slate-300` for body text, `text-slate-200` for labels
- **Symptom:** Text is barely readable on light backgrounds
- **Fix:** Minimum contrast levels:
  - Headings: `text-slate-900`
  - Body text: `text-slate-500` or `text-slate-600`
  - Muted/helper: `text-slate-400`
  - Never below `text-slate-400` for any visible text

### VIS-003: Missing Hover States
- **Anti-pattern:** Clickable `<button>` or `<div onClick>` without hover feedback
- **Fix:** Add at minimum: `hover:bg-slate-50` for subtle, `hover:translate-y-[-1px]` for buttons

---

## iframe & Preview

### IFRAME-001: Incorrect Content Measurement (Critical)
- **Anti-pattern:** Using `scrollHeight`, `clientHeight`, or `getBoundingClientRect()` to measure iframe content
- **Symptom:** Measurement returns viewport height (e.g., 2400px) instead of actual content height (e.g., 900px)
- **Root cause:** HTML `<html>` and `<body>` elements ALWAYS stretch to fill their viewport by default. ALL measurement APIs return values influenced by the viewport, not actual content.
- **Fix (3-pronged):**
  1. **CSS injection:** Add `<style>html,body{height:auto!important;min-height:0!important;}</style>` before `</head>` in srcDoc
  2. **Use `body.offsetHeight`:** After CSS injection, `offsetHeight` returns true content height
  3. **Wrapper overflow:** Add `overflow:hidden` on the containing div to clip absolute iframe bleed
- **Code:**
  ```tsx
  const patchedHtml = html.replace("</head>",
    "<style>html,body{height:auto!important;min-height:0!important;}</style></head>");

  // In iframe onLoad:
  const h = frame.contentDocument?.body?.offsetHeight;
  ```

### IFRAME-002: Absolute Position Overflow Bleed
- **Anti-pattern:** Scaled iframe (`transform: scale(0.5)`) with `position: absolute` but no overflow clip on wrapper
- **Symptom:** iframe visually extends beyond its container card, creating phantom scrollbar area
- **Fix:** Wrapper div must have `overflow: hidden`
- **Code:**
  ```tsx
  <div style={{ overflow: "hidden", height: contentH * SCALE }}>
    <iframe style={{ position: "absolute", transform: "scale(0.5)", transformOrigin: "top left" }} />
  </div>
  ```

### IFRAME-003: Cross-Origin Measurement Failure
- **Anti-pattern:** Direct `contentDocument` access without try/catch
- **Fix:** Always wrap in try/catch with fallback:
  ```tsx
  onLoad={(e) => {
    try {
      const h = (e.target as HTMLIFrameElement).contentDocument?.body?.offsetHeight;
      if (h && h > 0) setContentH(h);
    } catch { /* cross-origin fallback — use default height */ }
  }}
  ```

---

## Dialog & Modal

### DIALOG-001: Focus Trap Conflict
- **Anti-pattern:** Rendering a preview overlay (raw `<div>`) inside an existing Radix `<Dialog>`
- **Symptom:** Focus gets trapped in wrong layer; keyboard navigation (Tab, Escape) breaks
- **Fix:** Use separate `<Dialog>` instances for each overlay level — Radix handles focus management per Dialog

### DIALOG-002: Close Button Scrolls Away
- **Anti-pattern:** Default Radix `showCloseButton` inside a scrollable `DialogContent`
- **Symptom:** User scrolls down in a long dialog and the X button is gone
- **Fix:**
  ```tsx
  <DialogContent showCloseButton={false} className="max-h-[90vh] overflow-y-auto p-0">
    <div className="sticky top-0 bg-white z-10 flex justify-between px-5 py-3.5 border-b">
      <h3>Title</h3>
      <button onClick={() => setOpen(false)}><X className="w-4 h-4" /></button>
    </div>
    <div className="px-5 pb-5 pt-3">{/* content */}</div>
  </DialogContent>
  ```

### DIALOG-003: Dialog Not Auto-Sizing
- **Anti-pattern:** Fixed height on dialog containing an iframe
- **Fix:** Auto-size via `onLoad`:
  ```tsx
  <iframe
    onLoad={(e) => {
      const h = (e.target as HTMLIFrameElement).contentDocument?.documentElement?.scrollHeight;
      if (h) (e.target as HTMLIFrameElement).style.height = h + "px";
    }}
    style={{ width: "100%", minHeight: 400, border: "none" }}
  />
  ```

---

## TypeScript & API

### TS-001: Unknown Type in API Response State (Critical)
- **Anti-pattern:** `useState<Record<string, unknown> | null>(null)` for data passed to component props
- **Symptom:** TypeScript build failure: `Type 'unknown' is not assignable to type 'number'`
- **Fix:** Always define an interface:
  ```tsx
  interface OverviewData {
    totalSends: number;
    openRate: number;
    // ... all fields with explicit types
  }
  const [overview, setOverview] = useState<OverviewData | null>(null);
  ```
- **Check:** `grep -r "Record<string, unknown>" app/`

### TS-002: Missing Null Check
- **Anti-pattern:** `overview.totalSends` without null guard
- **Fix:** `{overview && <Component totalSends={overview.totalSends} />}`

### TS-003: Implicit Any in Event Handlers
- **Anti-pattern:** `onChange={(e) => setValue(e.target.value)}`
- **Fix:** `onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}`

---

## Component Reusability

### REUSE-001: Hardcoded Text in Reusable Components
- **Anti-pattern:** `<p>Drop your logo here</p>` in a component also used for background images
- **Fix:** Add prop: `dropText?: string` with default `"Drop your logo here"`
- **Pattern:**
  ```tsx
  interface Props {
    dropText?: string;  // New prop with default
  }
  function Component({ dropText = "Drop your logo here" }: Props) {
    return <p>{dropText}</p>;
  }
  ```

### REUSE-002: Non-Blocking Data Loading
- **Anti-pattern:** `setLoading(false)` only after ALL data (primary + secondary) loads
- **Fix:** Load primary data → `setLoading(false)` → fetch secondary in background
- **Example:**
  ```tsx
  // Load templates (primary) — show UI immediately
  const templatesRes = await fetch(...);
  setTemplates(await templatesRes.json());
  setLoading(false);  // UI renders now

  // Load previews (secondary) — background, non-blocking
  templates.forEach(t => fetchPreview(t.id));
  ```

---

## Responsive & Mobile

### RESP-001: Missing Mobile Menu Close
- **Anti-pattern:** Nav `<Link>` without `onClick={onMobileClose}`
- **Symptom:** Mobile menu stays open after navigation
- **Fix:** Add close handler to every nav link

### RESP-002: Fixed Width Without Responsive
- **Anti-pattern:** `className="w-[700px]"` (no max-width)
- **Fix:** `className="max-w-[700px] w-full"` or `className="w-full md:w-[700px]"`
