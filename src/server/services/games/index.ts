import { Service } from "@flamework/core";

import type { LogStart } from "shared/hooks";
import type { GameTable } from "server/components/game-table";
import Game from "shared/structs/game";
import Uno from "./uno";

@Service()
export class GamesService implements LogStart {
  public start(gameTable: GameTable): void {
    switch(gameTable.attributes.Game) {
      case Game.Uno: {
        new Uno(gameTable);
        break;
      }
    }
  }
}