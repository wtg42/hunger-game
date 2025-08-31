// 官方沒有出定義檔，用這個暫時擋著用。
declare module 'better-sqlite3' {
	type DatabaseOptions = {
		memory?: boolean;
		readonly?: boolean;
		fileMustExist?: boolean;
		timeout?: number;
		verbose?: (message: string) => void;
	};

	type Statement = {
		run(...parameters: any[]): Database;
		get(...parameters: any[]): any;
		all(...parameters: any[]): any[];
		iterate(...parameters: any[]): IterableIterator<any>;
		bind(...parameters: any[]): Statement;
		pluck(toggleState?: boolean): Statement;
		expand(toggleState?: boolean): Statement;
		raw(toggleState?: boolean): Statement;
	};

	type Transaction = {
		(...parameters: any[]): any;
		default(...parameters: any[]): any;
		deferred(...parameters: any[]): any;
		immediate(...parameters: any[]): any;
		exclusive(...parameters: any[]): any;
	};

	class Database {
		constructor(filename: string, options?: DatabaseOptions);

		prepare(source: string): Statement;
		transaction(fn: (...parameters: any[]) => any): Transaction;
		exec(source: string): Database;
		pragma(source: string, options?: {simple: boolean}): any;
		function(name: string, cb: (...parameters: any[]) => any): Database;
		loadExtension(path: string): void;
		close(): void;
	}

	export = Database;
}
