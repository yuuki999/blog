"use client";

import React, { useState } from "react";

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

    // fetch API を使用してファイルをバックエンドに送信
    try {
      const response = await fetch(`/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // アップロード成功
        setUploadStatus('ファイルがアップロードされました。');
      } else {
        // アップロード失敗
        setUploadStatus('ファイルアップロードに失敗しました。');
      }
    } catch (error) {
      console.error('アップロード中にエラーが発生しました:', error);
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
