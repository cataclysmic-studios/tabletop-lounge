import { Assets } from "shared/utilities/helpers";
import CardGame from "../base-games/card-game";
import Game from "shared/structs/game";
import Turns from "../turns";

const COLORED_CARDS = 2;
const WILDCARDS = 4;
const DRAW_FOUR_CARDS = 4;
const CARD_PILE_DISTANCE = 1; // distance between the pile of cards to draw and cards already played

export default class Uno extends CardGame {
  public static readonly name = Game.Uno;
  protected readonly playedPileOffset = this.tableTop.CFrame.LookVector.mul(-CARD_PILE_DISTANCE);
  protected readonly drawPileOffset = this.tableTop.CFrame.LookVector.mul(CARD_PILE_DISTANCE);
  protected readonly handSize = 7;
  private readonly turns = new Turns(this);

  public start(): void {
    super.start();
    this.turns.start();
  }

  protected createDeck(): void {
    const cards = Assets.Games.Uno.Cards;
    const suits = [cards.Red, cards.Green, cards.Yellow, cards.Blue].map(suit => <Part[]>suit.GetChildren());
    for (const suit of suits)
      for (const card of suit)
        this.copy(card, COLORED_CARDS);

    this.copy(cards.Wildcard, WILDCARDS);
    this.copy(cards.DrawFour, DRAW_FOUR_CARDS);
  }
}