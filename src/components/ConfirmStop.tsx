import Overlay from "./Overlay";

interface ConfirmStopProps {
  timeLeft: string;
  onKeepGoing: () => void;
  onStop: () => void;
}

// Asks before giving up a session, since stopping early earns nothing
function ConfirmStop({ timeLeft, onKeepGoing, onStop }: ConfirmStopProps) {
  return (
    <Overlay onClose={onKeepGoing}>
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="stop-title"
        aria-describedby="stop-desc"
        className="pixel-panel flex w-full flex-col items-center gap-5 px-6 py-7 text-center md:max-w-[480px] md:gap-6 md:px-10 md:py-9"
      >
        <h2 id="stop-title" className="m-0 font-pixel text-base font-normal [text-shadow:3px_3px_0_#AF8360] md:text-xl">
          Leave the cafe?
        </h2>
        <p id="stop-desc" className="m-0 text-lg text-berry md:text-xl">
          {timeLeft} left on the clock. Stop now and the cat wakes up with no coins for you.
        </p>
        <div className="grid w-full grid-cols-2 gap-4 md:gap-5">
          <button type="button" onClick={onStop} className="pixel-btn pixel-btn-ghost px-2! text-xs! md:text-sm!">
            Stop
          </button>
          <button type="button" onClick={onKeepGoing} autoFocus className="pixel-btn px-2! text-xs! md:text-sm!">
            Keep going
          </button>
        </div>
      </section>
    </Overlay>
  );
}

export default ConfirmStop;
