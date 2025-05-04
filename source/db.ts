import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import os from "os";

// 取得使用者的家目錄
const homeDir = os.homedir();
const dbDir = path.join(homeDir, ".hunger-game");

// 確保資料夾存在
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// 資料庫檔案路徑
const dbPath = path.join(dbDir, "db.sqlite");

// 建立連線
const db = new Database(dbPath);

// 設定 WAL 模式，如果尚未設定
const journalMode = db.pragma("journal_mode", { simple: true });
if (journalMode !== "wal") {
  db.pragma("journal_mode = WAL");
}

// 建立資料表（如果不存在）
db.prepare(`
  CREATE TABLE IF NOT EXISTS meal_options (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT    NOT NULL,
    weight       INTEGER NOT NULL DEFAULT 1,
    tags         TEXT    DEFAULT NULL,
    description  TEXT    DEFAULT NULL,
    metadata     TEXT    DEFAULT NULL,
    created_at   TEXT    NOT NULL DEFAULT (datetime())
  );
`).run();

function getMealOptions() {
  return db.prepare("SELECT * FROM meal_options").all();
}

function addMealOption(option: {
  name: string;
  weight: number;
  tags?: string;
  description?: string;
  metadata?: string;
}) {
  return db.prepare(`
    INSERT INTO meal_options (name, weight, tags, description, metadata)
    VALUES (@name, @weight, @tags, @description, @metadata)
  `).run({
    name: option.name,
    weight: option.weight ?? 1,
    tags: option.tags ?? null,
    description: option.description ?? null,
    metadata: option.metadata ?? null,
  });
}

function deleteMealOption(id: number) {
  return db.prepare(`
    DELETE FROM meal_options
    WHERE id = ?
  `).run(id);
}

function pickRestaurant() {
  // 模擬挑選過程：比如依經濟狀況篩選權重高的餐廳
  return db.prepare(
    `SELECT * FROM meal_options ORDER BY RANDOM() * weight DESC`,
  ).all();
}

export { addMealOption, deleteMealOption, getMealOptions, pickRestaurant };
