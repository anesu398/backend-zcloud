const WebSocket = require('ws');

let wss;

const setupWebSocketServer = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected via WebSocket.');

    // Send initial welcome message
    ws.send(JSON.stringify({ type: 'welcome', message: 'Connected to WebSocket server!' }));

    // Listen for incoming messages
    ws.on('message', (data) => {
      try {
        const parsedData = JSON.parse(data);

        switch (parsedData.type) {
          case 'subscribe':
            console.log(`Client subscribed to: ${parsedData.channel}`);
            ws.channel = parsedData.channel; // Save the subscribed channel
            break;
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong' }));
            break;
          default:
            console.log('Unknown WebSocket message type:', parsedData.type);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected.');
    });
  });

  return wss;
};

// Broadcast a message to all connected clients or a specific channel
const broadcast = (data, channel = null) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      if (!channel || client.channel === channel) {
        client.send(JSON.stringify(data));
      }
    }
  });
};

module.exports = { setupWebSocketServer, broadcast };
