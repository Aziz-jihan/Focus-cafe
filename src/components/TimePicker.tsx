import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Overlay from "./Overlay";
import { ChevronDownIcon, ChevronUpIcon } from "./PixelIcons";
import SleepingCat from "./SleepingCat";

interface TimePickerProps {
  totalSeconds: number;
  onCancel: () => void;
  onConfirm: (seconds: number) => void;
}

const PRESETS = [15, 25, 50, 90];
const MAX_HOURS = 4;

// Indexed by distance from the selected row
const ROW_STYLES = [
  "text-2xl md:text-[30px]",
  "text-base opacity-75 md:text-lg",
  "text-xs opacity-45 md:text-sm",
];

interface WheelProps {
  label: string;
  unit: string;
  value: number;
  count: number;
  onChange: (value: number) => void;
}

// Scroll-snapping wheel showing five rows; the row in the highlighted middle slot is the value
function Wheel({ label, unit, value, count, onChange }: WheelProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);
  const wrap = (n: number) => (n + count) % count;

  const rowHeight = () => listRef.current?.querySelector<HTMLElement>("[data-row]")?.offsetHeight ?? 1;

  // Move the wheel when the value changes from outside a scroll (arrows, presets, row taps).
  // Scrolling itself reports the value it lands on, so it never triggers a jump here.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const current = Math.round(list.scrollTop / rowHeight());
    if (current !== value) {
      const near = hasScrolled.current && Math.abs(current - value) <= 3;
      list.scrollTo({ top: value * rowHeight(), behavior: near ? "smooth" : "instant" });
    }
    hasScrolled.current = true;
  }, [value]);

  const handleScroll = () => {
    const list = listRef.current;
    if (!list) return;
    const index = Math.min(count - 1, Math.max(0, Math.round(list.scrollTop / rowHeight())));
    if (index !== value) onChange(index);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    onChange(wrap(value + (e.key === "ArrowUp" ? -1 : 1)));
  };

  return (
    <div className="flex flex-col items-center gap-1.5 md:gap-2">
      <span className="text-lg text-berry md:text-xl">{label}</span>
      <button
        type="button"
        onClick={() => onChange(wrap(value - 1))}
        aria-label={`Fewer ${unit}`}
        className="pixel-btn pixel-btn-ghost pixel-btn-icon"
      >
        <ChevronUpIcon />
      </button>
      <div className="relative w-full">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 h-[60px] -translate-y-1/2 bg-cream shadow-[inset_0_0_0_4px_#813D3C] md:h-[68px]"
        />
        <div
          ref={listRef}
          role="group"
          aria-label={`${label}: ${value}`}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          className="scrollbar-none relative h-[240px] snap-y snap-mandatory overflow-y-auto overscroll-contain md:h-[280px]"
        >
          {/* Two empty rows above and below let the first and last values reach the middle */}
          <div aria-hidden="true" className="h-24 md:h-28" />
          {Array.from({ length: count }, (_, v) => (
            <button
              key={v}
              data-row
              type="button"
              tabIndex={v === value ? 0 : -1}
              onClick={() => onChange(v)}
              aria-label={`${v} ${unit}`}
              aria-pressed={v === value}
              className={`picker-row snap-center ${ROW_STYLES[Math.min(2, Math.abs(v - value))]}`}
            >
              {String(v).padStart(2, "0")}
            </button>
          ))}
          <div aria-hidden="true" className="h-24 md:h-28" />
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(wrap(value + 1))}
        aria-label={`More ${unit}`}
        className="pixel-btn pixel-btn-ghost pixel-btn-icon"
      >
        <ChevronDownIcon />
      </button>
    </div>
  );
}

function TimePicker({ totalSeconds, onCancel, onConfirm }: TimePickerProps) {
  const [hours, setHours] = useState(Math.min(MAX_HOURS, Math.floor(totalSeconds / 3600)));
  const [minutes, setMinutes] = useState(Math.floor((totalSeconds % 3600) / 60));

  const handleConfirm = () => {
    // Never allow a zero-length session
    onConfirm(Math.max(60, hours * 3600 + minutes * 60));
  };

  return (
    <Overlay onClose={onCancel}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="picker-title"
        className="pixel-panel relative flex w-full flex-col gap-[22px] px-[22px] py-7 md:max-w-[540px] md:gap-7 md:px-10 md:pt-9 md:pb-10"
      >
        <h2
          id="picker-title"
          className="m-0 text-center font-pixel text-lg font-normal [text-shadow:3px_3px_0_#AF8360] md:text-[22px]"
        >
          Select Time
        </h2>

        <div className="flex flex-wrap justify-center gap-3" role="group" aria-label="Quick picks">
          {PRESETS.map((mins) => {
            const active = hours * 60 + minutes === mins;
            return (
              <button
                key={mins}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setHours(Math.floor(mins / 60));
                  setMinutes(mins % 60);
                }}
                className={`pixel-border min-h-11 cursor-pointer px-3 font-pixel text-[10px] md:px-4 md:text-xs ${
                  active ? "bg-berry text-foam" : "bg-cream text-espresso hover:bg-sand"
                }`}
              >
                {mins} min
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6">
          <Wheel label="Hours" unit="hours" value={hours} count={MAX_HOURS + 1} onChange={setHours} />
          <Wheel label="Minutes" unit="minutes" value={minutes} count={60} onChange={setMinutes} />
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-5">
          <button type="button" onClick={onCancel} className="pixel-btn pixel-btn-ghost px-2! text-xs! md:px-6! md:text-base!">
            Cancel
          </button>
          <button type="button" onClick={handleConfirm} className="pixel-btn px-2! text-xs! md:px-6! md:text-base!">
            Confirm
          </button>
        </div>

        <SleepingCat className="hidden md:-top-[120px] md:-right-[26px] md:block md:h-[198px] md:w-[259px]" />
      </section>
    </Overlay>
  );
}

export default TimePicker;
