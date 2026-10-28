import bananaLatte from "../assets/banana-latte.webp";
import blackCoffee from "../assets/black-coffee.webp";
import blueberryLatte from "../assets/blueberry-latte.webp";
import bobaTea from "../assets/boba-tea.webp";
import chocolateCake from "../assets/chocolate-cake.webp";
import croissant from "../assets/croissant.webp";
import custardPudding from "../assets/custard-pudding.webp";
import eggToast from "../assets/egg-toast.webp";
import espresso from "../assets/espresso.webp";
import hotChocolate from "../assets/hot-chocolate.webp";
import icedLatte from "../assets/iced-latte.webp";
import lemonTea from "../assets/lemon-tea.webp";
import matcha from "../assets/matcha.webp";
import matchaLatte from "../assets/matcha-latte.webp";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  img: string;
}

// Free house drink: always owned, served when nothing else is picked
export const DEFAULT_ITEM_ID = "cocoa";

export const MENU_ITEMS: MenuItem[] = [
  { id: "cocoa", name: "Hot Chocolate", price: 0, img: hotChocolate },
  { id: "croissant", name: "Croissant", price: 100, img: croissant },
  { id: "espresso", name: "Espresso", price: 80, img: espresso },
  { id: "eggtoast", name: "Egg Toast", price: 150, img: eggToast },
  { id: "icedlatte", name: "Iced Latte", price: 110, img: icedLatte },
  { id: "matcha", name: "Matcha", price: 130, img: matcha },
  { id: "cake", name: "Chocolate Cake", price: 180, img: chocolateCake },
  { id: "boba", name: "Boba Tea", price: 140, img: bobaTea },
  { id: "blackcoffee", name: "Black Coffee", price: 60, img: blackCoffee },
  { id: "lemontea", name: "Lemon Tea", price: 90, img: lemonTea },
  { id: "bananalatte", name: "Banana Latte", price: 120, img: bananaLatte },
  { id: "blueberrylatte", name: "Blueberry Latte", price: 130, img: blueberryLatte },
  { id: "matchalatte", name: "Matcha Latte", price: 140, img: matchaLatte },
  { id: "pudding", name: "Custard Pudding", price: 160, img: custardPudding },
];

export function isOwned(id: string, owned: Record<string, number>): boolean {
  return id === DEFAULT_ITEM_ID || (owned[id] ?? 0) > 0;
}
