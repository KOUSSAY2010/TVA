import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import config from './src/config/index.js';
import { bot, setupBotHandlers } from './src/bot/bot.js';
import { apiRouter } from './src/routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security and utility middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow Telegram WebApp iframe embedding
  crossOriginEmbedderPolicy: false,
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Store Telegraf bot instance for route access (e.g. withdrawal admin notifications)
app.set('botInstance', bot);

// Serve Web App static frontend files from the public/ directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
// Serve custom images directory
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/img', express.static('img'));

// Explicit root route serving index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Mount API routes
app.use('/api', apiRouter);

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'TVA Crypto-Mining',
    env: config.nodeEnv,
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Fallback to index.html for single-page app navigation
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Database connection helper
async function connectDatabase() {
  try {
    await mongoose.connect(config.db.uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connected successfully to database');
  } catch (err) {
    console.warn('⚠️ MongoDB connection warning:', err.message);
    console.warn('Ensure MongoDB is running locally or provide a valid MONGODB_URI in .env');
  }
}

// Telegram Bot launch helper with automatic retry
async function launchPollingWithRetry(retries = 10, delay = 3000) {
  try {
    // Delete any hanging webhook to avoid 409 Conflict
    await bot.telegram.deleteWebhook({ drop_pending_updates: false });
    await bot.launch({
      dropPendingUpdates: false,
    });
    console.log('✅ Telegraf Bot launched and polling for updates');
  } catch (err) {
    console.error(`❌ Telegraf Bot polling error: ${err.message}. Retrying in ${delay / 1000}s... (Retries left: ${retries})`);
    if (retries > 0) {
      setTimeout(() => launchPollingWithRetry(retries - 1, Math.min(delay * 1.5, 15000)), delay);
    }
  }
}

async function startTelegramBot() {
  if (!config.telegram.botToken || config.telegram.botToken === 'your_telegram_bot_token_here') {
    console.warn('⚠️ Telegram BOT_TOKEN not configured in .env. Bot polling skipped.');
    return;
  }

  try {
    setupBotHandlers(bot);
    launchPollingWithRetry();
  } catch (err) {
    console.error('❌ Failed to setup Telegraf Bot:', err.message);
  }
}

// HTTP Server listening helper with automatic port fallback
function listenWithFallback(port, maxAttempts = 10) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port);
    server.on('listening', () => {
      const actualPort = server.address().port;
      console.log(`🚀 TVA Server listening on port ${actualPort} (${config.nodeEnv})`);
      console.log(`📱 Mini App frontend served at http://localhost:${actualPort}`);
      console.log(`🔗 Configured WebApp URL: ${config.telegram.webAppUrl || 'http://localhost:' + actualPort}`);
      resolve(server);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE' && maxAttempts > 0) {
        const nextPort = port === 5000 ? 5001 : port + 1;
        console.warn(`⚠️ Port ${port} is currently in use. Automatically falling back to port ${nextPort}...`);
        listenWithFallback(nextPort, maxAttempts - 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

// Start Server & Bot concurrently
async function startServer() {
  // 1. Connect Database
  await connectDatabase();

  // 2. Setup & Start Telegram Bot
  await startTelegramBot();

  // 3. Start HTTP Server with port fallback
  let server;
  try {
    server = await listenWithFallback(config.port);
  } catch (err) {
    console.error('❌ Failed to bind HTTP server to any available port:', err.message);
    process.exit(1);
  }

  // Graceful shutdown
  const gracefulShutdown = (signal) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);
    try {
      bot.stop(signal);
    } catch (_) {}
    server.close(async () => {
      await mongoose.connection.close();
      console.log('Server and database connections closed.');
      process.exit(0);
    });
  };

  process.once('SIGINT', () => gracefulShutdown('SIGINT'));
  process.once('SIGTERM', () => gracefulShutdown('SIGTERM'));
}

startServer();

export default app;
