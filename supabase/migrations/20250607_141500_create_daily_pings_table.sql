CREATE TABLE IF NOT EXISTS daily_pings (
  id INT PRIMARY KEY DEFAULT 1, -- 常に同じレコードを更新するため、IDを1に固定
  last_pinged_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 初期データの挿入（cronジョブが初回実行時にレコードが存在するように）
-- 既にレコードが存在する場合は何もしない
INSERT INTO daily_pings (id, last_pinged_at)
VALUES (1, NOW())
ON CONFLICT (id) DO NOTHING;
