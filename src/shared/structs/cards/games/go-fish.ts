import BaseCard from "../base-card";
import type Game from "../../game";

export interface GoFishCard extends BaseCard {
  game: Game.GoFish;
}