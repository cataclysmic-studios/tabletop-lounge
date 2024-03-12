import { Workspace as World } from "@rbxts/services";
import { TweenInfoBuilder } from "@rbxts/builders";

import { Events } from "server/network";
import { Exception } from "shared/exceptions";
import { Assets, shuffle, slice } from "shared/utilities/helpers";
import { getCardModel, getCardObject } from "shared/utilities/game";
import { tween } from "shared/utilities/ui";
import BaseGame from "../base-game";
import Game from "shared/structs/game";
import Log from "shared/logger";
import type CardType from "shared/structs/card-type";

const HAND_SIZE = 7; // how many cards begin in each players hand
const COLORED_CARDS = 2;
const WILDCARDS = 4;
const DRAW_FOUR_CARDS = 4;
const CARD_PILE_DISTANCE = 1; // distance between the pile of cards to draw and cards already played

export default class Uno extends BaseGame {
  public static readonly name = Game.Uno;
  private readonly hands: Record<number, UnionOperation[]> = {}
  private deck: UnionOperation[] = [];
  private turnIndex = 0;
  private lastCardPlayed?: UnionOperation;

  protected start(): void {
    this.createDeck();
    this.createHands()
    this.addDeckToTable();
    this.turnChanged();

    this.janitor.Add(Events.games.advanceTurn.connect((_, tableID) => {
      if (tableID !== this.gameTable.id) return;
      this.turnIndex += 1;
      this.turnIndex %= this.gameTable.getSatPlayers().size();
      this.turnChanged();
    }));
    this.janitor.Add(Events.games.cards.play.connect((player, tableID, card, cframe) => {
      if (tableID !== this.gameTable.id) return;
      if (card.game !== Game.Uno)
        throw new Exception("PlayedInvalidCard", `${player.Name} tried to play a(n) ${card.game} card in Uno`);

      this.playCard(card, cframe);
    }));
  }

  private playCard(card: CardType, cframe: CFrame) {
    const cardModel = getCardModel(card).Clone();
    cardModel.CFrame = cframe;
    cardModel.Parent = World.GameProps.Cards.Uno.Table.Played;

    const shift = this.tableTop.CFrame.LookVector.mul(-CARD_PILE_DISTANCE);
    const basePosition = this.lastCardPlayed === undefined ?
      this.getCardTablePosition(cardModel)
      : this.lastCardPlayed.Position.add(new Vector3(0, cardModel.Size.X, 0)).sub(shift);

    tween(cardModel, new TweenInfoBuilder().SetTime(0.35), {
      Position: basePosition.add(shift),
      Orientation: cardModel.Orientation.add(this.tableTop.Orientation)
    });
    this.lastCardPlayed = cardModel;
  }

  private turnChanged(): void {
    const turn = this.gameTable.getSatPlayers()[this.turnIndex];
    Events.games.turnChanged.broadcast(this.gameTable.id, turn);
    Log.info(`It is now ${turn.Name}'s turn`);
  }

  private addDeckToTable(): void {
    let lastCard: Maybe<UnionOperation>;
    for (const card of this.deck) {
      const shift = this.tableTop.CFrame.LookVector.mul(CARD_PILE_DISTANCE);
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

  private getCardTablePosition(card: UnionOperation) {
    return this.tableTop.Position
      .add(new Vector3(0, this.tableTop.Size.Y / 2 + card.Size.X / 2, 0));
  }

  private createHands(): void {
    for (const player of this.gameTable.getSatPlayers()) {
      const hand = slice(this.deck, -HAND_SIZE);
      this.hands[player.UserId] = hand;
      Events.games.cards.addHand(player, this.gameTable.id, hand.map(card => getCardObject(Game.Uno, card)));
      for (const card of hand) {
        this.deck.remove(this.deck.indexOf(card));
        card.Destroy();
      }
    }
  }

  private createDeck(): void {
    const cards = Assets.Games.Uno.Cards;
    const suits = [cards.Red, cards.Green, cards.Yellow, cards.Blue].map(suit => <UnionOperation[]>suit.GetChildren());
    for (const suit of suits)
      for (const card of suit)
        this.copy(card, COLORED_CARDS);

    this.copy(cards.Wildcard, WILDCARDS);
    this.copy(cards.DrawFour, DRAW_FOUR_CARDS);
    this.deck = shuffle(this.deck);
  }

  private getHand(player: Player): UnionOperation[] {
    return this.hands[player.UserId];
  }

  private copy(card: UnionOperation, times: number): void {
    for (let i = 0; i < times; i++) {
      const clone = this.janitor.Add(card.Clone());
      if (card.Parent?.Name !== "Cards")
        clone.SetAttribute("Suit", card.Parent!.Name);

      this.deck.push(clone);
    }
  }
}