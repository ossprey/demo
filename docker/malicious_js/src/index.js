const express = require('express');

const app = express();
const started = Date.now();
const port = process.env.PORT || 3000;

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime_s: ((Date.now() - started) / 1000).toFixed(1) });
});

app.get('/', (_req, res) => {
  res.send('Hello from malicious-js-app (demo). Try /health');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
