"use client";

import BlurText from "./BlurText";

export default function BlurredText({ text }: { text: string }) {
  return (
    <>
      <BlurText
        text="Welcome to Edu"
        animationFrom={{ opacity: 0 }}
        animationTo={{ opacity: 1 }}
        onAnimationComplete={() => {}}
      />
      <BlurText
        text="X"
        className="text-blue-500 t "
        delay={0.3}
        animationFrom={{ opacity: 0 }}
        animationTo={{ opacity: 1 }}
        onAnimationComplete={() => {}}
      />
    </>
  );
}
