import { useEffect, type ReactNode } from "react";

interface OverlayProps {
  onClose: () => void;
  children: ReactNode;
}

// Dimmed full-screen backdrop that centers a dialog and closes on Escape
function Overlay({ onClose, children }: OverlayProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-espresso/55 p-5 md:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </div>
  );
}

export default Overlay;
