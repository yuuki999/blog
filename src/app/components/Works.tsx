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
      url: 'https://azure942162.studio.site', 
      title: '会社HP サンプル',
      image: '/images/portfolio/studio1.png'
    },
    { 
      url: 'https://white629331.studio.site/', 
      title: 'パーソナルジムHP サンプル',
      image: '/images/portfolio/studio2.png'
    },
    { 
      url: 'https://yellow544103.studio.site/', 
      title: '飲食店HP サンプル',
      image: '/images/portfolio/studio3.png'
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
