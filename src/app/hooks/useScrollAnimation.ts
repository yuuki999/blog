import { useEffect, useRef } from 'react';
import styles from '../styles/animation.module.scss';

export const useScrollAnimation = () => {
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const options = {
      threshold: 0.1 // 要素が 10% 表示されたときにコールバックが呼ばれる
    };

    // IntersectionObserverは、特定の要素（ターゲット要素）がビューポートや特定の祖先要素と交差する（つまり、見えるようになるまたは見えなくなる）時に非同期で通知を受け取るためのAPIです。
    // これにより、要素が表示されたタイミングでアニメーションを開始したり、遅延読み込みを実行したりすることが容易になります。
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { // 要素がビューポートに入った場合の処理
          entry.target.classList.add(styles.show); // クラスを追加してアニメーションを開始
          observer.unobserve(entry.target); // 観測を停止
        }
      });
    }, options);

    // 参照リスト内の各要素を観測
    elementsRef.current.forEach(element => {
      if (element) observer.observe(element);
    });

    // クリーンアップ関数
    return () => {
      elementsRef.current.forEach(element => {
        if (element) observer.unobserve(element); // 要素の観測を停止
      });
    };
  }, []);

  // 要素を参照リストに追加する関数
  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };

  return addToRefs;
};
