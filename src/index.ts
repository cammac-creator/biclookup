import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { lookupRoute } from './routes/lookup.js';
import { statsRoute } from './routes/stats.js';
import { healthRoute } from './routes/health.js';
import { landingRoute } from './routes/landing.js';
import { createX402Middleware } from './middleware/x402.js';

const app = new Hono();

// Global middleware
app.use('*', cors());
app.use('*', logger());

// x402 payment middleware (only on paid routes)
app.use('/v1/*', createX402Middleware());

// Routes
app.route('/', lookupRoute);
app.route('/', statsRoute);
app.route('/', healthRoute);

// Landing page (last — catches GET /)
app.route('/', landingRoute);

const port = parseInt(process.env.PORT ?? '3001', 10);

serve({ fetch: app.fetch, port }, () => {
  console.log(`BICLookup API running on http://localhost:${port}`);
});
