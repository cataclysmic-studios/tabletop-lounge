import { CardGame } from "./game-types";

export default interface BaseCard {
  name: string;
  game: CardGame;
}