import { Workspace as World } from "@rbxts/services";

import { Events } from "server/network";
import { Assets, shuffle, slice } from "shared/utilities/helpers";
import { UnoCard, UnoSuit } from "shared/structs/uno";
import Game from "shared/structs/game";
import BaseGame from "./base-game";
import Log from "shared/logger";

const HAND_SIZE = 7;
const COLORED_CARDS = 2;
const WILDCARDS = 4;
const DRAW_FOUR_CARDS = 4;

export default class Uno extends BaseGame {
  private deck: UnionOperation[] = [];
  private turnIndex = 0;
  private readonly hands: Record<number, UnionOperation[]> = {}

  protected start(): void {
    this.createDeck();
    this.createHands()
    this.addDeckToTable();
    this.turnChanged();

    Events.gameTable.advanceTurn.connect((_, tableID) => {
      if (tableID !== this.gameTable.id) return;
      this.turnIndex += 1;
      this.turnIndex %= this.gameTable.getSatPlayers().size();
      this.turnChanged();
    });
  }

  private turnChanged(): void {
    const turn = this.gameTable.getSatPlayers()[this.turnIndex];
    Events.gameTable.turnChanged.broadcast(this.gameTable.id, turn);
    Log.info(`It is now ${turn.Name}'s turn`);
  }

  private addDeckToTable(): void {
    let lastCard: Maybe<UnionOperation>;
    for (const card of this.deck) {
      const position = lastCard === undefined ?
        this.tableTop.Position.add(new Vector3(0, this.tableTop.Size.Y / 2 + card.Size.X / 2, 0))
        : lastCard.Position.add(new Vector3(0, card.Size.X, 0));

      card.CFrame = CFrame.lookAlong(position, this.tableTop.CFrame.LookVector);
      card.Orientation = card.Orientation.add(this.tableTop.Orientation).sub(new Vector3(0, 0, 90))
      card.Parent = World.GameProps.Cards.Uno.Table;
      lastCard = card;
    }
  }

  private createHands(): void {
    for (const player of this.gameTable.getSatPlayers()) {
      const hand = slice(this.deck, -HAND_SIZE);
      this.hands[player.UserId] = hand;
      Events.gameTable.addCardHand(player, this.gameTable.id, hand.map(card => this.toCardObject(card)), Game.Uno);
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

  private toCardObject(cardModel: UnionOperation): UnoCard {
    const suitKey = <Maybe<keyof typeof UnoSuit>>cardModel.GetAttribute("Suit");
    const suit = suitKey === undefined ? UnoSuit.None : UnoSuit[suitKey];
    return {
      name: cardModel.Name, suit
    };
  }

  private getHand(player: Player): UnionOperation[] {
    return this.hands[player.UserId];
  }

  private copy(card: UnionOperation, times: number): void {
    for (let i = 0; i < times; i++) {
      const clone = card.Clone();
      if (card.Parent?.Name !== "Cards")
        clone.SetAttribute("Suit", card.Parent!.Name);

      this.deck.push(clone);
    }
  }
}