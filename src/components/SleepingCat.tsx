import calicoCat from "../assets/calico-cat.webp";

interface SleepingCatProps {
  className?: string;
  alt?: string;
}

function SleepingCat({ className = "", alt = "A calico cat napping on top of the timer" }: SleepingCatProps) {
  return <img src={calicoCat} alt={alt} className={`pixelated pointer-events-none absolute ${className}`} />;
}

export default SleepingCat;
