import BaseCard from "../base-card";
import type Game from "../../game";

export enum UnoSuit {
  Red = "Red",
  Green = "Green",
  Yellow = "Yellow",
  Blue = "Blue",
  Wild = "Wild"
}

export interface UnoCard extends BaseCard {
  suit: UnoSuit;
  game: Game.Uno;
}