import { createClient } from '@supabase/supabase-js';

// Supabase管理者クライアントの作成（サービスロールキーを使用）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabaseの環境変数が設定されていません。');
}

// サービスロールキーを使用したクライアント（管理者権限）
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
