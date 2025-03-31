import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'general';
    
    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが見つかりません' },
        { status: 400 }
      );
    }

    // ファイル名を生成（一意になるように）
    const filename = `${folder}/${Date.now()}-${file.name}`;
    
    // Blobにアップロード
    const blob = await put(filename, file, {
      access: 'public',
    });

    console.log(`アップロード成功: ${filename}`);

    return NextResponse.json(blob);
  } catch (error) {
    console.error('アップロードエラー:', error);
    return NextResponse.json(
      { error: 'アップロード中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
