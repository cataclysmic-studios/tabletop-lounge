import { Workspace as World } from "@rbxts/services";
import { TweenInfoBuilder } from "@rbxts/builders";

import { Events } from "server/network";
import { Exception } from "shared/exceptions";
import { shuffle, slice } from "shared/utilities/helpers";
import { getCardModel, getCardObject } from "shared/utilities/game";
import { tween } from "shared/utilities/ui";
import BaseGame from "./base-game";
import type CardType from "shared/structs/card-type";

import type { ServerBaseGameTable } from "server/base-components/base-game-table";
import Turns from "../turns";

export default abstract class CardGame extends BaseGame {
  private readonly cardsStorage = World.GameProps.Cards.FindFirstChild(this._table.attributes.Game)!;
  private readonly hands: Record<number, BasePart[]> = {};
  private deck: BasePart[] = [];
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

  public override start(): void {
    this.createDeck();
    this.shuffleDeck();
    this.createHands()
    this.addDeckToTable();

    this.janitor.Add(Events.games.cards.play.connect((player, tableID, card, cframe) => {
      if (tableID !== this._table.id) return;
      if (card.game !== this._table.attributes.Game)
        throw new Exception("PlayedInvalidCard", `${player.Name} tried to play a(n) ${card.game} card in ${this._table.attributes.Game}`);

      this.playCard(card, cframe, this.playedPileOffset);
    }));
  }

  protected abstract createDeck(): void;

  protected createHands(): void {
    for (const player of this._table.getSatPlayers()) {
      const hand = slice(this.deck, -this.handSize);
      this.hands[player.UserId] = hand;
      Events.games.cards.addHand(player, this._table.id, hand.map(card => getCardObject(this._table.attributes.Game, card)));
      for (const card of hand) {
        this.deck.remove(this.deck.indexOf(card));
        card.Destroy();
      }
    }
  }

  protected addDeckToTable(shift = new Vector3): void {
    let lastCard: Maybe<BasePart>;
    for (const card of this.deck) {
      const basePosition = lastCard === undefined ?
        this.getCardTablePosition(card)
        : lastCard.Position.add(new Vector3(0, card.Size.X, 0)).sub(shift);

      const position = basePosition.add(shift);
      card.CFrame = CFrame.lookAlong(position, this.tableTop.CFrame.LookVector);
      card.Orientation = card.Orientation.add(this.tableTop.Orientation).sub(new Vector3(0, 0, 90))
      card.Parent = World.GameProps.Cards.Uno.Table;
      lastCard = card;
    }
  }

  protected playCard(card: CardType, cframe: CFrame, shift = new Vector3) {
    const cardModel = getCardModel(card).Clone();
    cardModel.CFrame = cframe;
    cardModel.Parent = this.cardsStorage.FindFirstChild("Table")?.FindFirstChild("Played");

    const basePosition = this.lastCardPlayed === undefined ?
      this.getCardTablePosition(cardModel)
      : this.lastCardPlayed.Position.add(new Vector3(0, cardModel.Size.X, 0)).sub(shift);

    tween(cardModel, new TweenInfoBuilder().SetTime(0.35), {
      Position: basePosition.add(shift),
      Orientation: cardModel.Orientation.add(this.tableTop.Orientation)
    });
    this.lastCardPlayed = cardModel;
  }

  protected copy(card: BasePart, times: number): void {
    for (let i = 0; i < times; i++) {
      const clone = this.janitor.Add(card.Clone());
      if (card.Parent?.Name !== "Cards")
        clone.SetAttribute("Suit", card.Parent!.Name);

      this.deck.push(clone);
    }
  }

  protected getHand(player: Player): BasePart[] {
    return this.hands[player.UserId];
  }

  private shuffleDeck(): void {
    this.deck = shuffle(this.deck);
  }

  private getCardTablePosition(card: BasePart): Vector3 {
    return this.tableTop.Position
      .add(new Vector3(0, this.tableTop.Size.Y / 2 + card.Size.X / 2, 0));
  }
}