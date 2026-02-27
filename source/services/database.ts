import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import Database from 'better-sqlite3';
import type {MealOption} from '../types/index.js';

type DatabaseInstance = InstanceType<typeof Database>;

// 取得使用者的家目錄
const homeDir = os.homedir();
const dbDir = path.join(homeDir, '.hunger-game');

// 確保資料夾存在
if (!fs.existsSync(dbDir)) {
	fs.mkdirSync(dbDir, {recursive: true});
}

// 資料庫檔案路徑
const dbPath = path.join(dbDir, 'db.sqlite');

let db: DatabaseInstance | undefined;

/**
 * 初始化數據庫連線
 */
export function initDatabase(): void {
	if (db) {
		return; // Already initialized
	}

	// 建立連線
	db = new Database(dbPath);

	// Set WAL mode if not already set
	const journalMode = db.pragma('journal_mode', {simple: true}) as string;
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
}

/**
 * 獲得數據庫實例（確保已初始化）
 */
function getDb(): DatabaseInstance {
	if (!db) {
		throw new Error('數據庫尚未初始化，請先調用 initDatabase()');
	}

	return db;
}

/**
 * 獲取所有餐點選項
 */
export function getMealOptions(): MealOption[] {
	const database = getDb();
	return database.prepare('SELECT * FROM meal_options').all() as MealOption[];
}

/**
 * 根據餐點 ID 獲取餐點信息
 */
export function getMealById(id: number): MealOption | undefined {
	const database = getDb();
	return database.prepare('SELECT * FROM meal_options WHERE id = ?').get(id) as
		| MealOption
		| undefined;
}

/**
 * 添加新的餐點選項
 */
export function addMealOption(option: {
	name: string;
	weight: number;
	tags?: string;
	description?: string;
	metadata?: string;
}): void {
	const database = getDb();

	// Check for duplicate name
	if (checkDuplicateMealName(option.name)) {
		throw new Error('此餐點名稱已存在');
	}

	try {
		database
			.prepare(
				`
      INSERT INTO meal_options (name, weight, tags, description, metadata)
      VALUES (@name, @weight, @tags, @description, @metadata)
    `,
			)
			.run({
				name: option.name,
				weight: option.weight,
				tags: option.tags ?? undefined,
				description: option.description ?? undefined,
				metadata: option.metadata ?? undefined,
			});
	} catch (error: unknown) {
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

/**
 * 刪除指定 ID 的餐點選項
 */
export function deleteMealOption(id: number): void {
	const database = getDb();
	database
		.prepare(
			`
    DELETE FROM meal_options
    WHERE id = ?
  `,
		)
		.run(id);
}

/**
 * 檢查是否存在重複的餐點名稱
 */
export function checkDuplicateMealName(name: string): boolean {
	const database = getDb();
	const result = database
		.prepare('SELECT id FROM meal_options WHERE name = ?')
		.get(name) as {id: number} | undefined;
	return Boolean(result);
}

/**
 * 根據經濟狀況篩選餐點
 *
 * 目前先返回隨機排序的餐點，後續可根據 walletStatus 參數優化篩選邏輯
 */
export function pickMealsByStatus(_walletStatus: string): MealOption[] {
	const database = getDb();

	return database
		.prepare(`SELECT * FROM meal_options ORDER BY RANDOM() * weight DESC`)
		.all() as MealOption[];
}

/**
 * 更新指定 ID 的餐點選項（預留給未來的編輯功能）
 */
export function updateMealOption(
	id: number,
	option: {
		name?: string;
		weight?: number;
		tags?: string;
		description?: string;
		metadata?: string;
	},
): void {
	const database = getDb();

	const updates: string[] = [];
	const values: Record<string, unknown> = {id};

	if (option.name !== undefined) {
		updates.push('name = @name');
		values['name'] = option.name;
	}

	if (option.weight !== undefined) {
		updates.push('weight = @weight');
		values['weight'] = option.weight;
	}

	if (option.tags !== undefined) {
		updates.push('tags = @tags');
		values['tags'] = option.tags;
	}

	if (option.description !== undefined) {
		updates.push('description = @description');
		values['description'] = option.description;
	}

	if (option.metadata !== undefined) {
		updates.push('metadata = @metadata');
		values['metadata'] = option.metadata;
	}

	if (updates.length === 0) {
		return;
	}

	try {
		database
			.prepare(`UPDATE meal_options SET ${updates.join(', ')} WHERE id = @id`)
			.run(values);
	} catch (error: unknown) {
		if (error instanceof Error) {
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
