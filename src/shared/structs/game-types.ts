import type Game from "./game";

namespace GameType {
  export type CardGame =
    | Game.Uno
    | Game.GoFish;
}

export default GameType;