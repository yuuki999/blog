import React from 'react';
import Services from './components/Services';
import Portfolio from './components/Works';
import TitleText from './components/TitleText';
import FadeInSection from './components/animation/FadeInSection';
import Profile from './components/Profile';

// RSC
export default function Home() {
  return (
    <>
      <TitleText />
      <FadeInSection><div id="about"><Profile /></div></FadeInSection>
      <FadeInSection><div id="service"><Services /></div></FadeInSection>
      <FadeInSection><div id="works"><Portfolio /></div></FadeInSection>
    </>
  );
}
