import ImageUploader from '../components/ImageUploader';

export const metadata = {
  title: '管理画面 | HARU TECHNOLOGY',
  description: 'ブログ管理画面',
};

export default function AdminPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-white mb-8">管理画面</h1>
        
        <div className="grid grid-cols-1 gap-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-4">サムネイル画像管理</h2>
            <p className="text-gray-300 mb-6">
              ブログ記事用のサムネイル画像をアップロードします。アップロード後のURLをコピーして、記事のフロントマターに追加してください。
            </p>
            <ImageUploader />
          </div>
        </div>
      </div>
    </div>
  );
}