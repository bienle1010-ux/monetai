-- Chạy lệnh này trong Supabase SQL Editor
-- Vào: https://supabase.com → Project → SQL Editor → New Query

CREATE TABLE IF NOT EXISTS registrations (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL UNIQUE,
  plan        TEXT        NOT NULL DEFAULT 'Creator',
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip          TEXT
);

-- Index để query nhanh
CREATE INDEX IF NOT EXISTS idx_registrations_joined_at ON registrations (joined_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_email     ON registrations (email);

-- Tắt Row Level Security (chỉ dùng service_role key từ server)
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;
