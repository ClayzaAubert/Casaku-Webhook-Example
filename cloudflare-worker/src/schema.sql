-- D1 Database Schema untuk menyimpan riwayat webhook Casaku
CREATE TABLE IF NOT EXISTS webhooks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_id TEXT NOT NULL UNIQUE,
  amount REAL NOT NULL,
  package_name TEXT NOT NULL,
  app_name TEXT NOT NULL,
  status TEXT NOT NULL,
  paid_at TEXT NOT NULL,
  raw_payload TEXT NOT NULL,
  received_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_webhooks_transaction_id ON webhooks(transaction_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_received_at ON webhooks(received_at);
