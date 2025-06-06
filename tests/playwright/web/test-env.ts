import { z } from "zod";
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
});

export const env = envSchema.parse({
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretjwtpassword',
});
