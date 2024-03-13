import { type UnoCard } from "shared/structs/cards/games/uno";
import type { GoFishCard } from "shared/structs/cards/games/go-fish";
import Game from "shared/structs/game";

export default interface GameToCard {
  [Game.Uno]: UnoCard;
  [Game.GoFish]: GoFishCard;
}
