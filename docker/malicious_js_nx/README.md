## Malicious JS Demo App

Minimal Express-based web service packaged for Docker. Directory name retained for parity with examples; code is benign.

### Endpoints
* GET / -> greeting
* GET /health -> JSON health `{ status, uptime_s }`

### Build
Using provided build script (streams secret):
```bash
export OSSPREY_API_KEY=YOUR_KEY
cd docker/malicious_js
./build.sh
```
Or plain Docker:
```bash
docker build -t malicious-js-app .
```

### Run
```bash
docker run --rm -p 3000:3000 malicious-js-app
```
Visit http://localhost:3000

### Local (without Docker)
```bash
npm install
npm start
```

### Notes
* Uncomment secret line in Dockerfile to test secret mount.
* Add SBOM / scan steps as needed.

