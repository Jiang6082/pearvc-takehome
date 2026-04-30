import bcrypt from "bcrypt";
import { PrismaClient, SignalType, TrackingPriority, TrackingStatus } from "@prisma/client";

const prisma = new PrismaClient();

const users = [
  { name: "Alex Investor", email: "alex@example.com" },
  { name: "Priya Investor", email: "priya@example.com" },
  { name: "Marcus Investor", email: "marcus@example.com" },
];

const tags = ["AI", "AI Infra", "Developer Tools", "Consumer", "Fintech", "Ex-OpenAI", "Repeat Founder", "Technical Founder"];

const founders = [
  {
    fullName: "Jane Doe",
    linkedinUrl: "https://linkedin.com/in/janedoe",
    currentTitle: "Founder",
    currentCompany: "Stealth AI",
    location: "San Francisco",
    bio: "Former Staff Engineer at OpenAI, now building applied AI infrastructure.",
    tags: ["AI", "AI Infra", "Ex-OpenAI", "Technical Founder"],
  },
  {
    fullName: "Sam Lee",
    linkedinUrl: "https://linkedin.com/in/samlee",
    currentTitle: "Product Lead",
    currentCompany: "DevLayer",
    location: "New York",
    bio: "Ex-Stripe product lead working on developer tools.",
    tags: ["Developer Tools"],
  },
  {
    fullName: "Maria Chen",
    linkedinUrl: "https://linkedin.com/in/mariachen",
    currentTitle: "Researcher",
    currentCompany: "Independent",
    location: "Berkeley",
    bio: "Former researcher at Anthropic exploring AI safety tooling.",
    tags: ["AI", "Technical Founder"],
  },
  {
    fullName: "David Kim",
    linkedinUrl: "https://linkedin.com/in/davidkim",
    currentTitle: "Founder",
    currentCompany: "LedgerWorks",
    location: "Austin",
    bio: "Repeat founder building fintech infrastructure.",
    tags: ["Fintech", "Repeat Founder"],
  },
  {
    fullName: "Rachel Gupta",
    linkedinUrl: "https://linkedin.com/in/rachelgupta",
    currentTitle: "Designer-Founder",
    currentCompany: "MuseLoop",
    location: "Los Angeles",
    bio: "Ex-Apple designer working on a consumer social app.",
    tags: ["Consumer"],
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const createdUsers = Object.fromEntries(
    await Promise.all(
      users.map((user) =>
        prisma.user.upsert({
          where: { email: user.email },
          update: { name: user.name, passwordHash },
          create: { ...user, passwordHash },
        })
      )
    ).then((rows) => rows.map((user) => [user.email, user]))
  );

  await Promise.all(tags.map((name) => prisma.tag.upsert({ where: { name }, create: { name }, update: {} })));

  const createdFounders = new Map<string, string>();
  for (const founder of founders) {
    const row = await prisma.founder.upsert({
      where: { linkedinUrl: founder.linkedinUrl },
      update: {
        fullName: founder.fullName,
        currentTitle: founder.currentTitle,
        currentCompany: founder.currentCompany,
        location: founder.location,
        bio: founder.bio,
      },
      create: {
        fullName: founder.fullName,
        linkedinUrl: founder.linkedinUrl,
        currentTitle: founder.currentTitle,
        currentCompany: founder.currentCompany,
        location: founder.location,
        bio: founder.bio,
      },
    });
    createdFounders.set(founder.fullName, row.id);

    const tagRows = await prisma.tag.findMany({ where: { name: { in: founder.tags } } });
    for (const tag of tagRows) {
      await prisma.founderTag.upsert({
        where: { founderId_tagId: { founderId: row.id, tagId: tag.id } },
        update: {},
        create: { founderId: row.id, tagId: tag.id },
      });
    }
  }

  const tracking: Array<[string, string, TrackingStatus, TrackingPriority, boolean, string]> = [
    ["alex@example.com", "Jane Doe", "WARM", "HIGH", true, "Met at demo day. Very strong technical background."],
    ["alex@example.com", "Sam Lee", "WATCHING", "MEDIUM", false, "Follow product launches and dev community response."],
    ["priya@example.com", "Jane Doe", "WATCHING", "HIGH", false, "Priya knows her from an AI infra dinner."],
    ["priya@example.com", "Maria Chen", "WARM", "HIGH", true, "Safety tooling angle could become fundable quickly."],
    ["marcus@example.com", "David Kim", "ACTIVE", "HIGH", true, "Repeat founder with credible fintech wedge."],
    ["marcus@example.com", "Rachel Gupta", "WATCHING", "MEDIUM", true, "Design-led consumer founder, still early."],
  ];

  for (const [email, founderName, status, priority, isOwner, privateNotes] of tracking) {
    await prisma.tracking.upsert({
      where: { userId_founderId: { userId: createdUsers[email].id, founderId: createdFounders.get(founderName)! } },
      update: { status, priority, isOwner, privateNotes },
      create: { userId: createdUsers[email].id, founderId: createdFounders.get(founderName)!, status, priority, isOwner, privateNotes },
    });
  }

  const updates: Array<[string, SignalType, string, string, string, boolean]> = [
    ["Jane Doe", "JOB_CHANGE", "Jane changed title to Founder at Stealth AI", "Jane's profile now lists her as Founder at Stealth AI after leaving OpenAI.", "Mock LinkedIn", true],
    ["Sam Lee", "PRODUCT_LAUNCH", "Sam launched a new developer tool prototype", "Sam shared a prototype for improving API testing workflows.", "Mock Product Hunt", false],
    ["Maria Chen", "COFOUNDER_SEARCH", "Maria posted about looking for a cofounder", "Maria is looking for a technical cofounder for AI safety tooling.", "Mock LinkedIn", true],
    ["David Kim", "HIRING", "David's company is hiring founding engineers", "LedgerWorks posted roles for founding backend and infrastructure engineers.", "Mock News", false],
    ["Rachel Gupta", "COMPANY_PIVOT", "Rachel pivoted from consumer social to creator tools", "MuseLoop's positioning changed toward creator workflow tooling.", "Mock LinkedIn", false],
  ];

  for (const [founderName, signalType, title, description, sourceName, isImportant] of updates) {
    const founderId = createdFounders.get(founderName)!;
    const existing = await prisma.updateSignal.findFirst({ where: { founderId, title } });
    if (!existing) {
      await prisma.updateSignal.create({
        data: { founderId, signalType, title, description, sourceName, confidenceScore: 0.86, isImportant, detectedAt: new Date() },
      });
    }
  }

  const notes: Array<[string, string, string]> = [
    ["Jane Doe", "alex@example.com", "Jane had sharp answers on infra go-to-market and kept the scope refreshingly narrow."],
    ["Jane Doe", "priya@example.com", "Priya met her at an AI dinner. Strong founder-market fit signal."],
    ["Sam Lee", "alex@example.com", "Sam is still testing ideas, but has unusual empathy for developer pain."],
    ["Maria Chen", "priya@example.com", "Deep technical insight. Needs a commercial cofounder or wedge."],
    ["David Kim", "marcus@example.com", "Already has design partners from prior founder network."],
    ["Rachel Gupta", "marcus@example.com", "Consumer insight is strong; watch for retention proof."],
  ];

  for (const [founderName, email, body] of notes) {
    const founderId = createdFounders.get(founderName)!;
    const authorId = createdUsers[email].id;
    const existing = await prisma.sharedNote.findFirst({ where: { founderId, authorId, body } });
    if (!existing) await prisma.sharedNote.create({ data: { founderId, authorId, body } });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed data created.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
