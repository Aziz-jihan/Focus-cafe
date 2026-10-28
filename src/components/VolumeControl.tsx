import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SpeakerIcon } from "./PixelIcons";

interface VolumeControlProps {
  volume: number;
  muted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

// Speaker button that pops up a slider for the cafe background noise
function VolumeControl({ volume, muted, onVolumeChange, onToggleMute }: VolumeControlProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const level = muted ? 0 : Math.round(volume * 100);

  useEffect(() => {
    if (!open) return;
    const handlePointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointer);
    window.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      {open && (
        <div
          id="volume-panel"
          className="pixel-panel absolute right-0 bottom-[calc(100%+20px)] flex w-[260px] flex-col gap-4 px-5 py-5 md:right-auto md:left-1/2 md:-translate-x-1/2"
        >
          <div className="flex items-center justify-between">
            <span className="font-pixel text-[10px] tracking-[0.06em]">CAFE SOUNDS</span>
            <span className="font-pixel text-[10px] text-berry">{level}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={level}
            onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
            aria-label="Cafe sound volume"
            aria-valuetext={`${level}%`}
            className="pixel-range w-full"
            style={{ "--level": `${level}%` } as CSSProperties}
          />
          <button
            type="button"
            onClick={onToggleMute}
            aria-pressed={muted}
            className="pixel-btn pixel-btn-ghost min-h-11! text-[10px]! md:min-h-11! md:text-xs!"
          >
            <SpeakerIcon size={16} muted={!muted} />
            {muted ? "Unmute" : "Mute"}
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="volume-panel"
        aria-label={`Cafe sound volume, ${muted ? "muted" : `${level}%`}`}
        className="pixel-btn pixel-btn-ghost size-14! min-h-14! p-0! md:size-16! md:min-h-16!"
      >
        <SpeakerIcon size={22} muted={muted || level === 0} />
      </button>
    </div>
  );
}

export default VolumeControl;
