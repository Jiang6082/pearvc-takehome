import { Prisma, SignalType } from "@prisma/client";
import { prisma } from "../db.js";

export async function listUpdates(userId: string, query: Record<string, string | undefined>) {
  const where: Prisma.UpdateSignalWhereInput = {};

  if (query.founderId) where.founderId = query.founderId;
  if (query.signalType) where.signalType = query.signalType as SignalType;
  if (query.isImportant === "true") where.isImportant = true;
  if (query.includeDismissed !== "true") where.isDismissed = false;
  if (query.trackedByMe === "true") {
    where.founder = { trackingRelationships: { some: { userId } } };
  }
  if (query.search) {
    where.founder = {
      ...(where.founder as Prisma.FounderWhereInput),
      fullName: { contains: query.search, mode: "insensitive" },
    };
  }

  return prisma.updateSignal.findMany({
    where,
    include: {
      founder: {
        include: {
          tags: { include: { tag: true } },
        },
      },
    },
    orderBy: { detectedAt: query.sortOrder === "asc" ? "asc" : "desc" },
  });
}

export async function createManualUpdate(input: {
  founderId: string;
  signalType?: SignalType;
  title: string;
  description: string;
  sourceName?: string;
  sourceUrl?: string;
}) {
  return prisma.updateSignal.create({
    data: {
      founderId: input.founderId,
      signalType: input.signalType || "MANUAL",
      title: input.title,
      description: input.description,
      sourceName: input.sourceName || "Manual",
      sourceUrl: input.sourceUrl || null,
      detectedAt: new Date(),
      confidenceScore: 1,
    },
    include: { founder: true },
  });
}

export async function updateSignal(id: string, data: {
  isImportant?: boolean;
  isDismissed?: boolean;
  title?: string;
  description?: string;
}) {
  return prisma.updateSignal.update({ where: { id }, data });
}
