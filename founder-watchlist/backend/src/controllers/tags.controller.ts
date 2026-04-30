import { Response } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { AuthedRequest } from "../middleware/auth.js";

export async function getTags(_req: AuthedRequest, res: Response) {
  res.json(await prisma.tag.findMany({ orderBy: { name: "asc" } }));
}

export async function postTag(req: AuthedRequest, res: Response) {
  const input = z.object({ name: z.string().min(1) }).parse(req.body);
  const tag = await prisma.tag.upsert({ where: { name: input.name }, create: input, update: {} });
  res.status(201).json(tag);
}
