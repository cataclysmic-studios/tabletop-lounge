import { Events } from "server/network";
import Log from "shared/logger";

import Startable from "./startable";
import type BaseGame from "./base-games/base-game";
import Signal from "@rbxts/signal";

export default class Turns extends Startable {
  private index = 0;

  public constructor(
    private readonly _game: BaseGame
  ) { super(); }

  public start(): void {
    this.update();
    this._game.addToJanitor(Events.games.advanceTurn.connect((_, tableID) => {
      if (tableID !== this._game._table.id) return;
      this.index += 1;
      this.index %= this._game._table.getSatPlayers().size();
      this.update();
    }));
  }

  public is(player: Player): boolean {
    return player === this.getCurrentPlayer();
  }

  public getCurrentPlayer(): Player {
    return this._game._table.getSatPlayers()[this.index];
  }

  private update(): void {
    const turn = this.getCurrentPlayer();
    Events.games.turnChanged.broadcast(this._game._table.id, turn);
    Log.info(`It is now ${turn.Name}'s turn`);
  }
}