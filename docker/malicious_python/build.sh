#!/bin/bash

printf '%s' "$OSSPREY_API_KEY" | docker buildx build \
  --no-cache --progress=plain \
  --secret id=ossprey_api_key,src=/dev/stdin \
  -t safe-python-app .