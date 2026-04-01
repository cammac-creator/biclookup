import { Hono } from 'hono';
import { getStats } from '../lib/stats.js';
import { getEntryCount } from '../lib/db.js';

export const statsRoute = new Hono();

statsRoute.get('/stats', (c) => {
  try {
    const stats = getStats();
    const dbEntries = getEntryCount();
    return c.json({
      ...stats,
      database_entries: dbEntries,
    });
  } catch {
    return c.json({ error: 'stats_unavailable' }, 500);
  }
});
