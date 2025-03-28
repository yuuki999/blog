import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// 特定のタグを取得するAPI
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('タグ取得エラー:', error);
    return NextResponse.json({ error: 'タグの取得中にエラーが発生しました' }, { status: 500 });
  }
}

// タグを削除するAPI
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // まず、post_tagsテーブルから関連付けを削除
    await supabase
      .from('post_tags')
      .delete()
      .eq('tag_id', id);
    
    // タグを削除
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('タグ削除エラー:', error);
    return NextResponse.json({ error: 'タグの削除中にエラーが発生しました' }, { status: 500 });
  }
}
