import PostForm from '../components/PostForm';

export const metadata = {
  title: 'u65b0u898fu8a18u4e8bu4f5cu6210 | HARU TECHNOLOGY',
  description: 'u65b0u3057u3044u30d6u30edu30b0u8a18u4e8bu3092u4f5cu6210u3057u307eu3059u3002',
};

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">u65b0u898fu8a18u4e8bu4f5cu6210</h1>
      <PostForm />
    </div>
  );
}
