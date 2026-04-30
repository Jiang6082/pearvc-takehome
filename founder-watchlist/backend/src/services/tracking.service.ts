import { TrackingPriority, TrackingStatus } from "@prisma/client";
import { prisma } from "../db.js";

export async function trackFounder(
  userId: string,
  input: {
    founderId: string;
    status?: TrackingStatus;
    priority?: TrackingPriority;
    privateNotes?: string;
    isOwner?: boolean;
  }
) {
  return prisma.tracking.upsert({
    where: { userId_founderId: { userId, founderId: input.founderId } },
    create: {
      userId,
      founderId: input.founderId,
      status: input.status || "WATCHING",
      priority: input.priority || "MEDIUM",
      privateNotes: input.privateNotes || null,
      isOwner: input.isOwner || false,
    },
    update: {
      status: input.status,
      priority: input.priority,
      privateNotes: input.privateNotes,
      isOwner: input.isOwner,
    },
    include: { founder: true },
  });
}

export async function listMyTracking(userId: string) {
  return prisma.tracking.findMany({
    where: { userId },
    include: {
      founder: {
        include: {
          tags: { include: { tag: true } },
          updates: { orderBy: { detectedAt: "desc" }, take: 1 },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function updateTracking(userId: string, id: string, data: {
  status?: TrackingStatus;
  priority?: TrackingPriority;
  privateNotes?: string | null;
  lastContactedAt?: Date | null;
  isOwner?: boolean;
}) {
  return prisma.tracking.update({ where: { id, userId }, data });
}

export async function deleteTracking(userId: string, id: string) {
  await prisma.tracking.delete({ where: { id, userId } });
}

export async function markContacted(userId: string, id: string) {
  return prisma.tracking.update({
    where: { id, userId },
    data: { lastContactedAt: new Date() },
  });
}
