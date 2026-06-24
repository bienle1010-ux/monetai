-- Chạy lệnh này trong Supabase SQL Editor
-- Vào: https://supabase.com → Project → SQL Editor → New Query

-- ── Bảng đăng ký users ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS registrations (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL UNIQUE,
  plan        TEXT        NOT NULL DEFAULT 'Creator',
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip          TEXT
);

CREATE INDEX IF NOT EXISTS idx_registrations_joined_at ON registrations (joined_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_email     ON registrations (email);

ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- ── Bảng sản phẩm Affiliate (Admin quản lý) ────────────────────────────────
CREATE TABLE IF NOT EXISTS affiliate_products (
  id             BIGSERIAL PRIMARY KEY,
  name           TEXT        NOT NULL,
  brand          TEXT        NOT NULL,
  description    TEXT,
  category       TEXT        NOT NULL DEFAULT 'AI Chat',
  commission     TEXT        NOT NULL DEFAULT '20%',
  price          TEXT        NOT NULL DEFAULT 'Liên hệ',
  affiliate_link TEXT        NOT NULL DEFAULT '#',
  rating         DECIMAL(2,1) NOT NULL DEFAULT 4.5,
  is_hot         BOOLEAN     NOT NULL DEFAULT false,
  is_active      BOOLEAN     NOT NULL DEFAULT true,
  sort_order     INTEGER     NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_products_category  ON affiliate_products (category);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_is_active ON affiliate_products (is_active);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_sort      ON affiliate_products (sort_order);

ALTER TABLE affiliate_products DISABLE ROW LEVEL SECURITY;

-- ── Dữ liệu mặc định ───────────────────────────────────────────────────────
INSERT INTO affiliate_products (name, brand, description, category, commission, price, affiliate_link, rating, is_hot, sort_order)
VALUES
  ('ChatGPT Plus',  'OpenAI',     'AI chat mạnh nhất thế giới',          'AI Chat',     '30%', '20 USD/tháng', '#', 4.9, true,  1),
  ('Claude Pro',    'Anthropic',  'AI chat thông minh, an toàn',          'AI Chat',     '25%', '20 USD/tháng', '#', 4.8, true,  2),
  ('Midjourney',    'Midjourney', 'AI tạo hình ảnh đẹp nhất',            'AI Image',    '20%', '10 USD/tháng', '#', 4.8, true,  3),
  ('Jasper AI',     'Jasper',     'AI viết content cho Marketing',        'AI Writing',  '40%', '49 USD/tháng', '#', 4.6, false, 4),
  ('Canva Pro',     'Canva',      'Thiết kế chuyên nghiệp với AI',        'AI Design',   '20%', '13 USD/tháng', '#', 4.7, false, 5),
  ('Copy.ai Pro',   'Copy.ai',    'AI viết copy bán hàng',               'AI Writing',  '35%', '49 USD/tháng', '#', 4.5, false, 6),
  ('Notion AI',     'Notion',     'Workspace thông minh với AI',          'Productivity','15%', '16 USD/tháng', '#', 4.7, false, 7),
  ('Runway ML',     'Runway',     'AI tạo và chỉnh sửa video',           'AI Video',    '25%', '15 USD/tháng', '#', 4.6, true,  8)
ON CONFLICT DO NOTHING;

-- ── Bảng giao dịch thanh toán (Casso webhook) ─────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id          BIGSERIAL PRIMARY KEY,
  email       TEXT        NOT NULL,
  amount      INTEGER     NOT NULL,   -- VNĐ
  credits     INTEGER     NOT NULL,   -- credits được cộng
  tid         TEXT        UNIQUE,     -- transaction ID từ ngân hàng
  description TEXT,                   -- nội dung chuyển khoản
  status      TEXT        NOT NULL DEFAULT 'confirmed',
  paid_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_email    ON payments (email);
CREATE INDEX IF NOT EXISTS idx_payments_paid_at  ON payments (paid_at DESC);

ALTER TABLE payments DISABLE ROW LEVEL SECURITY;

-- ── Trigger tự cập nhật updated_at ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_affiliate_products_updated ON affiliate_products;
CREATE TRIGGER trg_affiliate_products_updated
  BEFORE UPDATE ON affiliate_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
