# syntax=docker/dockerfile:1.7

# Use official Python image
FROM python:3.12-slim

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

# ----- Run OSSPREY Scan -----
	
RUN pip install --no-cache-dir git+https://github.com/ossprey/ossprey-python-client.git@docker
RUN --mount=type=secret,id=ossprey_api_key \
    API_KEY="$(cat /run/secrets/ossprey_api_key)" python -u -m ossprey --mode fs --dir / --verbose
# TODO attach SBOM for BuildKit attestations (if using buildx)
# TODO LABEL org.opencontainers.image.sbom=/tmp/sbom.spdx.json


EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
