import { Service } from "@flamework/core";

import type { LogStart } from "shared/hooks";
import type Game from "shared/structs/game";

@Service()
export class GamesService implements LogStart {
  public start(gameName: Game, players: Player[]): void {

  }
}