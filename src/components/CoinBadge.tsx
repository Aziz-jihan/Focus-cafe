import coin from "../assets/coin.webp";

interface CoinBadgeProps {
  coins: number;
}

// Framed coin counter shown in the header and on the focus screen
function CoinBadge({ coins }: CoinBadgeProps) {
  return (
    <div
      role="img"
      aria-label={`${coins} coins`}
      className="pixel-border flex items-center gap-2 bg-latte py-1.5 pr-4 pl-1.5 md:gap-2.5 md:pr-[18px] md:pl-2"
    >
      <img src={coin} alt="" className="pixelated size-7 md:size-8" />
      <span className="font-pixel text-sm md:text-base">{coins}</span>
    </div>
  );
}

export default CoinBadge;
