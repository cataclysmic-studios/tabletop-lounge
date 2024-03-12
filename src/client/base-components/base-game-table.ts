import { Dependency } from "@flamework/core";
import type { Components } from "@flamework/components";

import { Events } from "client/network";
import { Character, Player } from "shared/utilities/client";
import { BaseGameTable } from "shared/base-components/base-game-table";
import type { GameCamera } from "client/components/game-camera";

export class ClientBaseGameTable<A extends {} = {}, I extends GameTableModel = GameTableModel> extends BaseGameTable<A, I> {
  protected readonly gameCameras: Record<string, GameCamera> = {};

  public onStart(): void {
    super.onStart();
    this.createGameCameras();

    this.janitor.Add(Events.games.ejectOccupant.connect(tableID => {
      if (this.getID() !== tableID) return;
      const humanoid = Character.FindFirstChildOfClass("Humanoid")!;
      humanoid.JumpPower = 50;
      humanoid.Jump = true;
    }));
    this.janitor.Add(Events.games.toggleCamera.connect((tableID, on) => {
      if (this.getID() !== tableID) return;
      this.toggleCamera(on);
    }));
  }

  protected seatOccupied(seat: Seat): void {
    const humanoid = Character.FindFirstChildOfClass("Humanoid")!;
    humanoid.JumpPower = 0;
  }

  protected seatLeft(seat: Seat): void {

  }

  protected getGameCamera(seat: Seat): GameCamera {
    return this.gameCameras[this.geatSeatID(seat)];
  }

  private toggleCamera(on: boolean): void {
    const seat = this.getSeats().find(seat => this.getSeatOccupantPlayer(seat) === Player);
    if (!seat) return;
    this.getGameCamera(seat).toggle(on);
  }

  private createGameCameras(): void {
    const components = Dependency<Components>();
    for (const seat of this.getSeats())
      this.gameCameras[this.geatSeatID(seat)] = this.janitor.Add(components.addComponent<GameCamera>(new Instance("Camera", seat)), "destroy");
  }
}