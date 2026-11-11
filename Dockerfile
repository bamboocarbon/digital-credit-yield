# Cloud Run image for digitalcredityield.com (moved off Vercel 2026-11-11).
# next.config.mjs has output: 'standalone', so the runtime stage needs only
# the traced server bundle — it already includes the native packages
# (sharp, @napi-rs/canvas, ffmpeg-static, tesseract.js) for linux-x64-gnu,
# which is why the base is Debian (glibc) slim, not Alpine (musl).

FROM node:22-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
# postinstall runs scripts/slimTesseractCore.mjs
COPY scripts ./scripts
RUN npm ci --no-audit --no-fund
COPY . .
# NEXT_PUBLIC_* values are baked into the client bundle at build time.
ARG NEXT_PUBLIC_ADSENSE_ID
ARG NEXT_PUBLIC_GA_ID
ARG NEXT_PUBLIC_BMNP_ENABLED
ENV NEXT_PUBLIC_ADSENSE_ID=$NEXT_PUBLIC_ADSENSE_ID \
    NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID \
    NEXT_PUBLIC_BMNP_ENABLED=$NEXT_PUBLIC_BMNP_ENABLED
RUN npm run build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=8080
# node owns the app dir so Next can write its ISR cache under .next/cache.
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 8080
CMD ["node", "server.js"]
