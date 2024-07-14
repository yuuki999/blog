import styles from '../styles/base.module.scss';

function TitleText() {
    return (
        <section className={styles.title_text}>
          <h1 className={styles.largeTitle}>お客様の事業をWEBでサポート</h1>
          <p className={styles.description}>
            お客様のビジネスを成功へと導くために、最新のWEB技術と効果的なデザインを駆使して開発を行います。<br/>継続的なメンテナンスまで、一貫したサービスを展開。お客様の目標達成をWEBの力で支援します。
          </p>
        </section>
    );
}

export default TitleText;
