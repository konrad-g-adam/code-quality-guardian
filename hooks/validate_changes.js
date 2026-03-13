#!/usr/bin/env node
/**
 * UI/UX Quality Guardian — PreToolUse Hook
 * Validates Edit/Write operations against known anti-patterns.
 * Reads tool input from stdin (JSON), outputs decision to stdout.
 */

const RULES = [
  {
    id: "LAYOUT-001",
    filePattern: /layout\.tsx$/i,
    contentPattern: /h-screen.*overflow-hidden|overflow-hidden.*h-screen/,
    message: "LAYOUT-001: h-screen + overflow-hidden on dashboard layout causes phantom gaps on short pages. Use min-h-screen + sticky nav instead."
  },
  {
    id: "LAYOUT-001b",
    filePattern: /layout\.tsx$/i,
    contentPattern: /flex-1\s+overflow-y-auto/,
    message: "LAYOUT-001: overflow-y-auto on main content area forces viewport-height scrolling. Remove it and use native browser scroll."
  },
  {
    id: "VIS-001",
    filePattern: /\.(tsx|jsx)$/i,
    contentPattern: /border-slate-50/,
    message: "VIS-001: border-slate-50 is nearly invisible on white backgrounds. Use border-slate-200 for visible separators."
  },
  {
    id: "TS-001",
    filePattern: /page\.tsx$/i,
    contentPattern: /useState<Record<string,\s*unknown>/,
    message: "TS-001: Record<string, unknown> for API state causes TypeScript build failures. Define a proper typed interface."
  },
  {
    id: "IFRAME-001",
    filePattern: /\.(tsx|jsx)$/i,
    contentPattern: /contentDocument\??\.(documentElement|body)\??\.scrollHeight/,
    message: "IFRAME-001: scrollHeight returns viewport height, not content height. Inject CSS html,body{height:auto!important} and use body.offsetHeight."
  },
  {
    id: "DIALOG-002",
    filePattern: /\.(tsx|jsx)$/i,
    contentPattern: /DialogContent[^>]*className[^>]*overflow-y-auto(?![^>]*showCloseButton)/,
    message: "DIALOG-002: Scrollable DialogContent without showCloseButton={false} — close button may scroll away. Add sticky header with explicit X."
  },
  {
    id: "TS-004",
    filePattern: /\.(tsx|jsx|ts)$/i,
    contentPattern: /useState<unknown\[\]>/,
    message: "TS-004: useState<unknown[]> causes downstream TypeScript errors when array items are passed as component props. Define a named interface: useState<MyItem[]>()."
  },
  {
    id: "ASYNC-001",
    filePattern: /\.(tsx|jsx|ts)$/i,
    contentPattern: /useEffect\(\s*async\s*\(/,
    message: "ASYNC-001: Inline async callback in useEffect causes unhandled promise rejections on unmount. Use: useEffect(() => { async function load() { ... } load(); }, []) instead."
  },
  {
    id: "FE-003",
    filePattern: /page\.(tsx|jsx)$/i,
    contentPattern: /['"]use client['"][\s\S]*export\s+(const\s+metadata|function\s+generateMetadata)|export\s+(const\s+metadata|function\s+generateMetadata)[\s\S]*['"]use client['"]/,
    message: "FE-003: 'use client' and metadata export in the same Next.js page file - Next.js silently ignores metadata in client components. Move metadata to a co-located layout.tsx."
  },
  {
    id: "TRUNC-001",
    filePattern: /\.(tsx|jsx)$/i,
    contentPattern: /\.substring\(\s*0\s*,\s*\d+\s*\)\s*\+?\s*["'`]\.{2,3}["'`]?|\.slice\(\s*0\s*,\s*\d+\s*\)\s*\+?\s*["'`]\.{2,3}["'`]?/,
    message: "TRUNC-001: JS .substring()/.slice() + '...' truncation in JSX — use CSS 'truncate max-w-[Npx] inline-block align-bottom' instead for graceful responsive overflow."
  },
  {
    id: "DEBOUNCE-001",
    filePattern: /\.(tsx|jsx)$/i,
    contentPattern: /setTimeout\s*\(\s*async\s/,
    message: "DEBOUNCE-001: async function inside setTimeout without useRef cleanup — use useRef for timer ID and clear in useEffect cleanup to prevent stale closures and memory leaks on unmount."
  },
];

function checkRules(filePath, content) {
  const warnings = [];
  for (const rule of RULES) {
    if (!rule.filePattern.test(filePath)) continue;
    if (rule.contentPattern.test(content)) {
      warnings.push(`[${rule.id}] ${rule.message}`);
    }
  }
  return warnings;
}

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => { input += chunk; });
process.stdin.on("end", () => {
  try {
    if (!input.trim()) {
      console.log(JSON.stringify({ decision: "allow" }));
      process.exit(0);
    }

    const data = JSON.parse(input);
    const toolName = data.tool_name || "";
    const toolInput = data.tool_input || {};
    const filePath = toolInput.file_path || "";

    if (!filePath) {
      console.log(JSON.stringify({ decision: "allow" }));
      process.exit(0);
    }

    let content = "";
    if (toolName === "Edit") {
      content = toolInput.new_string || "";
    } else if (toolName === "Write") {
      content = toolInput.content || "";
    }

    if (!content) {
      console.log(JSON.stringify({ decision: "allow" }));
      process.exit(0);
    }

    const warnings = checkRules(filePath, content);

    if (warnings.length > 0) {
      console.log(JSON.stringify({
        decision: "warn",
        reason: `Quality Guardian detected potential issues:\n${warnings.join("\n")}`
      }));
    } else {
      console.log(JSON.stringify({ decision: "allow" }));
    }
  } catch {
    console.log(JSON.stringify({ decision: "allow" }));
  }
});
