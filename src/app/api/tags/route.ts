import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// タグ一覧を取得するAPI
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('タグ取得エラー:', error);
    return NextResponse.json({ error: 'タグの取得中にエラーが発生しました' }, { status: 500 });
  }
}

// 新しいタグを作成するAPI
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 必須フィールドの検証
    if (!body.name) {
      return NextResponse.json({ error: 'タグ名は必須です' }, { status: 400 });
    }
    
    // 同名のタグが存在するか確認
    const { data: existingTag } = await supabase
      .from('tags')
      .select('id')
      .eq('name', body.name)
      .single();
    
    if (existingTag) {
      return NextResponse.json({ error: '同名のタグが既に存在します', id: existingTag.id }, { status: 409 });
    }
    
    // タグの作成
    const { data, error } = await supabase
      .from('tags')
      .insert([{ name: body.name }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('タグ作成エラー:', error);
    return NextResponse.json({ error: 'タグの作成中にエラーが発生しました' }, { status: 500 });
  }
}