import { SignalType } from "@prisma/client";
import { prisma } from "../db.js";

const sourceNames = ["Mock LinkedIn", "Mock News", "Mock Product Hunt"];
const companies = ["Stealth AI", "Vector Labs", "Northstar Systems", "Forge Cloud", "Relay Finance"];
const signalTypes: SignalType[] = [
  "JOB_CHANGE",
  "COMPANY_STARTED",
  "PRODUCT_LAUNCH",
  "FUNDRAISING",
  "HIRING",
  "COFOUNDER_SEARCH",
  "COMPANY_PIVOT",
  "SOCIAL_TRACTION",
];

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function confidence() {
  return Number((0.6 + Math.random() * 0.35).toFixed(2));
}

function buildSignal(founder: {
  fullName: string;
  currentTitle: string | null;
  currentCompany: string | null;
  tags: { tag: { name: string } }[];
}) {
  const name = founder.fullName;
  const oldRole = founder.currentTitle || "their previous role";
  const oldCompany = founder.currentCompany || "their company";
  const newCompany = pick(companies);
  const tag = founder.tags[0]?.tag.name || "their market";
  const signalType = pick(signalTypes);

  const templates: Record<SignalType, { title: string; description: string }> = {
    JOB_CHANGE: {
      title: `${name} changed role to Founder at ${newCompany}`,
      description: `${name} changed role from ${oldRole} to Founder at ${newCompany}.`,
    },
    COMPANY_STARTED: {
      title: `${name} appears to be starting ${newCompany}`,
      description: `${name} updated their profile to mention a new stealth startup.`,
    },
    PRODUCT_LAUNCH: {
      title: `${name} launched a ${tag} prototype`,
      description: `${name} posted about a new product related to ${tag}.`,
    },
    FUNDRAISING: {
      title: `${oldCompany} was mentioned in seed funding chatter`,
      description: `${name}'s company was mentioned in a seed funding announcement.`,
    },
    HIRING: {
      title: `${name} is hiring founding engineers`,
      description: `${name} is hiring founding engineers for ${oldCompany}.`,
    },
    COFOUNDER_SEARCH: {
      title: `${name} may be looking for a cofounder`,
      description: `${name} posted about looking for a cofounder.`,
    },
    COMPANY_PIVOT: {
      title: `${name} may be pivoting ${oldCompany}`,
      description: `${name} changed company description, suggesting a possible pivot.`,
    },
    SOCIAL_TRACTION: {
      title: `${name} is getting social traction`,
      description: `${name}'s recent product post is seeing unusual founder and investor engagement.`,
    },
    MANUAL: {
      title: `${name} had a manual update`,
      description: `Manual update for ${name}.`,
    },
  };

  return { signalType, ...templates[signalType] };
}

export async function runMockIngestion() {
  const founders = await prisma.founder.findMany({
    include: {
      tags: { include: { tag: true } },
      updates: { select: { title: true } },
    },
  });

  const selected = founders.sort(() => Math.random() - 0.5).slice(0, Math.min(founders.length, Math.floor(Math.random() * 3) + 1));
  const created = [];

  for (const founder of selected) {
    let candidate = buildSignal(founder);
    let attempts = 0;
    while (founder.updates.some((update) => update.title === candidate.title) && attempts < 5) {
      candidate = buildSignal(founder);
      attempts += 1;
    }

    if (founder.updates.some((update) => update.title === candidate.title)) continue;

    created.push(
      await prisma.updateSignal.create({
        data: {
          founderId: founder.id,
          ...candidate,
          sourceName: pick(sourceNames),
          sourceUrl: "",
          confidenceScore: confidence(),
          detectedAt: new Date(),
        },
        include: { founder: true },
      })
    );
  }

  return created;
}
