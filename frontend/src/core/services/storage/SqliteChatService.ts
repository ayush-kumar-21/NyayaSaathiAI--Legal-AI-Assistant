
import initSqlJs, { Database, QueryExecResult } from 'sql.js';
import localforage from 'localforage';

export interface ChatMessage {
    id?: number;
    role: 'user' | 'model' | 'system';
    content: string;
    timestamp: number;
}

const DB_KEY = 'nyayasahayak_chat_db_v1';
const WASM_URL = '/assets/sql-wasm.wasm';

class SqliteChatService {
    private db: Database | null = null;
    private isInitialized = false;

    async init() {
        if (this.isInitialized) return;

        try {
            console.log("Initializing SQLite Chat Service...");

            // Check if initSqlJs is available
            if (typeof initSqlJs !== 'function') {
                console.error("sql.js not loaded correctly.");
                return;
            }

            // 1. Load SQL.js
            const SQL = await initSqlJs({
                locateFile: (file) => WASM_URL
            });

            // 2. Load existing DB from storage
            const savedDbBuffer = await localforage.getItem<Uint8Array>(DB_KEY);

            if (savedDbBuffer) {
                console.log("Loading existing database...");
                try {
                    this.db = new SQL.Database(savedDbBuffer);
                } catch (e) {
                    console.error("Corrupt DB, creating new one", e);
                    this.db = new SQL.Database();
                    this.initTables();
                }
            } else {
                console.log("Creating new database...");
                this.db = new SQL.Database();
                this.initTables();
            }

            this.isInitialized = true;
            console.log("SQLite Service Initialized.");
        } catch (error) {
            console.error("Failed to initialize SQLite Service (running in fallback/memory mode):", error);
            // Do not throw, just existing without DB means encryption won't work but app won't crash
        }
    }

    private initTables() {
        if (!this.db) return;

        const schema = `
            CREATE TABLE IF NOT EXISTS chats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                timestamp INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_timestamp ON chats(timestamp);
        `;

        this.db.run(schema);
        this.saveDb();
    }

    async saveMessage(role: string, content: string): Promise<number> {
        if (!this.db) await this.init();
        if (!this.db) return -1;

        const stmt = this.db!.prepare("INSERT INTO chats (role, content, timestamp) VALUES (?, ?, ?)");
        const now = Date.now();
        stmt.run([role, content, now]);
        stmt.free();

        await this.saveDb();

        // Return ID of inserted row
        // Valid for simple sequential inserts
        const res = this.db!.exec("SELECT last_insert_rowid()");
        return res[0].values[0][0] as number;
    }

    async getHistory(): Promise<ChatMessage[]> {
        if (!this.db) {
            try {
                await this.init();
            } catch (e) {
                return [];
            }
        }
        if (!this.db) return [];

        const result = this.db!.exec("SELECT * FROM chats ORDER BY timestamp ASC");

        if (result.length === 0) return [];

        const rows = result[0].values;
        const columns = result[0].columns;

        // Map rows to objects
        return rows.map(row => {
            const msg: any = {};
            columns.forEach((col, index) => {
                msg[col] = row[index];
            });
            return msg as ChatMessage;
        });
    }

    async clearHistory() {
        if (!this.db) return;
        this.db.run("DELETE FROM chats");
        await this.saveDb();
    }

    private async saveDb() {
        if (!this.db) return;
        const data = this.db.export();
        await localforage.setItem(DB_KEY, data);
    }
}

export const sqliteChatService = new SqliteChatService();
