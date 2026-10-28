import { useEffect, useState } from "react";
import coin from "../assets/coin.webp";
import { isOwned, MENU_ITEMS, type MenuItem } from "../data/menu";
import Overlay from "./Overlay";
import { CloseIcon } from "./PixelIcons";

interface MenuDialogProps {
  coins: number;
  owned: Record<string, number>;
  treatId: string;
  onBuy: (item: MenuItem) => void;
  onSelect: (item: MenuItem) => void;
  onClose: () => void;
}

function MenuDialog({ coins, owned, treatId, onBuy, onSelect, onClose }: MenuDialogProps) {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleBuy = (item: MenuItem) => {
    onBuy(item);
    setToast(`${item.name} is yours! Tap Select to serve it.`);
  };

  const handleSelect = (item: MenuItem) => {
    if (item.id === treatId) return;
    onSelect(item);
    setToast(`${item.name} will be on your table.`);
  };

  return (
    <Overlay onClose={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-title"
        className="relative flex h-[640px] max-h-full w-full max-w-[350px] flex-col gap-3 bg-(image:--paper) bg-size-[100%_100%] bg-no-repeat px-10 pt-16 pb-[66px] drop-shadow-[8px_12px_0_rgba(30,26,24,0.55)] md:h-[836px] md:max-w-[552px] md:gap-4 md:px-[68px] md:pt-[92px] md:pb-[100px] md:drop-shadow-[10px_14px_0_rgba(30,26,24,0.55)]"
      >
        <div className="flex items-center justify-between gap-2 md:gap-3">
          <div
            role="img"
            aria-label={`${coins} coins`}
            className="flex items-center gap-1.5 bg-espresso py-1 pr-2.5 pl-1 md:min-w-[88px] md:gap-2 md:bg-transparent md:p-0"
          >
            <img src={coin} alt="" className="pixelated size-[22px] md:size-7" />
            <span className="font-pixel text-xs text-latte md:text-sm md:text-espresso">{coins}</span>
          </div>
          <h2 id="menu-title" className="m-0 font-pixel text-lg font-normal md:text-2xl">
            Menu
          </h2>
          <div className="flex min-w-16 justify-end md:min-w-[88px]">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="inline-flex size-11 cursor-pointer items-center justify-center text-espresso hover:text-berry focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-espresso"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <p className="m-0 text-center text-[15px] text-berry md:hidden">Spend the coins you brew while focusing.</p>

        <div className="menu-scroll mt-1 min-h-0 flex-1 pr-1.5 md:mt-2 md:pr-2">
          <div className="grid grid-cols-2 gap-x-3.5 gap-y-6 md:gap-x-5 md:gap-y-8">
            {MENU_ITEMS.map((item) => {
              const have = isOwned(item.id, owned);
              const selected = item.id === treatId;
              const canAfford = coins >= item.price;
              const status = selected
                ? "On your table"
                : item.price === 0
                  ? "Free house drink"
                  : have
                    ? "Owned"
                    : canAfford
                      ? "Ready to order"
                      : `Need ${item.price - coins} more`;

              return (
                <article
                  key={item.id}
                  className="grid grid-rows-[80px_40px_16px_44px] items-center justify-items-center gap-y-1.5 text-center md:flex md:flex-col md:gap-2"
                >
                  <div className="flex h-20 w-full items-center justify-center md:h-[108px]">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="pixelated max-h-[74px] max-w-[92px] md:max-h-[100px] md:max-w-[120px]"
                    />
                  </div>
                  <h3 className="m-0 text-[17px] leading-[1.1] font-semibold md:text-[22px]">{item.name}</h3>
                  <span className="text-[13px] leading-4 whitespace-nowrap text-berry md:min-h-[18px] md:text-[15px]">
                    {status}
                  </span>
                  {have ? (
                    <button
                      type="button"
                      onClick={() => handleSelect(item)}
                      aria-pressed={selected}
                      aria-label={selected ? `${item.name} is on your table` : `Put ${item.name} on your table`}
                      className={`buy-btn ${selected ? "bg-espresso! text-latte!" : "bg-sand! text-espresso! hover:bg-[#e0c29c]!"}`}
                    >
                      {selected ? "On table" : "Select"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford}
                      aria-label={`Buy ${item.name} for ${item.price} coins`}
                      className="buy-btn"
                    >
                      <img src={coin} alt="" className="pixelated size-[18px] md:size-5" />
                      {item.price}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        <div aria-live="polite" className="absolute inset-x-6 bottom-6 flex justify-center md:inset-x-12 md:bottom-10">
          {toast && (
            <p className="pixel-border m-0 bg-espresso px-4 py-2.5 text-center text-[15px] text-latte md:text-lg">
              {toast}
            </p>
          )}
        </div>
      </section>
    </Overlay>
  );
}

export default MenuDialog;
