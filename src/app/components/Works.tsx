import Link from 'next/link';
import styles from '../styles/works.module.scss';
import Image from 'next/image';

// memo: 無料期間が切れたので手動で画像を設定することに。
async function fetchThumbnail(url: string) {
  const apiKey = process.env.SCREENSHOTAPI_KEY;
  const screenshotApiUrl = process.env.SCREENSHOTAPI_URL;

  try {
    const response = await fetch(
      `${screenshotApiUrl}?token=${apiKey}&url=${encodeURIComponent(url)}&width=800&height=600`
    );

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP error! status: ${response.status} body: ${errorBody}`);
    }

    const data = await response.json();
    return data.screenshot;
  } catch (error) {
    console.error('Failed to fetch thumbnail:', error);
    return null;
  }
}

const Portfolio: React.FC = async () => {
  const portfolioItems = [
    { 
      url: 'https://sample-admin-eta.vercel.app/admin/login/', 
      title: '管理画面サンプル',
      image: '/images/portfolio/sample_admin.png' // 事前に撮影した画像のパス, image プロパティがない場合、fetchThumbnail が使用されます
    },
    { 
      url: 'https://photo-app-seven-psi.vercel.app/photo', 
      title: '動画・写真撮影Webアプリ',
      image: '/images/portfolio/photo_app.png'
    },
    { 
      url: 'https://docu-trans-wait-list-gqby.vercel.app/ja', 
      title: 'エクセル一括翻訳アプリ',
      image: '/images/portfolio/excel.png'
    },
    { 
      url: 'https://fencing-overlay.vercel.app/', 
      title: 'フェンディング動画解説アプリ',
      image: '/images/portfolio/fencing.png'
    },
  ];

  const thumbnails = await Promise.all(
    portfolioItems.map(async (item) => {
      if (item.image) {
        return item.image; // 事前に撮影した画像がある場合はそれを使用
      }
      return fetchThumbnail(item.url); // ない場合は API から取得
    })
  );

  return (
    <section id="works" className={styles.services}>
      <h2>Portfolio</h2>
      <div className={styles.service_container}>
        {portfolioItems.map((item, index) => (
          <Link key={index} href={item.url} target="_blank" rel="noopener noreferrer">
            <div className={styles.portfolio_item}>
              <div className={styles.thumbnail_container}>
                <Image
                  src={thumbnails[index]}
                  alt={`${item.title} Thumbnail`}
                  width={300}
                  height={250}
                  objectFit="contain"
                  className={styles.thumbnail}
                />
              </div>
              <div className={styles.item_title}>{item.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Portfolio;
