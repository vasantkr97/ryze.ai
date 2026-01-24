import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3002').transform(Number),
  DATABASE_URL: z.string().default('postgresql://user:password@localhost:5432/db'), // Dummy default
  JWT_SECRET: z.string().default('default-super-secret-jwt-key-min-32-chars'),
  JWT_REFRESH_SECRET: z.string().default('default-super-secret-refresh-key-min-32-chars'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  GOOGLE_AI_API_KEY: z.string().default('dummy-key'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.warn('Invalid environment variables (using defaults):', parsed.error.flatten().fieldErrors);
  // process.exit(1); // Don't exit on error
}

export const env = parsed.success ? parsed.data : envSchema.parse({}); // Use defaults if parse fails
