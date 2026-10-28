import { useEffect, useState } from "react";

interface LoadingScreenProps {
  // Image URLs to fetch before the cafe opens
  assets: string[];
  onDone: () => void;
}

const MIN_SHOW_MS = 2000;
const FADE_MS = 500;
const DOT_STEP_MS = 400;
// Loading... -> Loading.. -> Loading. -> Loading.. -> back to the start
const DOT_CYCLE = [3, 2, 1, 2];

function loadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });
}

function LoadingScreen({ assets, onDone }: LoadingScreenProps) {
  const [step, setStep] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setStep((s) => (s + 1) % DOT_CYCLE.length), DOT_STEP_MS);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let fadeTimer = 0;
    const minDelay = new Promise((resolve) => setTimeout(resolve, MIN_SHOW_MS));

    Promise.all([minDelay, document.fonts.ready, ...assets.map(loadImage)]).then(() => {
      if (cancelled) return;
      setLeaving(true);
      fadeTimer = window.setTimeout(onDone, FADE_MS);
    });

    return () => {
      cancelled = true;
      clearTimeout(fadeTimer);
    };
  }, [assets, onDone]);

  const dots = DOT_CYCLE[step];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Focus Cafe"
      className={`pixelated fixed inset-0 z-50 flex items-center justify-center bg-espresso bg-(image:--backdrop-mobile) bg-cover bg-top bg-no-repeat transition-opacity duration-500 md:bg-(image:--backdrop-desktop) md:bg-[center_45%] ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div aria-hidden="true" className="absolute inset-0 bg-espresso/20" />

      <div className="relative flex flex-col items-center gap-2 px-5 text-center text-foam [text-shadow:3px_3px_0_#322D2A] md:gap-3">
        <p className="m-0 text-2xl font-semibold md:text-[38px]">Welcome To</p>
        <h1 className="m-0 text-[48px] leading-none font-bold [text-shadow:4px_4px_0_#322D2A] md:text-[80px] md:[text-shadow:5px_5px_0_#322D2A]">
          Focus Cafe
        </h1>
        <p className="m-0 mt-2 text-xl font-medium md:text-[28px]">
          Loading
          {/* Hidden dots hold the width so the word never shifts */}
          <span aria-hidden="true">{".".repeat(dots)}</span>
          <span aria-hidden="true" className="invisible">
            {".".repeat(3 - dots)}
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoadingScreen;
