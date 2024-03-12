import type { UnoCard } from "./uno";
import type { GoFishCard } from "./go-fish";

type CardType =
  | UnoCard
  | GoFishCard;

export default CardType;