import { Assets, isNaN } from "shared/utilities/helpers";
import { getCardObject, getGameInfo } from "shared/utilities/game";
import { UnoCard, UnoSuit } from "shared/structs/cards/games/uno";
import CardGame from "../base-games/card-game";
import Game from "shared/structs/game";
import Turns from "../turns";
import type CardType from "shared/structs/cards/card-type";

const COLORED_CARDS = 2;
const WILDCARDS = 4;
const DRAW_FOUR_CARDS = 4;
const CARD_PILE_DISTANCE = 1; // distance between the pile of cards to draw and cards already played
const STACKING_ALLOWED = false; // standard uno

export default class Uno extends CardGame<Game.Uno> {
  public static readonly name = Game.Uno;
  protected readonly playedPileOffset = this.tableTop.CFrame.LookVector.mul(-CARD_PILE_DISTANCE);
  protected readonly drawPileOffset = this.tableTop.CFrame.LookVector.mul(CARD_PILE_DISTANCE);
  protected readonly handSize = 7;
  private readonly turns = new Turns(this);

  public start(): void {
    super.start();
    this.turns.start();
    task.delay(0.5, () => this.placeFirstCard());
  }

  protected canPlayCard(player: Player, card: UnoCard): boolean {
    const lastCard = this.getLastCardObject();
    let canPlayCard = this.isTurn(player, card.game);
    if (this.isNumberCard(lastCard) && this.isNumberCard(card))
      canPlayCard &&= lastCard.name === card.name;
    else {
      const lastCardWasDrawCard = lastCard.name === "DrawFour" || lastCard.name === "DrawTwo";
      const attemptingToStack = (lastCard.name === "DrawFour" && card.name === "DrawFour") || (lastCard.name === "DrawTwo" && card.name === "DrawTwo");
      if (lastCardWasDrawCard)
        canPlayCard &&= attemptingToStack && STACKING_ALLOWED;
      else
        canPlayCard &&= lastCard.suit === UnoSuit.Wild ? true : lastCard.name === card.name;
    }

    // if it's a card without a suit, e.x. wildcard, you can play any card on it
    return canPlayCard;
  }

  protected createDeck(): void {
    const cards = Assets.Games.Uno.Cards;
    const suitedCards = [cards.Red, cards.Green, cards.Yellow, cards.Blue].map(suit => <Part[]>suit.GetChildren());
    for (const suited of suitedCards)
      for (const card of suited)
        this.addToDeck(card, COLORED_CARDS);

    this.addToDeck(cards.Wildcard, WILDCARDS);
    this.addToDeck(cards.DrawFour, DRAW_FOUR_CARDS);
  }

  private placeFirstCard(): void {
    const cardModel = this.deck.pop()!;
    const card = getCardObject(Game.Uno, cardModel);
    this.playCard(card, cardModel.CFrame.mul(CFrame.Angles(0, 0, math.rad(90))));
  }

  private isTurn(player: Player, _game: Game): boolean {
    const { turnBased } = getGameInfo(_game);
    return turnBased && this.turns.is(player);
  }

  private isNumberCard(card: CardType): boolean {
    const n = tonumber(card.name);
    return n !== undefined && !isNaN(n);
  }
}
