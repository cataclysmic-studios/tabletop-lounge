import { Service } from "@flamework/core";

import type Game from "shared/structs/game";

@Service()
export class GamesService {
  public start(gameName: Game, players: Player[]): void {

  }
}