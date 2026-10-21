const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const rateRoutes = require('./routes/rateRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { scrapeLiveBullionRates, getCachedRates } = require('./services/scraperService');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws/rates' });

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health Check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'A3 Jewellery ERP SaaS API Gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mount Routes
app.use('/api/v1/rates', rateRoutes);
app.use('/api/v1/upload', uploadRoutes);

// WebSocket Connections (POS terminals, Lookbook, Window LED display)
wss.on('connection', (ws) => {
  console.log('[WEBSOCKET] Client connected to live bullion rates stream.');

  // Push immediate initial rates on connection
  ws.send(JSON.stringify({
    event: 'INITIAL_RATES',
    data: getCachedRates()
  }));

  ws.on('close', () => {
    console.log('[WEBSOCKET] Client disconnected.');
  });
});

// Broadcast helper
function broadcastRates(rates) {
  const payload = JSON.stringify({
    event: 'RATES_UPDATED',
    data: rates
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// Scheduled Cron Worker: Every 5 Minutes (*/5 * * * *)
cron.schedule('*/5 * * * *', async () => {
  console.log('[CRON] 5-Minute interval triggered: Scraping live bullion benchmarks...');
  try {
    const updatedRates = await scrapeLiveBullionRates();
    broadcastRates(updatedRates);
  } catch (error) {
    console.error('[CRON ERROR] Failed in automated bullion scrape:', error.message);
  }
});

// Initial startup scrape
(async () => {
  console.log('[STARTUP] Performing initial bullion rate scrape...');
  try {
    await scrapeLiveBullionRates();
  } catch (e) {
    console.warn('[STARTUP] Using initial default bullion benchmarks.');
  }
})();

// Start HTTP & WebSocket Server
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`💎 A3 Jewellery Solution SaaS Backend Gateway Active`);
  console.log(`🚀 REST API: http://localhost:${PORT}/api/v1`);
  console.log(`📡 WebSocket Stream: ws://localhost:${PORT}/ws/rates`);
  console.log(`📸 Cloudinary Integration: ${process.env.CLOUDINARY_CLOUD_NAME || 'Active'}`);
  console.log(`=======================================================`);
});
