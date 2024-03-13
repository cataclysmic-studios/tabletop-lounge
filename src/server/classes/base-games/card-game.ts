import { Workspace as World } from "@rbxts/services";
import { TweenInfoBuilder } from "@rbxts/builders";
import Signal from "@rbxts/signal";

import { Events, Functions } from "server/network";
import { Exception } from "shared/exceptions";
import { getCardModel, getCardObject } from "shared/utilities/game";
import { shuffle, slice } from "shared/utilities/helpers";
import { tween } from "shared/utilities/ui";
import BaseGame from "./base-game";
import type CardType from "shared/structs/cards/card-type";
import type GameType from "shared/structs/game-types";
import type GameToCard from "shared/structs/cards/game-to-card";

import type { ServerBaseGameTable } from "server/base-components/base-game-table";
import Object from "@rbxts/object-utils";

export default abstract class CardGame<G extends GameType.CardGame> extends BaseGame {
  private readonly cardsStorage = World.GameProps.Cards.FindFirstChild(this._table.attributes.Game)!;
  private readonly hands: Record<number, GameToCard[G][]> = {};

  protected readonly cardPlayed = new Signal<(card: GameToCard[G]) => void>;
  protected readonly cardDrew = new Signal<(card: GameToCard[G]) => void>;
  protected deck: BasePart[] = [];
  protected lastCardPlayed?: BasePart;

  /** Offset of the pile of cards you set played cards on */
  protected readonly abstract playedPileOffset: Vector3;
  /** Offset of the pile of cards you draw from */
  protected readonly abstract drawPileOffset: Vector3;
  /** How many cards are in each players hand to begin with */
  protected readonly abstract handSize: number;


  public constructor(gameTable: ServerBaseGameTable) {
    super(gameTable);
  }

  protected abstract canPlayCard(player: Player, card: CardType): boolean;
  protected abstract createDeck(): void;

  public override start(): void {
    this.createDeck();
    this.shuffleDeck();
    this.createHands()
    this.addDeckToTable();

    Functions.games.cards.canPlayCard.setCallback((player, tableID, card): boolean => {
      if (tableID !== this._table.id)
        throw new Exception("CheckedIfInvalidCardIsPlayable", `${player.Name} caused the server to check if card from table ${tableID} is playable on table ${this._table.id}`);

      return this.canPlayCard(player, card);
    });
    this.janitor.Add(Events.games.cards.draw.connect((player, tableID) => {
      if (tableID !== this._table.id) return;
      this.drawCard(player);
    }));
    this.janitor.Add(Events.games.cards.play.connect((player, tableID, card, cframe) => {
      if (tableID !== this._table.id) return;
      if (card.game !== this._table.attributes.Game)
        throw new Exception("PlayedInvalidCard", `${player.Name} tried to play a(n) ${card.game} card in ${this._table.attributes.Game}`);

      this.removeCardFromHand(player, <GameToCard[G]>card);
      this.playCard(<GameToCard[G]>card, cframe);
    }));
  }

  protected createHands(): void {
    for (const player of this._table.getSatPlayers()) {
      const cardsFromDeck = slice(this.deck, -this.handSize);
      const hand = cardsFromDeck.map(cardModel => getCardObject<G>(<G>this._table.attributes.Game, cardModel))
      this.hands[player.UserId] = hand;

      Events.games.cards.addHand(player, this._table.id, hand);
      for (const card of cardsFromDeck) {
        this.deck.remove(this.deck.indexOf(card));
        card.Destroy();
      }
    }
  }

  protected addDeckToTable(): void {
    let lastCard: Maybe<BasePart>;
    for (const card of this.deck) {
      const basePosition = lastCard === undefined ?
        this.getCardTablePosition(card)
        : lastCard.Position.add(new Vector3(0, card.Size.X, 0)).sub(this.drawPileOffset);

      const position = basePosition.add(this.drawPileOffset);
      card.CFrame = CFrame.lookAlong(position, this.tableTop.CFrame.LookVector);
      card.Orientation = card.Orientation.add(this.tableTop.Orientation).sub(new Vector3(0, 0, 90))
      card.Parent = World.GameProps.Cards.Uno.Table;
      lastCard = card;
    }
  }

  protected drawCard(player: Player): void {
    const cardModel = this.deck.pop()!;
    const card = getCardObject<G>(<G>this._table.attributes.Game, cardModel);
    Events.games.cards.draw(player, this._table.id, card);
    this.addCardToHand(player, card);
    this.cardDrew.Fire(card);
  }

  protected playCard(card: GameToCard[G], cframe: CFrame): void {
    const cardModel = getCardModel(card).Clone();
    cardModel.CFrame = cframe;
    cardModel.Parent = this.cardsStorage.FindFirstChild("Table")?.FindFirstChild("Played");

    const basePosition = this.lastCardPlayed === undefined ?
      this.getCardTablePosition(cardModel)
      : this.lastCardPlayed.Position.add(new Vector3(0, cardModel.Size.X, 0)).sub(this.playedPileOffset);

    tween(cardModel, new TweenInfoBuilder().SetTime(0.35), {
      Position: basePosition.add(this.playedPileOffset),
      Orientation: cardModel.Orientation.add(this.tableTop.Orientation).add(new Vector3(0, 90, 0))
    });

    this.lastCardPlayed = cardModel;
    this.cardPlayed.Fire(card);
  }

  protected addToDeck(card: BasePart, times: number): void {
    for (let i = 0; i < times; i++) {
      const clone = this.janitor.Add(card.Clone());
      if (card.Parent?.Name !== "Cards")
        clone.SetAttribute("Suit", card.Parent!.Name);

      this.deck.push(clone);
    }
  }

  protected getLastCardObject(): GameToCard[G] {
    return getCardObject<G>(<G>this._table.attributes.Game, this.lastCardPlayed!);
  }

  protected getHand(player: Player): GameToCard[G][] {
    return this.hands[player.UserId];
  }

  private shuffleDeck(): void {
    this.deck = shuffle(this.deck);
  }

  private getCardTablePosition(card: BasePart): Vector3 {
    return this.tableTop.Position
      .add(new Vector3(0, this.tableTop.Size.Y / 2 + card.Size.X / 2, 0));
  }

  private removeCardFromHand(player: Player, card: GameToCard[G]): void {
    const hand = this.getHand(player);
    const filtered = hand.filter(other => !this.cardEquals(card, other));
    this.hands[player.UserId] = filtered;
  }

  private addCardToHand(player: Player, card: GameToCard[G]): void {
    const hand = this.getHand(player);
    hand.push(card);
    this.hands[player.UserId] = hand;
  }

  private cardEquals(a: GameToCard[G], b: GameToCard[G]): boolean {
    return Object.entries(a).every(entry => {
      const [key, value] = <[keyof GameToCard[G], GameToCard[G][keyof GameToCard[G]]]>entry;
      return b[key] === value;
    });
  }
}