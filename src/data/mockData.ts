export type PromiseStatus = "Not started" | "In progress" | "Completed" | "Stalled";
export type PromiseCategory = "Housing" | "Transportation" | "Education" | "Healthcare" | "Environment" | "Economic Justice" | "Public Safety" | "Government Reform";

export interface Promise {
  id: string;
  headline: string;
  shortDescription: string;
  description: string[];
  category: PromiseCategory;
  status: PromiseStatus;
  datePromised: string;
  lastUpdated: string;
  ownerAgency?: string;
  requiresStateAction: "Yes" | "No" | "Partial";
  sources: { title: string; url: string; date?: string }[];
  updates?: string[];
}

export interface Action {
  id: string;
  type: string;
  description: string;
  date: string;
  promiseId?: string;
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
    description: [
      "Make all NYC subway and bus rides free for residents",
      "Phase in over 4 years starting with low-income riders",
      "Fund through congestion pricing and progressive taxation"
    ],
    category: "Transportation",
    status: "In progress",
    datePromised: "2025-03-15",
    lastUpdated: "2026-01-02",
    ownerAgency: "MTA / NYC DOT",
    requiresStateAction: "Yes",
    sources: [
      { title: "Campaign Policy Platform", url: "https://example.com/platform", date: "2025-03-15" },
      { title: "Press Conference Announcement", url: "https://example.com/announcement", date: "2025-11-20" }
    ],
    updates: ["Pilot program for low-income riders announced for Q2 2026"]
  },
  {
    id: "2",
    headline: "Universal Rent Control",
    shortDescription: "Expand rent stabilization to cover all NYC apartments",
    description: [
      "Extend rent stabilization to all apartments regardless of construction date",
      "Cap annual rent increases at inflation rate",
      "Strengthen tenant protections against eviction"
    ],
    category: "Housing",
    status: "Not started",
    datePromised: "2025-02-20",
    lastUpdated: "2025-12-15",
    ownerAgency: "HPD",
    requiresStateAction: "Yes",
    sources: [
      { title: "Housing Policy Proposal", url: "https://example.com/housing", date: "2025-02-20" }
    ],
    updates: []
  },
  {
    id: "3",
    headline: "Green New Deal for NYC",
    shortDescription: "100% renewable energy for city operations by 2030",
    description: [
      "Transition all city buildings to renewable energy",
      "Electrify city vehicle fleet",
      "Create 50,000 green jobs"
    ],
    category: "Environment",
    status: "In progress",
    datePromised: "2025-04-22",
    lastUpdated: "2026-01-01",
    ownerAgency: "Mayor's Office of Climate and Environmental Justice",
    requiresStateAction: "Partial",
    sources: [
      { title: "Climate Action Plan", url: "https://example.com/climate", date: "2025-04-22" }
    ],
    updates: ["Solar panel installation begins on city buildings"]
  },
  {
    id: "4",
    headline: "Community Control of Police",
    shortDescription: "Transfer oversight of NYPD to elected neighborhood councils",
    description: [
      "Create elected civilian oversight boards in each precinct",
      "Give boards authority over hiring, discipline, and budget",
      "Implement community-based public safety programs"
    ],
    category: "Public Safety",
    status: "Not started",
    datePromised: "2025-06-10",
    lastUpdated: "2025-12-01",
    ownerAgency: "NYPD / City Council",
    requiresStateAction: "No",
    sources: [
      { title: "Public Safety Reform Proposal", url: "https://example.com/safety", date: "2025-06-10" }
    ],
    updates: []
  },
  {
    id: "5",
    headline: "Cancel Medical Debt",
    shortDescription: "Use city funds to buy and cancel outstanding medical debt",
    description: [
      "Purchase medical debt from collectors at pennies on the dollar",
      "Cancel debt for NYC residents",
      "Partner with RIP Medical Debt nonprofit"
    ],
    category: "Healthcare",
    status: "Completed",
    datePromised: "2025-01-15",
    lastUpdated: "2025-12-20",
    ownerAgency: "NYC Health + Hospitals",
    requiresStateAction: "No",
    sources: [
      { title: "Medical Debt Initiative", url: "https://example.com/medical", date: "2025-01-15" },
      { title: "Program Completion Announcement", url: "https://example.com/complete", date: "2025-12-20" }
    ],
    updates: ["$500 million in medical debt cancelled for 200,000 NYC residents"]
  },
  {
    id: "6",
    headline: "Universal Pre-K Expansion",
    shortDescription: "Extend free pre-K to all 3-year-olds citywide",
    description: [
      "Guarantee pre-K seat for every 3-year-old",
      "Increase teacher pay and training",
      "Extend program hours to match work schedules"
    ],
    category: "Education",
    status: "In progress",
    datePromised: "2025-05-01",
    lastUpdated: "2025-12-28",
    ownerAgency: "NYC Department of Education",
    requiresStateAction: "No",
    sources: [
      { title: "Education Platform", url: "https://example.com/education", date: "2025-05-01" }
    ],
    updates: ["50 new pre-K classrooms opening in underserved neighborhoods"]
  },
  {
    id: "7",
    headline: "Worker Cooperative Fund",
    shortDescription: "Create $50M fund to support worker-owned businesses",
    description: [
      "Provide low-interest loans to worker cooperatives",
      "Offer technical assistance and training",
      "Prioritize cooperatives in underserved communities"
    ],
    category: "Economic Justice",
    status: "In progress",
    datePromised: "2025-07-20",
    lastUpdated: "2025-12-10",
    ownerAgency: "SBS",
    requiresStateAction: "No",
    sources: [
      { title: "Economic Democracy Initiative", url: "https://example.com/coop", date: "2025-07-20" }
    ],
    updates: ["First round of applications now open"]
  },
  {
    id: "8",
    headline: "Participatory Budgeting Expansion",
    shortDescription: "Give residents direct control over $1B in city spending",
    description: [
      "Expand participatory budgeting to all council districts",
      "Increase funding to $1 billion annually",
      "Streamline voting process with online options"
    ],
    category: "Government Reform",
    status: "Not started",
    datePromised: "2025-08-15",
    lastUpdated: "2025-11-30",
    ownerAgency: "City Council",
    requiresStateAction: "No",
    sources: [
      { title: "Democracy Reform Platform", url: "https://example.com/democracy", date: "2025-08-15" }
    ],
    updates: []
  }
];

export const actions: Action[] = [
  {
    id: "a1",
    type: "Executive Order",
    description: "Mayor signs executive order on housing emergency",
    date: "2026-01-02",
    promiseId: "2"
  },
  {
    id: "a2",
    type: "Appointment",
    description: "First cabinet appointments announced",
    date: "2026-01-02"
  },
  {
    id: "a3",
    type: "Budget Proposal",
    description: "Preliminary budget includes transit fare subsidy",
    date: "2026-01-01",
    promiseId: "1"
  },
  {
    id: "a4",
    type: "Legislation",
    description: "City Council introduces Green Buildings Act",
    date: "2025-12-28",
    promiseId: "3"
  }
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

export function getPromiseById(id: string): Promise | undefined {
  return promises.find(p => p.id === id);
}

export function getActionsByPromiseId(id: string): Action[] {
  return actions.filter(a => a.promiseId === id);
}
