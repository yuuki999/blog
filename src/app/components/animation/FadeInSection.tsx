"use client";

import React, { ReactNode } from 'react';
import styles from '../../styles/animation.module.scss';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

type FadeInSectionProps = {
  children: ReactNode;
};

const FadeInSection: React.FC<FadeInSectionProps> = ({ children }) => {
  const addToRefs = useScrollAnimation();
  return (
    <div ref={addToRefs} className={`${styles['fade-in']}`}>
      {children}
    </div>
  );
};

export default FadeInSection;
