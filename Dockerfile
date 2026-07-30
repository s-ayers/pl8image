# Build stage: install deps and compile TypeScript
FROM node:20-alpine AS build

RUN apk add --no-cache git

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
COPY bin ./bin
RUN npm run build

# Runtime stage: production deps + CLI
FROM node:20-alpine AS runtime

RUN apk add --no-cache git

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY bin ./bin

WORKDIR /work
ENTRYPOINT ["node", "/app/bin/index.js"]
