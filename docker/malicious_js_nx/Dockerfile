## syntax=docker/dockerfile:1.7

FROM node:22-alpine AS base
WORKDIR /app

RUN apk add --no-cache build-base pkgconf libsodium git ca-certificates openssh-client


COPY package.json ./
# Shame hack for RUN npm install --omit=dev to be able to install private GH repos
RUN --mount=type=secret,id=gh_token \
    set -e; mkdir -p /tmp/gh && chmod 700 /tmp/gh; \
    T="$(cat /run/secrets/gh_token)"; \
    printf "machine github.com\n  login x-access-token\n  password %s\n" "$T" > /tmp/gh/.netrc; \
    chmod 600 /tmp/gh/.netrc; \
    HOME=/tmp/gh npm install --omit=dev; \
    rm -rf /tmp/gh


COPY src ./src

# --- Scanner stage: does NOT contaminate what is scanned ---
FROM python:3.12-alpine AS scanner
RUN apk add --no-cache git
RUN python -m venv /opt/venv
# Mount the entire root fs of `base` at /scanfs (read-only) and scan that.
RUN --mount=type=secret,id=ossprey_api_key \
    --mount=type=bind,from=base,source=/,target=/scanfs,ro \
    /bin/sh -lc '. /opt/venv/bin/activate && \
      pip install --no-cache-dir ossprey && \
      USER_POOL_DOMAIN=eu-west-1m9quj8fob \
      CLIENT_ID=30vo0tndo8oe5iurnib2q14l6s \
      REGION=eu-west-1 \
      INPUT_URL=https://api.qa.ossprey.com \
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
