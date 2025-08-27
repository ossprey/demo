const http = require('http');
const port = process.env.PORT || 3000;
http.get({ host: '127.0.0.1', port, path: '/health', timeout: 2000 }, (res) => {
  if (res.statusCode !== 200) process.exit(1);
  res.resume();
}).on('error', () => process.exit(1));
