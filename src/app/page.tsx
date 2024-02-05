"use client";

import React, { useState } from "react";
import { supabase } from './utils/supabaseClient'; 

export default function Home() {
  const [uploadStatus, setUploadStatus] = useState("");

  // ファイルアップロードハンドラー
  const handleFileUpload = async (event: any) => {
    setUploadStatus(""); // ステータスメッセージをリセット
    const file = event.target.files[0];
    if (!file) {
      setUploadStatus("ファイルが選択されていません。");
      return;
    }
    const imageFileName = file.name;

    // FormData オブジェクトを作成し、ファイルを添付
    const formData = new FormData();
    formData.append('file', file);

    // supabaseバケットにアップロード
    let filePath;
    try {
      // Supabaseストレージにファイルをアップロード
      const timestamp = Date.now();
      filePath = `uploads/${timestamp}_${imageFileName}`;
      const { error } = await supabase.storage.from('test_movie_buket').upload(filePath, file);

      if (error) {
        throw error;
      }

      setUploadStatus('supaにファイルがアップロードされました。');
    } catch (error) {
      console.error('supaアップロード中にエラーが発生しました:', error);
      setUploadStatus('supaアップロード中にエラーが発生しました。');
    }

    console.log("test")

    // fetch API を使用してファイルをバックエンドに送信
    console.log(filePath)
    try {
      const response = await fetch(`/api/upload?filePath=${filePath}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // アップロード成功
        setUploadStatus('S3にファイルがアップロードされました。');
      } else {
        // アップロード失敗
        setUploadStatus('S3のファイルアップロードに失敗しました。');
      }
    } catch (error) {
      console.error('S3のアップロード中にエラーが発生しました:', error);
      setUploadStatus('アップロード中にエラーが発生しました。');
    }
  };

  return (
    <main>
      <h1>テストページ</h1>
      <input type="file" onChange={handleFileUpload} />
      {uploadStatus && <p>{uploadStatus}</p>}
    </main>
  );
}
