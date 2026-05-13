FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install && npm cache clean --force
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nestjs
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
RUN npm install --only=production && npm cache clean --force
USER nestjs
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/main"]
