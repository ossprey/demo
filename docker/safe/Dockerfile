# syntax=docker/dockerfile:1.7

# Use official Python image
FROM python:3.12-slim AS base

# Install build tools for dependencies if needed (libsodium for ed25519 may be required by solana-py)
RUN apt-get update && apt-get install -y --no-install-recommends \
	build-essential \
	pkg-config \
	libsodium23 \
	git \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY main.py ./

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
# TODO attach SBOM for BuildKit attestations (if using buildx)
# TODO fix location return from scanning
# TODO LABEL org.opencontainers.image.sbom=/tmp/sbom.spdx.json

# --- Final image ---
FROM base AS final
COPY --from=scanner /scan-result/passed /scan-result/passed

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
