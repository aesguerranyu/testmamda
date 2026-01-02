export interface Promise {
  id: string;
  headline: string;
  shortDescription: string;
  category: string;
  status: string;
  date: string;
}

export interface Update {
  id: string;
  type: "promise" | "action";
  headline?: string;
  description?: string;
  date: string;
  promiseId?: string;
}

export const promises: Promise[] = [
  {
    id: "1",
    headline: "Free Public Transit",
    shortDescription: "Eliminate fares on NYC buses and subways for all residents",
    category: "Transportation",
    status: "In Progress",
    date: "2025-11-15",
  },
  {
    id: "2",
    headline: "Universal Rent Control",
    shortDescription: "Expand rent stabilization to cover all NYC apartments",
    category: "Housing",
    status: "Not Started",
    date: "2025-10-20",
  },
  {
    id: "3",
    headline: "Green New Deal for NYC",
    shortDescription: "100% renewable energy for city operations by 2030",
    category: "Environment",
    status: "In Progress",
    date: "2025-12-01",
  },
  {
    id: "4",
    headline: "Community Control of Police",
    shortDescription: "Transfer oversight of NYPD to elected neighborhood councils",
    category: "Public Safety",
    status: "Not Started",
    date: "2025-09-10",
  },
  {
    id: "5",
    headline: "Cancel Medical Debt",
    shortDescription: "Use city funds to buy and cancel outstanding medical debt",
    category: "Healthcare",
    status: "Completed",
    date: "2025-08-25",
  },
  {
    id: "6",
    headline: "Universal Pre-K Expansion",
    shortDescription: "Extend free pre-K to all 3-year-olds citywide",
    category: "Education",
    status: "In Progress",
    date: "2025-11-01",
  },
];

export const updates: Update[] = [
  {
    id: "u1",
    type: "promise",
    headline: "Free Public Transit",
    date: "2026-01-02",
    promiseId: "1",
  },
  {
    id: "u2",
    type: "action",
    description: "Mayor signs executive order on housing emergency",
    date: "2026-01-02",
  },
  {
    id: "u3",
    type: "promise",
    headline: "Green New Deal for NYC",
    date: "2026-01-01",
    promiseId: "3",
  },
  {
    id: "u4",
    type: "action",
    description: "First cabinet appointments announced",
    date: "2026-01-02",
  },
  {
    id: "u5",
    type: "promise",
    headline: "Universal Pre-K Expansion",
    date: "2025-12-28",
    promiseId: "6",
  },
];

export function getLatestUpdates(count: number): Update[] {
  return [...updates]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}
