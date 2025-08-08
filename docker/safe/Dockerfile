# Use official Python image
FROM python:3.11-slim

# Install build tools for dependencies if needed (libsodium for ed25519 may be required by solana-py)
RUN apt-get update && apt-get install -y --no-install-recommends \
	build-essential \
	pkg-config \
	libsodium23 \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY main.py ./



EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
