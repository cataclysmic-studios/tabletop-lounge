import type { OnStart } from "@flamework/core";
import { Component, type Components } from "@flamework/components";

import { Events } from "client/network";
import { Character, Player } from "shared/utilities/client";
import { BaseGameTable } from "shared/base-components/base-game-table";
import Log from "shared/logger";

import type { GameCamera } from "./game-camera";

@Component({ tag: "GameTable" })
export class GameTable extends BaseGameTable implements OnStart {
  protected readonly gameCameras: Record<string, GameCamera> = {};

  public constructor(
    private readonly components: Components
  ) { super(); }

  public onStart(): void {
    super.onStart();

    this.janitor.Add(Events.game.ejectSeatOccupant.connect(tableID => {
      if (this.getID() !== tableID) return;
      const humanoid = Character.FindFirstChildOfClass("Humanoid")!;
      humanoid.JumpPower = 50;
      humanoid.Jump = true;
    }));
    this.janitor.Add(Events.game.toggleCamera.connect((tableID, on) => {
      if (this.getID() !== tableID) return;

      const seat = this.getSeats().find(seat => this.getSeatOccupantPlayer(seat) === Player);
      if (!seat) return;
      this.getGameCamera(seat).toggle(on);
    }));

    for (const seat of this.getSeats())
      this.gameCameras[this.geatSeatID(seat)] = this.janitor.Add(this.components.addComponent<GameCamera>(new Instance("Camera", seat)), "destroy");

    Log.client_component("GameTable", this);
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