import { useCallback, useEffect, useState, type CSSProperties } from "react";
import backdropDesktop from "./assets/cafe-backdrop-desktop.webp";
import backdropMobile from "./assets/cafe-backdrop-mobile.webp";
import tableDesktop from "./assets/cafe-table-desktop.webp";
import tableMobile from "./assets/cafe-table-mobile.webp";
import calicoCat from "./assets/calico-cat.webp";
import coin from "./assets/coin.webp";
import menuPaper from "./assets/menu-paper.webp";
import ConfirmStop from "./components/ConfirmStop";
import LoadingScreen from "./components/LoadingScreen";
import FocusScreen from "./components/FocusScreen";
import HomeScreen from "./components/HomeScreen";
import MenuDialog from "./components/MenuDialog";
import SessionComplete from "./components/SessionComplete";
import TimePicker from "./components/TimePicker";
import { DEFAULT_ITEM_ID, isOwned, MENU_ITEMS, type MenuItem } from "./data/menu";
import formatTime from "./utils/formatTime";
import rewardFor from "./utils/reward";
import { playSessionEnd, useButtonClickSound, useCafeAmbience } from "./utils/sound";
import { usePersistentState } from "./utils/usePersistentState";

type Screen = "home" | "focus" | "done";
type Dialog = "picker" | "menu" | "stop" | null;

const DEFAULT_TIME = 25 * 60;

// Image URLs exposed as CSS variables so Tailwind can swap them per breakpoint
const backgrounds = {
  "--backdrop-mobile": `url(${backdropMobile})`,
  "--backdrop-desktop": `url(${backdropDesktop})`,
  "--table-mobile": `url(${tableMobile})`,
  "--table-desktop": `url(${tableDesktop})`,
  "--paper": `url(${menuPaper})`,
} as CSSProperties;

// Everything the first screens paint, fetched behind the loading screen
const PRELOAD = [
  backdropMobile,
  backdropDesktop,
  tableMobile,
  tableDesktop,
  menuPaper,
  calicoCat,
  coin,
  ...MENU_ITEMS.map((item) => item.img),
];

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [dialog, setDialog] = useState<Dialog>(null);
  const [totalSeconds, setTotalSeconds] = usePersistentState("focus-cafe:total", DEFAULT_TIME);
  const [coins, setCoins] = usePersistentState("focus-cafe:coins", 0);
  const [owned, setOwned] = usePersistentState<Record<string, number>>("focus-cafe:owned", {});
  const [treatId, setTreatId] = usePersistentState("focus-cafe:treat", DEFAULT_ITEM_ID);
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [lastEarned, setLastEarned] = useState(0);

  // Fall back to the free drink if the saved pick is unknown or not owned
  const treat =
    MENU_ITEMS.find((item) => item.id === treatId && isOwned(item.id, owned)) ??
    MENU_ITEMS.find((item) => item.id === DEFAULT_ITEM_ID)!;
  const [volume, setVolume] = usePersistentState("focus-cafe:volume", 0.5);
  const [muted, setMuted] = usePersistentState("focus-cafe:muted", false);

  const paused = screen === "focus" && endsAt === null;

  useButtonClickSound();
  useCafeAmbience(screen === "focus" && !paused, muted ? 0 : volume);

  const [loading, setLoading] = useState(true);
  const finishLoading = useCallback(() => setLoading(false), []);

  useEffect(() => {
    if (endsAt === null) return;

    // Derive from a timestamp so throttled background tabs stay accurate
    const tick = () => {
      const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setTimeLeft(left);
      if (left === 0) {
        const reward = rewardFor(totalSeconds);
        playSessionEnd();
        setEndsAt(null);
        setLastEarned(reward);
        setCoins((c) => c + reward);
        setDialog(null);
        setScreen("done");
      }
    };

    tick();
    const timer = setInterval(tick, 250);
    return () => clearInterval(timer);
  }, [endsAt, totalSeconds, setCoins]);

  const handleStart = () => {
    setTimeLeft(totalSeconds);
    setEndsAt(Date.now() + totalSeconds * 1000);
    setDialog(null);
    setScreen("focus");
  };

  const handleTogglePause = () => {
    setEndsAt(paused ? Date.now() + timeLeft * 1000 : null);
  };

  const handleStop = () => {
    setEndsAt(null);
    setTimeLeft(totalSeconds);
    setDialog(null);
    setScreen("home");
  };

  const handleConfirmTime = (seconds: number) => {
    setTotalSeconds(seconds);
    setTimeLeft(seconds);
    setDialog(null);
  };

  const handleBuy = (item: MenuItem) => {
    if (coins < item.price) return;
    setCoins(coins - item.price);
    setOwned({ ...owned, [item.id]: (owned[item.id] ?? 0) + 1 });
  };

  const closeDialog = useCallback(() => setDialog(null), []);
  const goHome = () => setScreen("home");

  const isFocus = screen === "focus";

  return (
    <div
      style={backgrounds}
      className={`relative min-h-dvh overflow-hidden bg-espresso font-body text-espresso ${
        isFocus
          ? ""
          : "pixelated bg-(image:--backdrop-mobile) bg-cover bg-top bg-no-repeat md:bg-(image:--backdrop-desktop) md:bg-[center_45%]"
      }`}
    >
      {screen === "focus" && (
        <FocusScreen
          coins={coins}
          timeLeft={timeLeft}
          totalSeconds={totalSeconds}
          paused={paused}
          treat={treat}
          volume={volume}
          muted={muted}
          onVolumeChange={(v) => {
            setVolume(v);
            setMuted(v === 0);
          }}
          onToggleMute={() => {
            // Unmuting a slider left at zero would stay silent, so bring it back up
            if (muted && volume === 0) setVolume(0.5);
            setMuted(!muted);
          }}
          onTogglePause={handleTogglePause}
          onStop={() => setDialog("stop")}
        />
      )}

      {screen === "home" && (
        <HomeScreen
          coins={coins}
          totalSeconds={totalSeconds}
          catOnPanel={dialog !== "picker"}
          onOpenPicker={() => setDialog("picker")}
          onOpenMenu={() => setDialog("menu")}
          onStart={handleStart}
        />
      )}

      {screen === "done" && (
        <SessionComplete
          earned={lastEarned}
          onFocusAgain={handleStart}
          onHome={goHome}
        />
      )}

      {dialog === "picker" && (
        <TimePicker totalSeconds={totalSeconds} onCancel={closeDialog} onConfirm={handleConfirmTime} />
      )}

      {dialog === "menu" && (
        <MenuDialog
          coins={coins}
          owned={owned}
          treatId={treatId}
          onBuy={handleBuy}
          onSelect={(item) => setTreatId(item.id)}
          onClose={closeDialog}
        />
      )}

      {dialog === "stop" && (
        <ConfirmStop timeLeft={formatTime(timeLeft)} onKeepGoing={closeDialog} onStop={handleStop} />
      )}

      {loading && <LoadingScreen assets={PRELOAD} onDone={finishLoading} />}
    </div>
  );
}

export default App;
