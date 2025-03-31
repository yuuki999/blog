import styles from '../styles/base.module.scss';

function TitleText() {
    return (
        <section className={styles.title_text}>
          <h1 className={styles.largeTitle}>AIを使いこなす人材を育て、DXを実現する</h1>
          <p className={styles.description}>
            急速に進化するAI時代において、置き換えられる人材ではなく、AIを駆使できる人材へと成長を支援します。<br/>レガシーな業務から脱却し、AI駆動開発による効率的で創造的な未来へ、企業と個人の可能性を最大化します。
          </p>
        </section>
    );
}

export default TitleText;
