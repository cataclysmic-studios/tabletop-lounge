import { Service, type OnInit } from "@flamework/core";
import { Players } from "@rbxts/services";

import type { LogStart } from "shared/hooks";
import type { OnPlayerJoin, OnPlayerLeave } from "server/hooks";
import type { DatabaseService } from "./database";

@Service()
export class PlaytimeService implements OnInit, OnPlayerJoin, OnPlayerLeave, LogStart {
  private readonly joinTimestamps: Record<number, number> = {};

  public constructor(
    private readonly db: DatabaseService
  ) {}

  public onInit(): void {
    game.BindToClose(() => {
      for (const player of Players.GetPlayers())
        this.onPlayerLeave(player);
    });
  }

  public onPlayerJoin(player: Player): void {
    this.joinTimestamps[player.UserId] = os.clock();
  }

  public onPlayerLeave(player: Player): void {
    const timeSpent = os.clock() - this.joinTimestamps[player.UserId];
    this.db.increment(player, "playtime", timeSpent);
  }
}