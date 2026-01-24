# Adjust the build context to the root of the monorepo when building
# docker build -f apps/api/Dockerfile .

FROM oven/bun:1 as builder
WORKDIR /app

# Copy root configuration
COPY package.json bun.lock tsconfig.json ./

# Copy packages (shared dependencies)
COPY packages ./packages

# Copy API application
COPY apps/api ./apps/api

# Install dependencies (from root to link workspace packages)
RUN bun install --frozen-lockfile

# Generate Prisma Client
WORKDIR /app/apps/api
RUN bun run db:generate

# Build the application
RUN bun run build

# Production image
FROM oven/bun:1 as runner
WORKDIR /app

# Copy built assets
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
# Copy prisma schema for migrations if needed, or just the generated client
COPY --from=builder /app/apps/api/prisma ./prisma
# Copy node_modules for potentially unbundled dependencies (safe bet with Bun sometimes)
COPY --from=builder /app/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3002

# Expose port
EXPOSE 3002

# Start the application
CMD ["bun", "dist/index.js"]
