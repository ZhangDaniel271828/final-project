import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import fs from "fs";

/** @type Database<sqlite3.Database, sqlite3.Statement> */
let db;

// 指定固定的数据库文件路径，非常重要
const DB_FILE_PATH = "../backend/project-database.db";

// 指定初始化脚本的固定路径，非常重要
const INIT_SCRIPT_PATH = "../backend/src/sql/init-db.sql";


/**
 * Opens the database. If it doesn't exist, it initializes it.
 *
 * @returns {Promise<Database<sqlite3.Database, sqlite3.Statement>>} the database
 */
export async function getDatabase() {
  if (!db) {
    db = await openDatabase();
  }
  return db;
}

/**
 * Opens the database identified by the fixed file path.
 * Then, if it didn't already exist, initializes it.
 *
 * @returns {Promise<Database<sqlite3.Database, sqlite3.Statement>>} the database
 */
async function openDatabase() {
  const dbExists = fs.existsSync(DB_FILE_PATH);
  const db = await open({
    filename: DB_FILE_PATH,
    driver: sqlite3.Database
  });

  // Enable foreign keys
  await db.exec("PRAGMA foreign_keys = ON");

  if (!dbExists) {
    console.log(`Database ${DB_FILE_PATH} doesn't exist.`);
    await initDatabase(db);
  }

  return db;
}

/**
 * Initializes the database using the init script provided in the DB_INIT_SCRIPT env variable.
 *
 * @param {Database<sqlite3.Database, sqlite3.Statement>} db the database to initialize
 */
async function initDatabase(db) {
  const initScript = INIT_SCRIPT_PATH;
  console.log(`Initializing database using init script ${initScript}`);
  const sql = fs.readFileSync(initScript).toString();
  await db.exec(sql);
  console.log("Database initialized successfully!");
}