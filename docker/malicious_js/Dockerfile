## syntax=docker/dockerfile:1.7

FROM node:22-alpine AS base
WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY src ./src

# --- Scanner stage: does NOT contaminate what is scanned ---
FROM python:3.12-alpine AS scanner
RUN apk add --no-cache git
RUN python -m venv /opt/venv
# Mount the entire root fs of `base` at /scanfs (read-only) and scan that.
RUN --mount=type=secret,id=ossprey_api_key \
    --mount=type=bind,from=base,source=/,target=/scanfs,ro \
    /bin/sh -lc '. /opt/venv/bin/activate && \
      pip install --no-cache-dir git+https://github.com/ossprey/ossprey-python-client.git@docker && \
      API_KEY="$(cat /run/secrets/ossprey_api_key)" \
      python -u -m ossprey --mode fs --dir /scanfs --verbose && \
      mkdir -p /scan-result && echo passed > /scan-result/passed'

# --- Final image ---
FROM base AS final
COPY --from=scanner /scan-result/passed /scan-result/passed

ENV NODE_ENV=production \
    PORT=3000

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD node src/healthcheck.js || exit 1

CMD ["node", "src/index.js"]
