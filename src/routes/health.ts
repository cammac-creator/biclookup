import { Hono } from 'hono';
import { getEntryCount } from '../lib/db.js';

export const healthRoute = new Hono();

healthRoute.get('/health', (c) => {
  try {
    const count = getEntryCount();
    return c.json({
      status: 'ok',
      database_entries: count,
      uptime: process.uptime(),
    });
  } catch {
    return c.json({ status: 'error', message: 'database_unavailable' }, 503);
  }
});
