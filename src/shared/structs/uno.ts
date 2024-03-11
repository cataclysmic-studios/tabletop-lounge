export enum UnoSuit {
  Red = "Red",
  Green = "Green",
  Yellow = "Yellow",
  Blue = "Blue",
  None = "None"
}

export interface UnoCard {
  suit: UnoSuit;
  name: string;
}