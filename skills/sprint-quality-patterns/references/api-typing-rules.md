# API Typing Rules

## Rule 1: Never Use `Record<string, unknown>` for API State

Every API response stored in React state MUST have a named interface.

### Why
`Record<string, unknown>` makes every property access return `unknown`, which cannot be assigned to typed component props. This causes TypeScript build failures that only appear at build time, not during development.

### Pattern
```tsx
// WRONG — will cause build failure
const [data, setData] = useState<Record<string, unknown> | null>(null);

// RIGHT — explicit interface
interface ApiResponse {
  field1: number;
  field2: string;
  nested: { subField: boolean };
}
const [data, setData] = useState<ApiResponse | null>(null);
```

### Where to Define Interfaces
- **Shared types:** `types/index.ts` (if used across multiple pages)
- **Page-specific types:** Top of the page file (if only used in one page)
- **API route response types:** Export from the route file or types/index.ts

## Rule 2: Type All Array State

### Pattern
```tsx
// WRONG
const [items, setItems] = useState<unknown[]>([]);

// RIGHT
interface GrowthDataPoint {
  date: string;
  count: number;
}
const [items, setItems] = useState<GrowthDataPoint[]>([]);
```

## Rule 3: API Error Responses Need Types Too

```tsx
interface ApiError {
  error: string;
  code?: string;
  details?: string;
}

// Handle both success and error
const res = await fetch(url);
if (!res.ok) {
  const err: ApiError = await res.json();
  setError(err.error);
  return;
}
const data: SuccessType = await res.json();
```

## Rule 4: Supabase Query Results

```tsx
// WRONG — data is any
const { data } = await supabase.from("table").select("*");

// RIGHT — type the query
const { data } = await supabase
  .from("table")
  .select("id, name, status")
  .returns<Array<{ id: string; name: string; status: string }>>();
```

## Rule 5: Event Handler Types

Common event types for React:
```tsx
React.ChangeEvent<HTMLInputElement>       // input onChange
React.ChangeEvent<HTMLTextAreaElement>     // textarea onChange
React.ChangeEvent<HTMLSelectElement>       // select onChange
React.FormEvent<HTMLFormElement>           // form onSubmit
React.MouseEvent<HTMLButtonElement>        // button onClick
React.KeyboardEvent<HTMLInputElement>      // input onKeyDown
```

## Sprint Planning Checklist for API Types

When a sprint task involves API integration:
- [ ] List all API endpoints being consumed
- [ ] Define response interface for each endpoint
- [ ] Define error interface
- [ ] Specify null handling strategy (optional chaining vs conditional render)
- [ ] Add interfaces to types/index.ts if shared
