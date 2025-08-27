#!/bin/bash

printf '%s' "$OSSPREY_QA_API_KEY" | docker buildx build \
  --no-cache --progress=plain \
  --secret id=ossprey_api_key,src=/dev/stdin \
  --secret id=gh_token,env=EXAMPLE_MALICIOUS_JAVASCRIPT_NX_PAT_TOKEN \
  -t malicious-js-app .