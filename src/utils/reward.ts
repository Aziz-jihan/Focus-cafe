export const COINS_PER_MINUTE = 2;

function rewardFor(seconds: number): number {
  return Math.round(seconds / 60) * COINS_PER_MINUTE;
}

export default rewardFor;
