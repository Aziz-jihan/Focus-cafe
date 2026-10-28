import { useState } from "react";
import Overlay from "./Overlay";
import { ChevronDownIcon, ChevronUpIcon } from "./PixelIcons";
import SleepingCat from "./SleepingCat";

interface TimePickerProps {
  totalSeconds: number;
  onCancel: () => void;
  onConfirm: (seconds: number) => void;
}

const PRESETS = [15, 25, 50, 90];

const ROW_STYLES = [
  "text-xs opacity-45 md:text-sm",
  "text-base opacity-75 md:text-lg",
  "my-1 h-[60px]! bg-cream text-2xl shadow-[inset_0_0_0_4px_#813D3C] md:my-1.5 md:h-[72px]! md:text-[30px]",
];

interface WheelProps {
  label: string;
  unit: string;
  value: number;
  modulo: number;
  onChange: (value: number) => void;
}

// Five-row scroll wheel: the selected value sits in the highlighted middle row
function Wheel({ label, unit, value, modulo, onChange }: WheelProps) {
  const wrap = (n: number) => (n + modulo) % modulo;

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
      <div className="flex w-full flex-col items-stretch">
        {[-2, -1, 0, 1, 2].map((offset) => {
          const v = wrap(value + offset);
          return (
            <button
              key={offset}
              type="button"
              onClick={() => onChange(v)}
              aria-label={`${v} ${unit}`}
              aria-pressed={offset === 0}
              className={`picker-row ${ROW_STYLES[2 - Math.abs(offset)]}`}
            >
              {String(v).padStart(2, "0")}
            </button>
          );
        })}
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
  const [hours, setHours] = useState(Math.floor(totalSeconds / 3600));
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
          <Wheel label="Hours" unit="hours" value={hours} modulo={13} onChange={setHours} />
          <Wheel label="Minutes" unit="minutes" value={minutes} modulo={60} onChange={setMinutes} />
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
