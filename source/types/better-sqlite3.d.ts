// 官方沒有出定義檔，用這個暫時擋著用。
declare module 'better-sqlite3' {
  interface DatabaseOptions {
    memory?: boolean;
    readonly?: boolean;
    fileMustExist?: boolean;
    timeout?: number;
    verbose?: (message: string) => void;
  }

  interface Statement {
    run(...params: any[]): Database;
    get(...params: any[]): any;
    all(...params: any[]): any[];
    iterate(...params: any[]): IterableIterator<any>;
    bind(...params: any[]): Statement;
    pluck(toggleState?: boolean): Statement;
    expand(toggleState?: boolean): Statement;
    raw(toggleState?: boolean): Statement;
  }

  interface Transaction {
    (...params: any[]): any;
    default(...params: any[]): any;
    deferred(...params: any[]): any;
    immediate(...params: any[]): any;
    exclusive(...params: any[]): any;
  }

  class Database {
    constructor(filename: string, options?: DatabaseOptions);

    prepare(source: string): Statement;
    transaction(fn: (...params: any[]) => any): Transaction;
    exec(source: string): Database;
    pragma(source: string, options?: { simple: boolean }): any;
    function(name: string, cb: (...params: any[]) => any): Database;
    loadExtension(path: string): void;
    close(): void;
  }

  export = Database;
}