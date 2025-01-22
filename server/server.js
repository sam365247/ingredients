const WebSocket = require('ws');
const { setupWSConnection } = require('y-websocket/bin/utils');

const wss = new WebSocket.Server({ port: 1234 });

wss.on('connection', (ws, req) => {
  setupWSConnection(ws, req);
  console.log('Client connected');
});

console.log('WebSocket server running on port 1234'); 