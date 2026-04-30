import { Prisma, SignalType, TrackingPriority, TrackingStatus } from "@prisma/client";
import { prisma } from "../db.js";
import { findLikelyDuplicate } from "../utils/duplicateDetection.js";

const founderInclude = {
  tags: { include: { tag: true } },
  trackingRelationships: { include: { user: { select: { id: true, name: true, email: true } } } },
  updates: { orderBy: { detectedAt: "desc" as const }, take: 1 },
} satisfies Prisma.FounderInclude;

export async function upsertTags(names: string[]) {
  return Promise.all(
    [...new Set(names.map((name) => name.trim()).filter(Boolean))].map((name) =>
      prisma.tag.upsert({ where: { name }, create: { name }, update: {} })
    )
  );
}

export async function createFounderForUser(
  userId: string,
  input: {
    fullName: string;
    linkedinUrl?: string;
    email?: string;
    currentTitle?: string;
    currentCompany?: string;
    location?: string;
    bio?: string;
    profileImageUrl?: string;
    tags?: string[];
    status?: TrackingStatus;
    priority?: TrackingPriority;
    privateNotes?: string;
  }
) {
  let founder = input.linkedinUrl
    ? await prisma.founder.findUnique({ where: { linkedinUrl: input.linkedinUrl } })
    : null;

  if (!founder && !input.linkedinUrl) {
    const founders = await prisma.founder.findMany();
    founder = findLikelyDuplicate(input, founders) || null;
  }

  const duplicateFound = Boolean(founder);

  if (!founder) {
    const tags = await upsertTags(input.tags || []);
    founder = await prisma.founder.create({
      data: {
        fullName: input.fullName,
        linkedinUrl: input.linkedinUrl || null,
        email: input.email || null,
        currentTitle: input.currentTitle || null,
        currentCompany: input.currentCompany || null,
        location: input.location || null,
        bio: input.bio || null,
        profileImageUrl: input.profileImageUrl || null,
        tags: { create: tags.map((tag) => ({ tagId: tag.id })) },
      },
    });
  }

  if (input.status || input.priority || input.privateNotes) {
    await prisma.tracking.upsert({
      where: { userId_founderId: { userId, founderId: founder.id } },
      create: {
        userId,
        founderId: founder.id,
        status: input.status || "WATCHING",
        priority: input.priority || "MEDIUM",
        privateNotes: input.privateNotes || null,
      },
      update: {
        status: input.status || undefined,
        priority: input.priority || undefined,
        privateNotes: input.privateNotes ?? undefined,
      },
    });
  }

  return {
    duplicateFound,
    founder: await getFounderById(founder.id, userId),
  };
}

export async function listFounders(userId: string, query: Record<string, string | undefined>) {
  const and: Prisma.FounderWhereInput[] = [];

  if (query.search) {
    and.push({
      OR: [
        { fullName: { contains: query.search, mode: "insensitive" } },
        { currentCompany: { contains: query.search, mode: "insensitive" } },
        { currentTitle: { contains: query.search, mode: "insensitive" } },
      ],
    });
  }
  if (query.tag) and.push({ tags: { some: { tag: { name: query.tag } } } });
  if (query.status) and.push({ trackingRelationships: { some: { status: query.status as TrackingStatus } } });
  if (query.priority) and.push({ trackingRelationships: { some: { priority: query.priority as TrackingPriority } } });
  if (query.ownerId) and.push({ trackingRelationships: { some: { userId: query.ownerId, isOwner: true } } });
  if (query.trackedByMe === "true") and.push({ trackingRelationships: { some: { userId } } });
  if (query.signalType) and.push({ updates: { some: { signalType: query.signalType as SignalType } } });

  const founders = await prisma.founder.findMany({
    where: and.length ? { AND: and } : undefined,
    include: founderInclude,
  });

  const priorityRank = { HIGH: 3, MEDIUM: 2, LOW: 1 };
  const enriched = founders.map((founder) => {
    const owner = founder.trackingRelationships.find((tracking) => tracking.isOwner)?.user || null;
    const myTracking = founder.trackingRelationships.find((tracking) => tracking.userId === userId) || null;
    return {
      ...founder,
      tags: founder.tags.map((item) => item.tag),
      trackingCount: founder.trackingRelationships.length,
      primaryOwner: owner,
      latestUpdate: founder.updates[0] || null,
      myTracking,
    };
  });

  const sortBy = query.sortBy || "newest";
  const order = query.sortOrder === "asc" ? 1 : -1;
  enriched.sort((a, b) => {
    if (sortBy === "name") return a.fullName.localeCompare(b.fullName) * order;
    if (sortBy === "priority") return ((priorityRank[a.myTracking?.priority || "LOW"] || 0) - (priorityRank[b.myTracking?.priority || "LOW"] || 0)) * order;
    if (sortBy === "lastContacted") return ((a.myTracking?.lastContactedAt?.getTime() || 0) - (b.myTracking?.lastContactedAt?.getTime() || 0)) * order;
    if (sortBy === "recentUpdate") return ((a.latestUpdate?.detectedAt.getTime() || 0) - (b.latestUpdate?.detectedAt.getTime() || 0)) * order;
    return (a.createdAt.getTime() - b.createdAt.getTime()) * order;
  });

  return enriched;
}

export async function getFounderById(id: string, userId: string) {
  const founder = await prisma.founder.findUnique({
    where: { id },
    include: {
      tags: { include: { tag: true } },
      trackingRelationships: {
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: [{ isOwner: "desc" }, { createdAt: "asc" }],
      },
      sharedNotes: {
        include: { author: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      },
      updates: { orderBy: { detectedAt: "desc" } },
    },
  });

  if (!founder) return null;

  return {
    ...founder,
    tags: founder.tags.map((item) => item.tag),
    trackingCount: founder.trackingRelationships.length,
    primaryOwner: founder.trackingRelationships.find((tracking) => tracking.isOwner)?.user || null,
    myTracking: founder.trackingRelationships.find((tracking) => tracking.userId === userId) || null,
  };
}

export async function updateFounder(id: string, input: Prisma.FounderUpdateInput) {
  return prisma.founder.update({ where: { id }, data: input });
}

export async function deleteFounder(id: string) {
  await prisma.founder.delete({ where: { id } });
}
