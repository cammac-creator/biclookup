import Database from 'better-sqlite3';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATS_PATH = process.env.STATS_DB_PATH ?? resolve(__dirname, '../../data/stats.sqlite');

let db: Database.Database | null = null;

function getDB(): Database.Database {
  if (!db) {
    db = new Database(STATS_PATH);
    db.exec(`
      CREATE TABLE IF NOT EXISTS lookups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        country_code TEXT,
        found INTEGER NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS daily_stats (
        date TEXT PRIMARY KEY,
        total INTEGER DEFAULT 0,
        found_count INTEGER DEFAULT 0,
        revenue_usdc REAL DEFAULT 0
      );
    `);
  }
  return db;
}

export function recordLookup(countryCode: string | null, found: boolean, costUsdc: number) {
  try {
    getDB().prepare('INSERT INTO lookups (country_code, found) VALUES (?, ?)').run(countryCode, found ? 1 : 0);
    getDB().prepare(`
      INSERT INTO daily_stats (date, total, found_count, revenue_usdc)
      VALUES (date('now'), 1, ?, ?)
      ON CONFLICT(date) DO UPDATE SET
        total = total + 1,
        found_count = found_count + excluded.found_count,
        revenue_usdc = revenue_usdc + excluded.revenue_usdc
    `).run(found ? 1 : 0, costUsdc);
  } catch { /* non-critical */ }
}

export function getStats() {
  const database = getDB();
  const totals = database.prepare('SELECT COUNT(*) as total, SUM(found) as found_count FROM lookups').get() as { total: number; found_count: number };
  const revenue = database.prepare('SELECT COALESCE(SUM(revenue_usdc), 0) as total FROM daily_stats').get() as { total: number };
  const topCountries = database.prepare('SELECT country_code as country, COUNT(*) as count FROM lookups WHERE country_code IS NOT NULL GROUP BY country_code ORDER BY count DESC LIMIT 10').all() as Array<{ country: string; count: number }>;
  const last7 = database.prepare("SELECT date, total, revenue_usdc as revenue FROM daily_stats WHERE date >= date('now', '-7 days') ORDER BY date DESC").all() as Array<{ date: string; total: number; revenue: number }>;

  return {
    total_lookups: totals.total,
    found_count: totals.found_count ?? 0,
    hit_rate: totals.total > 0 ? Math.round(((totals.found_count ?? 0) / totals.total) * 10000) / 100 : 0,
    total_revenue_usdc: Math.round(revenue.total * 1000000) / 1000000,
    top_countries: topCountries,
    last_7_days: last7,
  };
}
