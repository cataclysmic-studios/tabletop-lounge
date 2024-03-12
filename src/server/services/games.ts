import { Service } from "@flamework/core";
import { ServerScriptService } from "@rbxts/services";

import { Exception } from "shared/exceptions";
import type { LogStart } from "shared/hooks";
import type { ServerBaseGameTable } from "server/base-components/base-game-table";
import type BaseGame from "server/classes/base-games/base-game";

type GameModule = { default: typeof BaseGame };
type GameCtor = new (gameTable: ServerBaseGameTable<{}, GameTableModel>) => BaseGame;

@Service()
export class GamesService implements LogStart {
  public start(gameTable: ServerBaseGameTable): void {
    const GameConstructor = <Maybe<GameCtor>>this.getAllGames().find(_game => _game.name === gameTable.attributes.Game);
    if (!GameConstructor)
      throw new Exception("InvalidGame", `Could not find game class for "${gameTable.attributes.Game}"`);

    new GameConstructor(gameTable);
  }

  private getAllGames(): GameModule["default"][] {
    const gamesFolder = <Folder>ServerScriptService.WaitForChild("TS").WaitForChild("classes").WaitForChild("games");


    return gamesFolder.GetChildren()
      .filter((instance): instance is ModuleScript => instance.IsA("ModuleScript"))
      .map(module => (<GameModule>require(module)).default);
  }
}