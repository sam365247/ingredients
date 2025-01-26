const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const { setupWSConnection } = require('y-websocket/bin/utils');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// WebSocket connection handler
wss.on('connection', setupWSConnection);

// In production, serve static files and handle React routing
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Use port 3000 for production, 1234 for development
const PORT = process.env.NODE_ENV === 'production' ? 
  (process.env.PORT || 3000) : 
  1234;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 