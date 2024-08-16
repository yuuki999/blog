"use client";

import React from 'react';
import ScrollToTop from "react-scroll-to-top";
import { ArrowUp } from 'lucide-react';
import { useMediaQuery, mediaQuery } from '../hooks/useMediaQuery';

const ScrollToTopButton: React.FC = () => {
  const isMobile = useMediaQuery(mediaQuery.sp);

  return (
    <ScrollToTop 
      smooth 
      component={<ArrowUp size={24} />}
      style={{
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333',
        color: 'white',
        width: isMobile ? '40px' : '50px',
        height: isMobile ? '40px' : '50px',
        bottom: isMobile ? '20px' : '40px',
        right: isMobile ? '15px' : '40px',
      }}
    />
  );
};

export default ScrollToTopButton;
