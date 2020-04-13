const express = require('express');
const next = require('next');
const cors = require('cors');
const dbConnection = require('./utils/dbConnection');
const customConfig = require('./next.config.js');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, conf: { ...customConfig } });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(cors());
  dbConnection();

  server.all('*', (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(` Ready on port ${port}`);
  });
});
