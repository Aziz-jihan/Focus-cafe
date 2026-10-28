import { useEffect, useState } from "react";
import coin from "../assets/coin.webp";
import SleepingCat from "./SleepingCat";

interface SessionCompleteProps {
  earned: number;
  onFocusAgain: () => void;
  onHome: () => void;
}

const COUNT_UP_MS = 1200;

// Ticks a number up from 0 so the reward feels earned
function useCountUp(target: number) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_UP_MS);
      setValue(Math.round(target * t));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return value;
}

function SessionComplete({ earned, onFocusAgain, onHome }: SessionCompleteProps) {
  const shown = useCountUp(earned);

  return (
    <>
      <div aria-hidden="true" className="absolute inset-0 bg-espresso/45" />

      <main className="relative z-[1] flex min-h-dvh items-center justify-center px-5 pt-[150px] pb-10 md:px-10 md:pt-[140px]">
        <section
          aria-labelledby="done-title"
          className="pixel-panel relative flex w-full flex-col items-center gap-6 px-6 py-9 text-center md:max-w-[460px] md:gap-7 md:px-11 md:py-11"
        >
          <h1 id="done-title" className="m-0 font-pixel text-xl font-normal [text-shadow:3px_3px_0_#AF8360] md:text-[28px]">
            Finished!!
          </h1>

          <div
            role="status"
            aria-label={`Earned ${earned} coins`}
            className="pixel-border flex items-center gap-3 bg-cream px-5 py-3 md:gap-4 md:px-7 md:py-4"
          >
            <img src={coin} alt="" className="pixelated size-10 animate-bounce md:size-12" />
            <span className="font-pixel text-[28px] text-berry md:text-[40px]">+{shown}</span>
          </div>

          <div className="flex w-full flex-col items-center gap-4">
            <button type="button" onClick={onFocusAgain} autoFocus className="pixel-btn w-full text-xs! md:text-sm!">
              Focus again
            </button>
            <button
              type="button"
              onClick={onHome}
              className="cursor-pointer border-0 bg-transparent text-lg text-berry underline underline-offset-4 hover:text-espresso"
            >
              Back home
            </button>
          </div>

          <SleepingCat
            alt="The calico cat napping on top of the panel"
            className="-top-[97px] -right-[27px] h-[165px] w-[222px] md:-top-[117px] md:h-[198px] md:w-[259px]"
          />
        </section>
      </main>
    </>
  );
}

export default SessionComplete;
