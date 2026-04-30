import { Response } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { AuthedRequest } from "../middleware/auth.js";
import { registerUser, loginUser } from "../services/auth.service.js";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = authSchema.extend({
  name: z.string().min(1),
});

export async function register(req: AuthedRequest, res: Response) {
  const input = registerSchema.parse(req.body);
  res.status(201).json(await registerUser(input));
}

export async function login(req: AuthedRequest, res: Response) {
  const input = authSchema.parse(req.body);
  res.json(await loginUser(input));
}

export async function me(req: AuthedRequest, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  res.json({ user });
}
