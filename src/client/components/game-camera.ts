import type { OnStart } from "@flamework/core";
import { Component, BaseComponent, type Components } from "@flamework/components";
import { Workspace as World } from "@rbxts/services";
import { TweenInfoBuilder } from "@rbxts/builders";

import { tween } from "shared/utilities/ui";
import GameCameraState from "shared/structs/game-camera-state";
import Log from "shared/logger";

@Component({ tag: "GameCamera" })
export class GameCamera extends BaseComponent<{}, Camera> implements OnStart {
  private readonly defaultCamera = World.CurrentCamera!;
  private state = GameCameraState.Personal;

  public constructor(
    private readonly components: Components
  ) { super(); }

  public onStart(): void {
    this.instance.CFrame = this.getCFrame();
  }

  public setState(state: GameCameraState): void {
    this.state = state;
    this.update();
    Log.info(`Set game camera state to: ${GameCameraState[state]}`);
  }

  public getState(): GameCameraState {
    return this.state;
  }

  public toggle(on: boolean): void {
    World.CurrentCamera = on ? this.instance : this.defaultCamera;

    if (!on) return;
    for (const gameCamera of this.components.getAllComponents<GameCamera>()) {
      if (gameCamera === this) continue;
      gameCamera.toggle(false);
    }
  }

  private update(): void {
    const info = new TweenInfoBuilder()
      .SetTime(0.6);

    tween(this.instance, info, { CFrame: this.getCFrame() });
  }

  private getCFrame(): CFrame {
    const position = this.getDefaultPosition();
    switch(this.state) {
      case GameCameraState.Personal:
        return CFrame.lookAt(position, new Vector3(0, -1, 0));
      case GameCameraState.Center:
        return CFrame.lookAt(position, this.getGameTable().Table.Top.Position);
    }
  }

  private getGameTable(): GameTableModel {
    return <GameTableModel>this.getSeat().Parent?.Parent?.Parent;
  }

  private getSeat(): Seat {
    return <Seat>this.instance.Parent;
  }

  private getDefaultPosition(): Vector3 {
    const seat = this.getSeat();
    return seat.Position
      .add(new Vector3(0, 5, 0))
      .add(seat.CFrame.LookVector.mul(1.5));
  }
}