-- 開発環境用：すべてのテーブルのRLS（Row Level Security）を無効にするスクリプト
-- 注意：本番環境では使用しないでください

-- postsテーブルのRLSを無効化
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;

-- tagsテーブルのRLSを無効化
ALTER TABLE tags DISABLE ROW LEVEL SECURITY;

-- post_tagsテーブルのRLSを無効化
ALTER TABLE post_tags DISABLE ROW LEVEL SECURITY;

-- 確認メッセージ
DO $$
BEGIN
  RAISE NOTICE 'すべてのテーブルのRLSが無効化されました。本番環境では必ずRLSを有効にしてください。';
END $$;
