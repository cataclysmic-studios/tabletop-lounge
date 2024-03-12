import { RunService as Runtime, HttpService as HTTP } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";
import { Timer } from "@rbxts/timer";

import { Events } from "server/network";
import { Assets, toRemainingTime } from "shared/utilities/helpers";
import Log from "shared/logger";

import { BaseGameTable } from "shared/base-components/base-game-table";
import { GamesService } from "server/services/games";
import { Dependency } from "@flamework/core";

const COUNTDOWN_LENTH = Runtime.IsStudio() ? 3 : 20;

export abstract class ServerBaseGameTable<A extends {} = {}, I extends GameTableModel = GameTableModel> extends BaseGameTable<A, I> {
  public readonly id = HTTP.GenerateGUID();
  protected readonly seatJanitors: Record<string, Janitor> = {};
  private readonly timerUI = Assets.UI.GameTimer.Clone();

  protected onStart(): void {
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
    const timer = new Timer(COUNTDOWN_LENTH);
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

    updateUI(COUNTDOWN_LENTH);
    this.timerUI.Countdown.Enabled = true;
    timer.start();
  }

  private startGame(): void {
    Log.info(`Started game of "${this.attributes.Game}"`);
    Events.games.toggleCamera.broadcast(this.id, true);
    this.toggleSeats(false);

    const games = Dependency<GamesService>();
    games.start(this);
  }

  public concludeGame(): void {
    Log.info(`Concluded game of "${this.attributes.Game}"`);
    Events.games.toggleCamera.broadcast(this.attributes.Game, false);
    this.toggleSeats(true);
    this.ejectSeatOccupants();
  }

  private ejectSeatOccupants(): void {
    Events.games.ejectOccupant.broadcast(this.id);
  }
}