"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import styles from '../../styles/init_animation.module.scss';

const LoadingAnimation: React.FC = () => {
  const [text, setText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const fullText = "HARU TECHNOLOGY";
  const totalTypingTime = 2000;
  const underlineDelay = 200;

  const animateText = useCallback(() => {
    const textLength = fullText.length;
    const timePerChar = totalTypingTime / textLength;
    
    for (let i = 0; i < textLength; i++) {
      setTimeout(() => {
        setText(fullText.slice(0, i + 1));
        if (i === textLength - 1) {
          setTimeout(() => {
            setIsTypingComplete(true);
          }, underlineDelay);
        }
      }, i * timePerChar);
    }
  }, [fullText, totalTypingTime, underlineDelay]);

  useEffect(() => {
    animateText();
  }, [animateText]);

  return (
    <div className={styles.loadingContainer}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <span ref={textRef} className={styles.loadingText}>{text}</span>
        {isTypingComplete && <div className={styles.underline} />}
      </div>
    </div>
  );
};

const InitAnimation: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <LoadingAnimation />}
      <div className={isLoading ? styles.hiddenContent : styles.visibleContent}>
        {children}
      </div>
    </>
  );
};

export default InitAnimation;
