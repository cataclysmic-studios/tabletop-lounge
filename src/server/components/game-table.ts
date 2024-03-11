import type { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { RunService as Runtime, HttpService as HTTP } from "@rbxts/services";
import { Timer } from "@rbxts/timer";

import { Events } from "server/network";
import { Assets, toRemainingTime } from "shared/utilities/helpers";
import { BaseGameTable } from "shared/base-components/base-game-table";
import Log from "shared/logger";

import type { LogStart } from "shared/hooks";
import type { GamesService } from "server/services/games";

@Component({
  tag: "GameTable",
})
export class GameTable extends BaseGameTable implements OnStart, LogStart {
  private readonly id = HTTP.GenerateGUID();
  private readonly timerUI = Assets.UI.GameTimer.Clone();

  public constructor(
    private readonly games: GamesService
  ) { super(); }

  public onStart(): void {
    super.onStart();
    this.timerUI.CFrame = this.instance.GameIcon.CFrame.sub(new Vector3(0, 2, 0));
    this.timerUI.Countdown.Enabled = false;
    this.timerUI.Parent = this.instance;
    this.instance.SetAttribute("ID", this.id);
  }

  protected seatOccupied(seat: Seat): void {
    if (this.getSatPlayers().size() !== 1) return;
    this.startGameTimer();
  }

  protected seatLeft(seat: Seat): void {

  }

  private startGameTimer(): void {
    Log.info("Started game countdown timer");
    const length = Runtime.IsStudio() ? 5 : 20;
    const timer = new Timer(length);
    const updateUI = (remaining: number) => this.timerUI.Countdown.Remaining.Text = toRemainingTime(remaining);

    timer.secondReached.Connect(updateUI);
    timer.completed.Connect(() => {
      if (this.getSatPlayers().size() < this.attributes.MinimumPlayers)
        this.ejectSeatOccupants();
      else
        this.startGame();

      timer.destroy();
      this.timerUI.Countdown.Enabled = false;
    });

    updateUI(length);
    this.timerUI.Countdown.Enabled = true;
    timer.start();
  }

  private startGame(): void {
    Log.info(`Started game of "${this.attributes.Game}"`);
    Events.game.toggleCamera.broadcast(this.id, true);
    this.games.start(this.attributes.Game, this.getSatPlayers());
    this.toggleSeats(false);
  }

  public concludeGame(): void {
    Events.game.toggleCamera.broadcast(this.attributes.Game, false);
    this.toggleSeats(true);
    this.ejectSeatOccupants();
  }

  private ejectSeatOccupants(): void {
    Events.game.ejectSeatOccupant.broadcast(this.id);
  }
}