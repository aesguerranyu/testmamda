## Budget Page Implementation

### Overview

Create a new `/budget` page presenting the FY2027 Preliminary Budget data using the existing MamdaniTracker design system (Tailwind classes, existing UI components, brand colors, zero-radius corners, existing font stack). No external fonts or custom CSS will be imported.

### What Gets Built

**1. New Page: `src/pages/public/Budget.tsx**`

A static data-display page structured as follows:

- **Hero section** -- Blue (`#0C2788`) background with yellow top-border accent, eyebrow label "RELEASED FEBRUARY 18, 2026 - NYC OMB", title "FY2027 Preliminary Budget", and subtitle. Matches existing page hero patterns (border-t-4, tracking-tight, etc.) but with a blue background variant.
- **KPI strip** -- 4-column responsive grid (2-col on mobile) showing: Total Budget $127B, Agency Spending $94B, New Investment $576M, FY2028 Gap $6.7B. Uses white background cards with colored number values using existing subway/brand color tokens.
- **Content sections** organized in responsive 2-column and full-width layouts:
  - Agency Spending Breakdown (horizontal bar chart built with inline Tailwind styles)
  - Revenue Sources (donut/pie visualization using SVG + legend list)
  - Inherited Fiscal Crisis (stat pairs + split-line items + callout)
  - New Programmatic Spending (itemized list with amounts + callout)
  - Gap Reduction (split-line items with positive/negative coloring)
  - Campaign Pledge Tracker (progress bars for Parks and Libraries pledges)
  - 5-Year Capital Plan (split-line items)
  - Outyear Financial Plan (data table using existing `Table` components)
  - Two Paths to Close the Gap (callout cards)
- **SEO metadata** via existing `<SEO>` component

**2. Route Registration in `src/App.tsx**`

- Add `import Budget from "./pages/public/Budget"` 
- Add `<Route path="/budget" element={<Budget />} />` inside the PublicLayout routes

**3. Navigation Update in `src/components/public/PublicHeader.tsx**`

- Add `{ path: "/budget", label: "Budget" }` to `navItems` array

### Technical Details

- All styling uses existing [MamdaniTracker.nyc](http://MamdaniTracker.nyc) design system in / and /promises and system colors
- Bar charts rendered as `div` elements with percentage widths and colored backgrounds
- SVG donut chart for revenue breakdown (simple `stroke-dasharray` circle approach)
- Financial table uses existing `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` components from `@/components/ui/table`
- Responsive: 2-col grid on desktop, stacks to 1-col on mobile via Tailwind breakpoints
- All data is hardcoded (static budget figures)
- Zero border-radius maintained throughout (matches `--radius: 0rem`)
- Font family inherited from existing system (`Helvetica Neue` stack)
- Callout boxes use `border-l-4` with colored accents + pale backgrounds

### Files Changed


| File                                     | Change                         |
| ---------------------------------------- | ------------------------------ |
| `src/pages/public/Budget.tsx`            | New file -- entire budget page |
| `src/App.tsx`                            | Add route + import             |
| `src/components/public/PublicHeader.tsx` | Add "Budget" nav item          |
