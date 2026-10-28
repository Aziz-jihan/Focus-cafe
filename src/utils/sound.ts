import { useEffect } from "react";
import cafeAmbience from "../assets/sounds/cafe-ambience.mp3";
import clickSound from "../assets/sounds/click.mp3";
import sessionEndSound from "../assets/sounds/session-end.mp3";

const click = new Audio(clickSound);
click.volume = 0.5;
const sessionEnd = new Audio(sessionEndSound);
const ambience = new Audio(cafeAmbience);
ambience.loop = true;

function play(audio: HTMLAudioElement) {
  audio.currentTime = 0;
  // Browsers may block playback before the first gesture; nothing to do then
  audio.play().catch(() => {});
}

export const playClick = () => play(click);
export const playSessionEnd = () => play(sessionEnd);

// Plays one click for every button press anywhere on the page
export function useButtonClickSound() {
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const button = (e.target as Element | null)?.closest("button");
      if (button && !button.disabled) playClick();
    };
    document.addEventListener("click", handle, true);
    return () => document.removeEventListener("click", handle, true);
  }, []);
}

// Loops the cafe background noise while `playing` is true
export function useCafeAmbience(playing: boolean, volume: number) {
  useEffect(() => {
    ambience.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (playing) ambience.play().catch(() => {});
    else ambience.pause();
  }, [playing]);

  useEffect(() => () => ambience.pause(), []);
}
