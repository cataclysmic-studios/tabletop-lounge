import { type UnoCard } from "shared/structs/uno";
import type { GoFishCard } from "shared/structs/go-fish";
import Game from "shared/structs/game";

export default interface GameToCardType {
  [Game.Uno]: UnoCard;
  [Game.GoFish]: GoFishCard;
}
