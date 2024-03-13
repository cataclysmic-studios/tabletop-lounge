import type GameTypes from "../game-types";

export default interface BaseCard {
  name: string;
  game: GameTypes.CardGame;
}