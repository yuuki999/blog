// src/app/api/cron/ping/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabaseクライアントの初期化
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// cronジョブはサーバーサイドで実行されるため、サービスロールキーの使用を強く推奨します
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 環境変数のチェックはGETハンドラ内で行います

export async function GET() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Supabase URL or Service Role Key is not defined in environment variables.');
    return NextResponse.json(
      { error: 'Supabase configuration missing. Check server logs and environment variables.' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  try {
    const currentTime = new Date().toISOString();

    // daily_pingsテーブルのid=1のレコードを更新 (存在しない場合は挿入)
    const { data, error } = await supabase
      .from('daily_pings')
      .upsert({ id: 1, last_pinged_at: currentTime }, { onConflict: 'id' }) // idが衝突した場合の処理を明示
      .select(); // オプション: 更新/挿入されたデータを取得

    if (error) {
      console.error('Error upserting daily_pings:', error);
      return NextResponse.json({ error: 'Failed to update ping time', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Ping time updated successfully', data });
  } catch (e: any) {
    console.error('Unexpected error in cron ping route:', e);
    // エラーオブジェクトがErrorインスタンスか確認し、メッセージを取得
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: 'An unexpected error occurred', details: errorMessage }, { status: 500 });
  }
}