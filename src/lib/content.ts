/**
 * CENTRAL CONTENT REGISTRY — TEAM 404
 *
 * Real roster/project data lives alongside deliberately unresolved fields.
 * Bracketed values ([LIKE THIS]) are the system's language ("missing
 * data") and each one is a single edit point for the remaining real info.
 * Nothing here is a fabricated fact.
 */

export const TEAM = {
  name: "TEAM 404",
  nodes: "06",
  origin: "UNKNOWN",
  type: "HACKATHON UNIT",
  state: "ACTIVE",
};

export interface Member {
  id: string;
  ref: string;
  name: string;
  role: string;
  focus: string;
  grid: string;
  note: string;
}

export const MEMBERS: Member[] = [
  {
    id: "01",
    ref: "N.01",
    name: "FARHAN",
    role: "PROGRAMMER",
    focus: "[FOCUS]",
    grid: "G.02",
    note: "[ONE-LINE NOTE ABOUT THIS PERSON — TO BE REPLACED.]",
  },
  {
    id: "02",
    ref: "N.02",
    name: "ZEESHAN",
    role: "PROGRAMMER",
    focus: "[FOCUS]",
    grid: "G.05",
    note: "[ONE-LINE NOTE ABOUT THIS PERSON — TO BE REPLACED.]",
  },
  {
    id: "03",
    ref: "N.03",
    name: "NOEL",
    role: "RESEARCH",
    focus: "[FOCUS]",
    grid: "G.07",
    note: "[ONE-LINE NOTE ABOUT THIS PERSON — TO BE REPLACED.]",
  },
  {
    id: "04",
    ref: "N.04",
    name: "VASU",
    role: "DESIGN",
    focus: "[FOCUS]",
    grid: "G.11",
    note: "[ONE-LINE NOTE ABOUT THIS PERSON — TO BE REPLACED.]",
  },
  {
    id: "05",
    ref: "N.05",
    name: "KRUTHIKA",
    role: "DESIGN",
    focus: "[FOCUS]",
    grid: "G.13",
    note: "[ONE-LINE NOTE ABOUT THIS PERSON — TO BE REPLACED.]",
  },
  {
    id: "06",
    ref: "N.06",
    name: "DEBORAH",
    role: "DESIGN",
    focus: "[FOCUS]",
    grid: "G.17",
    note: "[ONE-LINE NOTE ABOUT THIS PERSON — TO BE REPLACED.]",
  },
];

export interface Project {
  id: string;
  ref: string;
  title: string;
  desc: string;
  stack: string[];
  status: string;
  node: string;
}

export const PROJECTS: Project[] = [
  {
    id: "01",
    ref: "PRJ-001",
    title: "COLLEGE MANAGEMENT APP",
    desc: "Campus records, timetables and student flow in one system. Built to survive a hackathon weekend.",
    stack: ["[STACK]", "[STACK]"],
    status: "[STATUS]",
    node: "[NODE]",
  },
  {
    id: "02",
    ref: "PRJ-002",
    title: "FINANCE MANAGING APP",
    desc: "Budgets, spends and balances tracked in real time. The numbers stay honest even when the room doesn't.",
    stack: ["[STACK]", "[STACK]"],
    status: "[STATUS]",
    node: "[NODE]",
  },
  {
    id: "03",
    ref: "PRJ-003",
    title: "[PROJECT 003]",
    desc: "[PROJECT DESCRIPTION — TO BE REPLACED.]",
    stack: ["[STACK]", "[STACK]"],
    status: "[STATUS]",
    node: "[NODE]",
  },
];

export interface EventEntry {
  id: string;
  ref: string;
  event: string;
  date: string;
  result: string;
}

export const EVENTS: EventEntry[] = [
  {
    id: "01",
    ref: "LOG-001",
    event: "[EVENT / HACKATHON]",
    date: "[----.--]",
    result: "[RESULT]",
  },
  {
    id: "02",
    ref: "LOG-002",
    event: "[EVENT / HACKATHON]",
    date: "[----.--]",
    result: "[RESULT]",
  },
  {
    id: "03",
    ref: "LOG-003",
    event: "[EVENT / HACKATHON]",
    date: "[----.--]",
    result: "[RESULT]",
  },
  {
    id: "04",
    ref: "LOG-004",
    event: "[EVENT / HACKATHON]",
    date: "[----.--]",
    result: "[RESULT]",
  },
];

export const STATUSES = [
  "MISSING",
  "LOCALIZED",
  "IDENTIFIED",
  "ACTIVE",
  "RESOLVED",
] as const;
