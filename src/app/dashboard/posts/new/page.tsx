import PostForm from '../components/PostForm';

export const metadata = {
  title: '新規記事作成 | HARU TECHNOLOGY',
  description: '新しいブログ記事を作成します。',
};

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">新規記事作成</h1>
      <PostForm />
    </div>
  );
}