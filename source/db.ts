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

// 建立資料表（如果不存在）
db.prepare(`
  CREATE TABLE IF NOT EXISTS lunch_options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
`).run();

function getLunchOptions() {
  return db.prepare("SELECT * FROM lunch_options").all();
}

function addLunchOption(name: string) {
  return db.prepare("INSERT INTO lunch_options (name) VALUES (?)").run(name);
}

function getDbPath() {
  return dbPath;
}

export { addLunchOption, getDbPath, getLunchOptions };
