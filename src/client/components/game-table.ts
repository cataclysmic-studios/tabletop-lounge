import type { OnStart } from "@flamework/core";
import { Component, type Components } from "@flamework/components";
import { Workspace as World } from "@rbxts/services";
import { TweenInfoBuilder } from "@rbxts/builders";

import { Events } from "client/network";
import { Character, Player } from "shared/utilities/client";
import { Assets } from "shared/utilities/helpers";
import { tween } from "shared/utilities/ui";
import { BaseGameTable } from "shared/base-components/base-game-table";
import { UnoSuit } from "shared/structs/uno";

import type { LogStart } from "shared/hooks";
import type { GameCamera } from "./game-camera";
import type Game from "shared/structs/game";
import type CardType from "shared/structs/card-type";
import Log from "shared/logger";

const { pi, sin, cos, floor } = math;

const CARD_HAND_WIDTH = 4;
const CARD_DISTANCE = 2.25;
const CARD_HOVER_OFFSET = 0.65;
const CARD_HOVER_INFO = new TweenInfoBuilder()
  .SetTime(0.25);

function arrayToEvenField(array: defined[]): number[] {
  const middleIndex = floor(array.size() / 2);
  return array.map((_, i) => i - middleIndex <= 0 ? -middleIndex + i : middleIndex - (array.size() - 1 - i));
}

@Component({ tag: "GameTable" })
export class GameTable extends BaseGameTable implements OnStart, LogStart {
  protected readonly gameCameras: Record<string, GameCamera> = {};
  private turn?: Player;

  public constructor(
    private readonly components: Components
  ) { super(); }

  public onStart(): void {
    super.onStart();

    this.janitor.Add(Events.gameTable.turnChanged.connect((tableID, turn) => {
      if (this.getID() !== tableID) return;
      this.turn = turn;
    }))
    this.janitor.Add(Events.gameTable.addCardHand.connect((tableID, hand, gameName) => {
      if (this.getID() !== tableID) return;
      this.addCardHand(gameName, hand);
    }));
    this.janitor.Add(Events.gameTable.ejectOccupant.connect(tableID => {
      if (this.getID() !== tableID) return;
      const humanoid = Character.FindFirstChildOfClass("Humanoid")!;
      humanoid.JumpPower = 50;
      humanoid.Jump = true;
    }));
    this.janitor.Add(Events.gameTable.toggleCamera.connect((tableID, on) => {
      if (this.getID() !== tableID) return;

      const seat = this.getSeats().find(seat => this.getSeatOccupantPlayer(seat) === Player);
      if (!seat) return;
      this.getGameCamera(seat).toggle(on);
    }));

    for (const seat of this.getSeats())
      this.gameCameras[this.geatSeatID(seat)] = this.janitor.Add(this.components.addComponent<GameCamera>(new Instance("Camera", seat)), "destroy");
  }

  private addCardHand(gameName: Game, hand: CardType[]) {
    const allCardModels = <Folder>Assets.Games[gameName].FindFirstChild("Cards");
    const seat = this.getSeats().find(seat => this.getSeatOccupantPlayer(seat) === Player)!;
    const handPosition = new Vector3(seat.Position.X, this.instance.Table.Top.Position.Y, seat.Position.Z)
      .add(seat.CFrame.LookVector.mul(CARD_DISTANCE));
    const handCFrame = CFrame.lookAlong(handPosition, seat.CFrame.RightVector);
    const radius = CARD_HAND_WIDTH / 2;
    const angleIncrement = pi / hand.size();

    for (const card of hand) {
      const cardModel = <UnionOperation>(card.suit === UnoSuit.None ? allCardModels.FindFirstChild(card.name) : allCardModels.FindFirstChild(card.suit)?.FindFirstChild(card.name))?.Clone();
      const i = hand.indexOf(card);
      const angle = angleIncrement * (i + 0.5);
      const cframe = handCFrame
        .add(seat.CFrame.LookVector.mul(radius / 12 * sin(angle)))
        .add(new Vector3(
          0,
          (this.instance.Table.Top.Size.Y / 2) + ((hand.size() - i) * cardModel.Size.X),
          (radius / 4 * math.abs(arrayToEvenField(hand)[i] / (hand.size() ** 0.02))) * cos(angle)
        ));

      cardModel.CFrame = cframe;
      cardModel.Orientation = cardModel.Orientation.add(this.instance.Table.Top.Orientation).add(new Vector3(0, 0, 90));
      cardModel.Parent = World.GameProps.Cards.Uno.Hands;

      const clickDetector = new Instance("ClickDetector", cardModel);
      const selectionBox = new Instance("SelectionBox", cardModel);
      const selectionBoxTrans = 0.5;
      selectionBox.LineThickness = 0.01;
      selectionBox.Transparency = 1;
      selectionBox.Color3 = Color3.fromRGB(252, 255, 105);
      selectionBox.Adornee = cardModel;

      clickDetector.MouseClick.Connect(() => {
        if (this.turn !== Player) return;
        Log.info("Chose card");
        Events.gameTable.advanceTurn(this.getID());
        // put card down
        // Events.gameTable.uno.chooseCard()
        // Events.gameTable.uno.drawCard()
      });
      clickDetector.MouseHoverEnter.Connect(() => {
        tween(selectionBox, CARD_HOVER_INFO, { Transparency: selectionBoxTrans });
        tween(cardModel, CARD_HOVER_INFO, { Position: cframe.Position.add(cardModel.CFrame.RightVector.mul(CARD_HOVER_OFFSET)) });
      });
      clickDetector.MouseHoverLeave.Connect(() => {
        tween(selectionBox, CARD_HOVER_INFO, { Transparency: 1 });
        tween(cardModel, CARD_HOVER_INFO, { Position: cframe.Position });
      });
    }
  }

  protected seatOccupied(seat: Seat): void {
    const humanoid = Character.FindFirstChildOfClass("Humanoid")!;
    humanoid.JumpPower = 0;
  }

  protected seatLeft(seat: Seat): void {

  }

  private getGameCamera(seat: Seat): GameCamera {
    return this.gameCameras[this.geatSeatID(seat)];
  }
}