import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

// 取得使用者的家目錄
const homeDir = os.homedir();
const dbDir = path.join(homeDir, '.hunger-game');

// 確保資料夾存在
if (!fs.existsSync(dbDir)) {
	fs.mkdirSync(dbDir, {recursive: true});
}

// 資料庫檔案路徑
const dbPath = path.join(dbDir, 'db.sqlite');

// 建立連線
const db = new Database(dbPath);

// Set WAL mode if not already set
const journalMode = db.pragma('journal_mode', {simple: true});
if (journalMode !== 'wal') {
	db.pragma('journal_mode = WAL');
}

// Create table if it doesn't exist
db.prepare(
	`
  CREATE TABLE IF NOT EXISTS meal_options (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT    NOT NULL CHECK(length(name) > 0 AND length(name) <= 50),
    weight       INTEGER NOT NULL CHECK(weight >= 1 AND weight <= 5),
    tags         TEXT    DEFAULT NULL CHECK(length(tags) <= 100),
    description  TEXT    DEFAULT NULL CHECK(length(description) <= 200),
    metadata     TEXT    DEFAULT NULL,
    created_at   TEXT    NOT NULL DEFAULT (datetime()),
    UNIQUE(name)  -- 防止重複餐點名稱
  );
`,
).run();

function getMealOptions() {
	return db.prepare('SELECT * FROM meal_options').all();
}

function checkDuplicateMealName(name: string): boolean {
	const result = db
		.prepare('SELECT id FROM meal_options WHERE name = ?')
		.get(name);
	return !!result;
}

function addMealOption(option: {
	name: string;
	weight: number;
	tags?: string;
	description?: string;
	metadata?: string;
}) {
	// Check for duplicate name
	if (checkDuplicateMealName(option.name)) {
		throw new Error('此餐點名稱已存在');
	}

	try {
		return db
			.prepare(
				`
      INSERT INTO meal_options (name, weight, tags, description, metadata)
      VALUES (@name, @weight, @tags, @description, @metadata)
    `,
			)
			.run({
				name: option.name,
				weight: option.weight,
				tags: option.tags || null,
				description: option.description || null,
				metadata: option.metadata || null,
			});
	} catch (error) {
		if (error instanceof Error) {
			// Handle constraint violations with user-friendly messages
			if (error.message.includes('CHECK constraint failed')) {
				if (error.message.includes('weight')) {
					throw new Error('權重必須在 1-5 之間');
				}
				if (error.message.includes('length')) {
					throw new Error('輸入資料過長，請檢查長度限制');
				}
			}
			if (error.message.includes('UNIQUE constraint failed')) {
				throw new Error('此餐點名稱已存在');
			}
		}
		throw error;
	}
}

function deleteMealOption(id: number) {
	return db
		.prepare(
			`
    DELETE FROM meal_options
    WHERE id = ?
  `,
		)
		.run(id);
}

function pickRestaurant() {
	// 模擬挑選過程：比如依經濟狀況篩選權重高的餐廳
	return db
		.prepare(`SELECT * FROM meal_options ORDER BY RANDOM() * weight DESC`)
		.all();
}

export {
	addMealOption,
	deleteMealOption,
	getMealOptions,
	pickRestaurant,
	checkDuplicateMealName,
};
