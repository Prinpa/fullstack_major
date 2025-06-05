import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

console.log("All environment variables:", process.env);
console.log("JWT_SECRET:", process.env.JWT_SECRET);
export const env = createEnv({
  server: {
    JWT_SECRET: z.string().min(1, "JWT_SECRET is required"), // Ensure non-empty string
  },
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },
  runtimeEnv: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION, // Simplified
  emptyStringAsUndefined: true,
});