import type { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { Workspace as World } from "@rbxts/services";
import { TweenInfoBuilder } from "@rbxts/builders";

import { Events, Functions } from "client/network";
import { Player } from "shared/utilities/client";
import { getCardModel } from "shared/utilities/game";
import { tween } from "shared/utilities/ui";
import Log from "shared/logger";

import type { LogStart } from "shared/hooks";
import type GameType from "shared/structs/game-types";
import type CardType from "shared/structs/cards/card-type";

import { ClientBaseGameTable } from "client/base-components/base-game-table";

const { pi, sin, cos, floor } = math;

const SELECTION_BOX_TRANS = 0.5;
const CARD_HAND_WIDTH = 4;
const CARD_DISTANCE = 2.25;
const CARD_HOVER_OFFSET = 0.65;
const CARD_HOVER_INFO = new TweenInfoBuilder()
  .SetTime(0.25);

function arrayToEvenField(array: defined[]): number[] {
  const middleIndex = floor(array.size() / 2);
  return array.map((_, i) => i - middleIndex <= 0 ? -middleIndex + i : middleIndex - (array.size() - 1 - i));
}

@Component({ tag: "CardGameTable" })
export class CardGameTable extends ClientBaseGameTable<{ Game: GameType.CardGame }> implements OnStart, LogStart {
  private lastHand: CardType[] = [];

  public onStart(): void {
    super.onStart();

    this.janitor.Add(Events.games.cards.addHand.connect((tableID, hand) => {
      if (this.getID() !== tableID) return;
      this.addCardHand(hand);
    }));
    this.janitor.Add(Events.games.cards.draw.connect((tableID, card) => {
      if (this.getID() !== tableID) return;
      this.updateHand(() => this.lastHand.push(card));
    }));
  }

  private playCard(card: CardType, cardModel: BasePart) {
    Log.info("Chose card:", card);
    const cframe = cardModel.CFrame;
    cardModel.Destroy();
    Events.games.advanceTurn(this.getID()); // TODO: if necessary, narrow down to only call this if the game is turn based
    Events.games.cards.play(this.getID(), card, cframe);
    this.updateHand(() => this.lastHand.remove(this.lastHand.indexOf(card)));
  }

  private updateHand(modifyHand: () => void): void {
    World.GameProps.Cards.Uno.Hand.ClearAllChildren();
    modifyHand();
    this.addCardHand(this.lastHand);
  }

  private addCardHand(hand: CardType[]): void {
    const seat = this.getSeats().find(seat => this.getSeatOccupantPlayer(seat) === Player)!;
    const radius = CARD_HAND_WIDTH / 2;
    const angleIncrement = pi / hand.size();

    const handPosition = new Vector3(seat.Position.X, this.instance.Table.Top.Position.Y, seat.Position.Z)
      .add(seat.CFrame.LookVector.mul(CARD_DISTANCE));
    const handCFrame = new CFrame(handPosition)
      .mul(this.instance.Table.Top.CFrame.Rotation)
      .mul(CFrame.Angles(0, 0, math.rad(180)));

    for (const card of hand) {
      const cardModel = getCardModel(card).Clone();
      const i = hand.indexOf(card);
      const angle = angleIncrement * (i + 0.5);
      const cframe = handCFrame
        .add(seat.CFrame.LookVector.mul(radius / 12 * sin(angle)))
        .add(this.instance.Table.Top.CFrame.LookVector.mul((radius / 4 * math.abs(arrayToEvenField(hand)[i] / (hand.size() ** 0.02))) * cos(angle)))
        .add(this.instance.Table.Top.CFrame.UpVector.mul((this.instance.Table.Top.Size.Y / 2) + ((hand.size() - i) * cardModel.Size.X)));

      cardModel.CFrame = cframe;
      cardModel.Orientation = cardModel.Orientation.add(this.instance.Table.Top.Orientation).add(new Vector3(0, -90, -90));
      cardModel.Parent = World.GameProps.Cards.Uno.Hand;
      this.addCardInteraction(card, cardModel, cframe);
    }
    this.lastHand = hand;
  }

  private addCardInteraction(card: CardType, cardModel: BasePart, cframe: CFrame): void {
    const clickDetector = new Instance("ClickDetector", cardModel);
    const selectionBox = this.createSelectionBox(cardModel);

    clickDetector.MouseClick.Connect(async () => {
      if (!await Functions.games.cards.canPlayCard(this.getID(), card)) return;
      this.playCard(card, cardModel);
    });
    clickDetector.MouseHoverEnter.Connect(() => {
      tween(selectionBox, CARD_HOVER_INFO, { Transparency: SELECTION_BOX_TRANS });
      tween(cardModel, CARD_HOVER_INFO, { Position: cframe.Position.add(cardModel.CFrame.RightVector.mul(CARD_HOVER_OFFSET)) });
    });
    clickDetector.MouseHoverLeave.Connect(() => {
      tween(selectionBox, CARD_HOVER_INFO, { Transparency: 1 });
      tween(cardModel, CARD_HOVER_INFO, { Position: cframe.Position });
    });
  }

  private createSelectionBox(cardModel: BasePart): SelectionBox {
    const selectionBox = new Instance("SelectionBox", cardModel);
    selectionBox.LineThickness = 0.01;
    selectionBox.Transparency = 1;
    selectionBox.Color3 = Color3.fromRGB(252, 255, 105);
    selectionBox.Adornee = cardModel;
    return selectionBox;
  }
}