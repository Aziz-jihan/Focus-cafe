import coin from "../assets/coin.webp";
import formatTime from "../utils/formatTime";
import rewardFor from "../utils/reward";
import CoinBadge from "./CoinBadge";
import { CafeLogo, CupIcon } from "./PixelIcons";
import SleepingCat from "./SleepingCat";

interface HomeScreenProps {
  coins: number;
  totalSeconds: number;
  catOnPanel: boolean;
  onOpenPicker: () => void;
  onOpenMenu: () => void;
  onStart: () => void;
}

const PROGRESS_SEGMENTS = 16;

function HomeScreen({ coins, totalSeconds, catOnPanel, onOpenPicker, onOpenMenu, onStart }: HomeScreenProps) {
  const timeText = formatTime(totalSeconds);
  const isLong = timeText.length > 5;
  const reward = rewardFor(totalSeconds);

  return (
    <>
      <div aria-hidden="true" className="absolute inset-0 bg-espresso/30" />

      <div className="relative z-[1] flex min-h-dvh flex-col px-5 pt-14 pb-10 md:px-10 md:pt-8 md:pb-12">
        {/* Equal side columns keep the title centred whatever the coin count width */}
        <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-4">
          <div className="justify-self-start">
            <CoinBadge coins={coins} />
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex">
              <CafeLogo />
            </span>
            <span className="font-pixel text-xs tracking-[0.06em] text-latte [text-shadow:3px_3px_0_#322D2A] md:text-base">
              FOCUS CAFE
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open menu"
            className="pixel-btn pixel-btn-icon justify-self-end md:hidden"
          >
            <CupIcon size={22} />
          </button>
          <button type="button" onClick={onOpenMenu} className="pixel-btn hidden justify-self-end text-sm! md:inline-flex">
            <CupIcon />
            Menu
          </button>
        </header>

        <main className="relative flex flex-1 items-end justify-center pb-2 md:items-center md:pt-[120px] md:pb-6">
          <section
            aria-label="Focus timer"
            className="pixel-panel relative flex w-full flex-col items-center gap-[18px] px-6 py-7 md:max-w-[580px] md:gap-6 md:px-11 md:pt-10 md:pb-11"
          >
            <div className="self-start bg-espresso px-3 py-[7px] font-pixel text-[10px] tracking-[0.08em] text-latte md:px-3.5 md:py-2 md:text-[11px]">
              FOCUS SESSION
            </div>

            <button
              type="button"
              onClick={onOpenPicker}
              aria-label={`Change focus length, currently ${timeText}`}
              className={`time-display ${isLong ? "text-[36px] md:text-[56px]" : "text-[56px] md:text-[84px]"}`}
            >
              {timeText}
            </button>

            <p className="-mt-1.5 text-center text-[17px] text-berry md:-mt-2 md:text-xl">
              <span className="md:hidden">Tap the time to change it</span>
              <span className="hidden md:inline">Click the time to change it</span>
            </p>

            <div aria-hidden="true" className="flex w-full gap-[3px] bg-espresso p-1 md:hidden">
              {Array.from({ length: PROGRESS_SEGMENTS }, (_, i) => (
                <span key={i} className="h-3 flex-1 bg-sand" />
              ))}
            </div>

            <div className="flex items-center gap-2 text-base md:hidden">
              <img src={coin} alt="" className="pixelated size-[22px]" />
              <span>Finish to earn {reward} coins</span>
            </div>

            <button type="button" onClick={onStart} className="pixel-btn min-h-16! w-full text-xl! md:min-h-[72px]! md:text-2xl!">
              FOCUS
            </button>

            {catOnPanel && (
              <SleepingCat className="-top-[97px] -right-[27px] h-[165px] w-[222px] md:-top-[117px] md:h-[198px] md:w-[259px]" />
            )}
          </section>
        </main>
      </div>
    </>
  );
}

export default HomeScreen;
