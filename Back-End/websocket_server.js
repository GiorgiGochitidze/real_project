const WebSocket = require("ws");

const createWebSocketServer = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    // Send initial data when a new connection is established
    ws.send(JSON.stringify({ message: 'Connected to WebSocket server' }));
  });

  return wss;
};

module.exports = createWebSocketServer;
