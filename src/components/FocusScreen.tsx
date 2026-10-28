import formatTime from "../utils/formatTime";
import CoinBadge from "./CoinBadge";
import SleepingCat from "./SleepingCat";
import VolumeControl from "./VolumeControl";

interface FocusScreenProps {
  coins: number;
  timeLeft: number;
  totalSeconds: number;
  paused: boolean;
  treat: { name: string; img: string };
  volume: number;
  muted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onTogglePause: () => void;
  onStop: () => void;
}

const SEGMENTS = 20;

function FocusScreen({
  coins,
  timeLeft,
  totalSeconds,
  paused,
  treat,
  volume,
  muted,
  onVolumeChange,
  onToggleMute,
  onTogglePause,
  onStop,
}: FocusScreenProps) {
  const timeText = formatTime(timeLeft);
  const isLong = timeText.length > 5;
  const filled = Math.floor(((totalSeconds - timeLeft) / totalSeconds) * SEGMENTS);

  return (
    <>
      <div
        aria-hidden="true"
        className="pixelated absolute inset-0 bg-(image:--table-mobile) bg-cover bg-bottom bg-no-repeat md:bg-(image:--table-desktop)"
      />

      {/* The table rim sits at a fixed share of the bottom-anchored cover image */}
      <SleepingCat
        alt="A calico cat asleep on the edge of the table"
        className="bottom-[calc(max(47vw,21.8dvh)-60px)] left-1 size-[150px] md:bottom-[calc(max(27.3vw,48.6dvh)-120px)] md:left-[calc(50%-440px)] md:size-[300px]"
      />
      <img
        src={treat.img}
        alt={`${treat.name} on the table`}
        className="pixelated absolute bottom-[calc(max(47vw,21.8dvh)-72px)] left-1/2 w-28 -translate-x-1/2 md:bottom-[calc(max(27.3vw,48.6dvh)-230px)] md:w-[190px]"
      />

      <div className="relative z-[1] flex min-h-dvh flex-col items-center px-5 pt-14 pb-10 md:px-10 md:pt-8 md:pb-14">
        <div className="flex self-stretch justify-start">
          <CoinBadge coins={coins} />
        </div>

        <div
          role="timer"
          aria-label={`Time left ${timeText}`}
          className={`time-big mt-[90px] md:mt-[80px] ${isLong ? "text-[40px] md:text-[84px]" : "text-[60px] md:text-[120px]"} ${paused ? "animate-pulse" : ""}`}
        >
          {timeText}
        </div>

        <div
          aria-hidden="true"
          className="pixel-border mt-8 flex w-full max-w-[300px] gap-[3px] bg-espresso p-1 md:mt-12 md:max-w-[520px] md:gap-1"
        >
          {Array.from({ length: SEGMENTS }, (_, i) => (
            <span key={i} className={`h-2.5 flex-1 md:h-3.5 ${i < filled ? "bg-berry" : "bg-sand"}`} />
          ))}
        </div>
        <p className="mt-4 font-pixel text-[10px] tracking-[0.08em] text-latte [text-shadow:2px_2px_0_#322D2A] md:text-xs">
          {paused ? "PAUSED · THE CAT WAITS" : "SHHH... THE CAT IS NAPPING"}
        </p>

        <div className="flex-1" />

        <div className="flex items-center justify-center gap-4 md:gap-6">
          <button
            type="button"
            onClick={onTogglePause}
            className="pixel-btn pixel-btn-ghost min-h-14! px-6! text-sm! md:min-h-16! md:px-8! md:text-base!"
          >
            {paused ? "Resume" : "Pause"}
          </button>
          <button type="button" onClick={onStop} className="pixel-btn min-h-14! px-6! text-sm! md:min-h-16! md:px-8! md:text-base!">
            Stop
          </button>
          <VolumeControl volume={volume} muted={muted} onVolumeChange={onVolumeChange} onToggleMute={onToggleMute} />
        </div>
      </div>
    </>
  );
}

export default FocusScreen;
