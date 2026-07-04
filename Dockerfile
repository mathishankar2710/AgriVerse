# --- Stage 1: Build ---
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy dependency definition
COPY package.json bunfig.toml ./

# Install dependencies
RUN bun install

# Copy the rest of the source code
COPY . .

# Build the project
RUN bun run build

# --- Stage 2: Production Runtime ---
FROM oven/bun:1-slim AS runner
WORKDIR /app

# Set environment variables
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NODE_ENV=production

# Copy the built server output from the builder stage
COPY --from=builder /app/.output ./.output

EXPOSE 3000

# Start the Nitro-based TanStack Start server
CMD ["bun", "run", ".output/server/index.mjs"]
