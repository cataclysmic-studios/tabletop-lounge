import type { UnoCard } from "./games/uno";
import type { GoFishCard } from "./games/go-fish";

type CardType =
  | UnoCard
  | GoFishCard;

export default CardType;