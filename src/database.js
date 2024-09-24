const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Initialize database in the `db` folder
const dbPath = path.resolve(__dirname, "../db/whatsapp_bot.db");
const db = new sqlite3.Database(dbPath);

// Create tables if they don't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS numbers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      number TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS message_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      template TEXT
    )
  `);
});

module.exports = db;
