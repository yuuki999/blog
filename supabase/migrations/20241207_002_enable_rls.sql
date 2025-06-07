-- Row Level Security (RLS) の有効化とポリシー設定
-- 実行日: 2024年12月7日

-- RLSの有効化
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

-- 管理者向けポリシー（認証済みユーザーは全ての操作が可能）
CREATE POLICY "authenticated_users_all_posts" ON posts 
FOR ALL 
USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_users_all_tags" ON tags 
FOR ALL 
USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_users_all_post_tags" ON post_tags 
FOR ALL 
USING (auth.role() = 'authenticated');

-- 匿名ユーザー向けポリシー（公開記事のみ閲覧可能）
CREATE POLICY "anon_users_select_published_posts" ON posts 
FOR SELECT 
USING (status = 'published' AND published_at <= NOW());

CREATE POLICY "anon_users_select_tags" ON tags 
FOR SELECT 
USING (true);

CREATE POLICY "anon_users_select_post_tags" ON post_tags 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM posts 
    WHERE posts.id = post_tags.post_id 
    AND posts.status = 'published'
    AND posts.published_at <= NOW()
  )
);

-- コメント追加
COMMENT ON POLICY "authenticated_users_all_posts" ON posts IS '認証済みユーザーは記事に対して全ての操作が可能';
COMMENT ON POLICY "anon_users_select_published_posts" ON posts IS '匿名ユーザーは公開済みの記事のみ閲覧可能';
COMMENT ON POLICY "anon_users_select_tags" ON tags IS '匿名ユーザーはタグを閲覧可能';
COMMENT ON POLICY "anon_users_select_post_tags" ON post_tags IS '匿名ユーザーは公開記事に関連するタグ付けのみ閲覧可能';


-- cron用
CREATE TABLE IF NOT EXISTS daily_pings (
  id INT PRIMARY KEY DEFAULT 1, -- 常に同じレコードを更新するため、IDを1に固定
  last_pinged_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);