# Fix Catalog — Before/After Code Examples

This file contains proven fix patterns with exact before/after code for every defect in the catalog.

---

## LAYOUT-001: Phantom Gap Fix

### Before (Broken)
```tsx
// app/(app)/layout.tsx
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

### After (Fixed)
```tsx
// app/(app)/layout.tsx
<div className="flex min-h-screen bg-slate-50">
  <Sidebar />
  <div className="flex-1 flex flex-col min-w-0">
    <TopBar />
    <main className="flex-1 bg-slate-50">
      {children}
    </main>
  </div>
</div>

// components/dashboard/Sidebar.tsx — add sticky
<aside className="hidden md:flex flex-col bg-[#0f2744] sticky top-0 h-screen w-[240px]">

// components/dashboard/TopBar.tsx — add sticky
<header className="flex items-center h-16 px-6 bg-white border-b sticky top-0 z-10">
```

---

## VIS-001: Table Separator Fix

### Before
```tsx
<tr className="border-b border-slate-50 hover:bg-slate-50/50">
```

### After
```tsx
<tr className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50/50">
```

---

## IFRAME-001: Content Measurement Fix

### Before (Broken — returns viewport height)
```tsx
<iframe
  srcDoc={html}
  style={{ height: 2400 }}
  onLoad={(e) => {
    const h = e.target.contentDocument?.body?.scrollHeight;
    // h === 2400 (viewport height, not content height!)
  }}
/>
```

### After (Fixed — returns actual content height)
```tsx
// Step 1: Inject CSS to force body shrink-wrap
const patchedHtml = html.replace("</head>",
  "<style>html,body{height:auto!important;min-height:0!important;}</style></head>");

// Step 2: Use overflow:hidden wrapper + body.offsetHeight
<div style={{ overflowY: "auto", overflowX: "hidden" }}>
  <div style={{ height: contentH * SCALE, overflow: "hidden", position: "relative" }}>
    <iframe
      srcDoc={patchedHtml}
      sandbox="allow-same-origin"
      style={{
        position: "absolute", top: 0, left: 0,
        transform: `scale(${SCALE})`, transformOrigin: "top left",
        width: `${100 / SCALE}%`,
        height: contentH > 0 ? contentH : 2400,
      }}
      onLoad={(e) => {
        try {
          const h = (e.target as HTMLIFrameElement).contentDocument?.body?.offsetHeight;
          if (h && h > 0) setContentH(h);
        } catch { /* cross-origin fallback */ }
      }}
    />
  </div>
</div>
```

---

## DIALOG-002: Sticky Close Button Fix

### Before (Close button scrolls away)
```tsx
<DialogContent className="max-h-[90vh] overflow-y-auto">
  <DialogHeader>
    <DialogTitle>Title</DialogTitle>
  </DialogHeader>
  {/* Long content... user scrolls down, X button is gone */}
</DialogContent>
```

### After (Close button always visible)
```tsx
<DialogContent showCloseButton={false} className="max-h-[90vh] overflow-y-auto p-0">
  <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 sticky top-0 bg-white z-10">
    <h3 className="font-heading font-semibold text-[16px]">Title</h3>
    <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
      <X className="w-4 h-4" />
    </button>
  </div>
  <div className="px-5 pb-5 pt-3">
    {/* Content scrolls below sticky header */}
  </div>
</DialogContent>
```

---

## TS-001: API Response Typing Fix

### Before (Build failure)
```tsx
const [overview, setOverview] = useState<Record<string, unknown> | null>(null);
// Later: <OverviewMetrics totalSends={overview.totalSends} />
// ERROR: Type 'unknown' is not assignable to type 'number'
```

### After (Type-safe)
```tsx
interface OverviewData {
  totalSends: number;
  totalRecipients: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  unsubRate: number;
  sends: Array<{ date: string; count: number }>;
}

const [overview, setOverview] = useState<OverviewData | null>(null);
// Now: <OverviewMetrics totalSends={overview.totalSends} /> compiles correctly
```

---

## REUSE-001: Component Text Prop Fix

### Before (Hardcoded — misleading for background uploads)
```tsx
function LogoUploader({ value, onChange, token, label }: Props) {
  return (
    <p>Drop your logo here or <span>browse</span></p>
  );
}
```

### After (Contextual via prop)
```tsx
interface Props {
  value: string;
  onChange: (url: string) => void;
  token: string;
  label?: string;
  dropText?: string;  // NEW: customizable text
}

function LogoUploader({ value, onChange, token, label, dropText = "Drop your logo here" }: Props) {
  return (
    <p>{dropText} or <span>browse</span></p>
  );
}

// Usage for backgrounds:
<LogoUploader dropText="Drop your background image here" ... />
```

---

## REUSE-002: Non-Blocking Loading Fix

### Before (Blocks UI until all data loads)
```tsx
const [templates, previews] = await Promise.all([
  fetchTemplates(), fetchPreviews()
]);
setTemplates(templates);
setPreviews(previews);
setLoading(false);  // UI blocked until BOTH complete
```

### After (Primary data shows immediately)
```tsx
const templates = await fetchTemplates();
setTemplates(templates);
setLoading(false);  // UI shows immediately with templates

// Previews load in background — non-blocking
templates.forEach(t => {
  fetchPreview(t.id).then(html => {
    setPreviews(prev => ({ ...prev, [t.id]: html }));
  });
});
```
