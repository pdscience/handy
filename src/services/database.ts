import { Capacitor } from '@capacitor/core';

type StorageRow = { key: string; value: string };
type RoutineRow = { period: string; item_index: number; completed: number };
type AchievementRow = { date: string; key: string; value: number };

let dbInitialized = false;

async function getDb() {
  if (!Capacitor.isNativePlatform()) {
    return null;
  }
  const { CapacitorSQLite, SQLiteConnection } = await import('@capacitor-community/sqlite');
  const sqlite = new SQLiteConnection(CapacitorSQLite);
  const db = await sqlite.createConnection('teakids', false, 'no-encryption', 1, false);
  await db.open();
  return db;
}

let db: Awaited<ReturnType<typeof getDb>> = null;

export async function initDatabase() {
  if (dbInitialized) return;
  dbInitialized = true;

  if (!Capacitor.isNativePlatform()) return;

  db = await getDb();
  if (!db) return;

  await db.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS routine_progress (
      period TEXT NOT NULL,
      item_index INTEGER NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (period, item_index)
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS achievements (
      date TEXT NOT NULL,
      key TEXT NOT NULL,
      value INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (date, key)
    )
  `);
}

export async function dbGetSetting(key: string): Promise<string | null> {
  if (!db) return localStorage.getItem(key);
  const res = await db.query(`SELECT value FROM settings WHERE key = ?`, [key]);
  const rows = res.values as StorageRow[] | undefined;
  return rows && rows.length > 0 ? rows[0].value : null;
}

export async function dbSetSetting(key: string, value: string) {
  if (!db) {
    localStorage.setItem(key, value);
    return;
  }
  await db.run(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`, [key, value]);
}

export async function dbRemoveSetting(key: string) {
  if (!db) {
    localStorage.removeItem(key);
    return;
  }
  await db.run(`DELETE FROM settings WHERE key = ?`, [key]);
}

export async function dbSaveRoutineProgress(period: string, index: number, completed: boolean) {
  if (!db) {
    localStorage.setItem(`routine_${period}_${index}`, JSON.stringify(completed));
    return;
  }
  await db.run(
    `INSERT OR REPLACE INTO routine_progress (period, item_index, completed) VALUES (?, ?, ?)`,
    [period, index, completed ? 1 : 0]
  );
}

export async function dbLoadRoutineProgress(period: string, index: number): Promise<boolean> {
  if (!db) {
    try {
      const val = localStorage.getItem(`routine_${period}_${index}`);
      return val ? JSON.parse(val) : false;
    } catch {
      return false;
    }
  }
  const res = await db.query(
    `SELECT completed FROM routine_progress WHERE period = ? AND item_index = ?`,
    [period, index]
  );
  const rows = res.values as { completed: number }[] | undefined;
  return rows && rows.length > 0 ? rows[0].completed === 1 : false;
}

export async function dbLoadAllRoutineProgress(period: string): Promise<boolean[]> {
  if (!db) {
    const periodLengths: Record<string, number> = { morning: 8, afternoon: 8, night: 7 };
    const length = periodLengths[period] || 0;
    const result: boolean[] = [];
    for (let i = 0; i < length; i++) {
      result.push(await dbLoadRoutineProgress(period, i));
    }
    return result;
  }
  const res = await db.query(
    `SELECT item_index, completed FROM routine_progress WHERE period = ?`,
    [period]
  );
  const rows = (res.values as RoutineRow[]) || [];
  const periodLengths: Record<string, number> = { morning: 8, afternoon: 8, night: 7 };
  const length = periodLengths[period] || 0;
  const result: boolean[] = Array(length).fill(false);
  for (const row of rows) {
    if (row.item_index < length) {
      result[row.item_index] = row.completed === 1;
    }
  }
  return result;
}

export async function dbClearRoutineProgress(period: string) {
  if (!db) {
    const periodLengths: Record<string, number> = { morning: 8, afternoon: 8, night: 7 };
    const length = periodLengths[period] || 0;
    for (let i = 0; i < length; i++) {
      localStorage.removeItem(`routine_${period}_${i}`);
    }
    return;
  }
  await db.run(`DELETE FROM routine_progress WHERE period = ?`, [period]);
}

export async function dbSaveAchievement(date: string, key: string, value: boolean) {
  if (!db) {
    const raw = localStorage.getItem('teakids_daily_achievements');
    let data: Record<string, unknown> = {};
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.date === date) data = parsed.data || {};
      } catch { /* ignore */ }
    }
    data[key] = value;
    localStorage.setItem('teakids_daily_achievements', JSON.stringify({ date, data }));
    return;
  }
  await db.run(
    `INSERT OR REPLACE INTO achievements (date, key, value) VALUES (?, ?, ?)`,
    [date, key, value ? 1 : 0]
  );
}

export async function dbLoadAchievements(date: string): Promise<Record<string, boolean>> {
  if (!db) {
    try {
      const raw = localStorage.getItem('teakids_daily_achievements');
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (parsed?.date !== date) return {};
      const result: Record<string, boolean> = {};
      for (const [k, v] of Object.entries(parsed.data || {})) {
        result[k] = Boolean(v);
      }
      return result;
    } catch {
      return {};
    }
  }
  const res = await db.query(`SELECT key, value FROM achievements WHERE date = ?`, [date]);
  const rows = (res.values as AchievementRow[]) || [];
  const result: Record<string, boolean> = {};
  for (const row of rows) {
    result[row.key] = row.value === 1;
  }
  return result;
}
