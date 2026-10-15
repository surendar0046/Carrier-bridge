"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports.DbClient = void 0;
exports.formatSql = formatSql;
exports.query = query;
exports.getClient = getClient;
exports.testDbConnection = testDbConnection;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const connectionUri = process.env.DATABASE_URL ||
    'mysql://root:@localhost:3306/career_bridge';
// Convert PostgreSQL $1, $2, ... placeholders to MySQL ?
function formatSql(sql) {
    return sql.replace(/\$\d+/g, '?');
}
class DbClient {
    constructor(connection) {
        this.connection = connection;
    }
    async query(text, params) {
        const formatted = formatSql(text);
        const [result] = await this.connection.query(formatted, params);
        if (Array.isArray(result)) {
            return {
                rows: result,
                rowCount: result.length,
            };
        }
        const header = result;
        return {
            rows: [],
            rowCount: header.affectedRows || 0,
        };
    }
    release() {
        this.connection.release();
    }
}
exports.DbClient = DbClient;
// Native MySQL2 Pool
const rawPool = promise_1.default.createPool({
    uri: connectionUri,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0,
    multipleStatements: true,
    dateStrings: true,
});
exports.pool = {
    raw: rawPool,
    async query(text, params) {
        const formatted = formatSql(text);
        const [result] = await rawPool.query(formatted, params);
        if (Array.isArray(result)) {
            return {
                rows: result,
                rowCount: result.length,
            };
        }
        const header = result;
        return {
            rows: [],
            rowCount: header.affectedRows || 0,
        };
    },
    async connect() {
        const conn = await rawPool.getConnection();
        return new DbClient(conn);
    },
    async getConnection() {
        return rawPool.getConnection();
    },
    async end() {
        return rawPool.end();
    },
};
async function query(text, params) {
    const start = Date.now();
    const res = await exports.pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development' && duration > 200) {
        console.log('[MySQL] Slow query:', { text: text.substring(0, 100), duration, rows: res.rowCount });
    }
    return res;
}
async function getClient() {
    return exports.pool.connect();
}
async function testDbConnection() {
    try {
        const res = await exports.pool.query('SELECT 1 as test');
        return res.rows.length > 0 && (res.rows[0].test === 1 || res.rows[0].test === '1');
    }
    catch (err) {
        console.warn('[MySQL] Connection check failed:', err.message);
        return false;
    }
}
