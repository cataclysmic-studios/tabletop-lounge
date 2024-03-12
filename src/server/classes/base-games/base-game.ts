import { Janitor } from "@rbxts/janitor";

import Startable from "../startable";

import type { ServerBaseGameTable } from "server/base-components/base-game-table";
import type Game from "shared/structs/game";

export default abstract class BaseGame extends Startable {
  public static readonly name: Game;

  protected readonly janitor = new Janitor;
  protected readonly tableTop: MeshPart;

  public constructor(
    public readonly _table: ServerBaseGameTable
  ) {

    super();
    this.tableTop = this._table.instance.Table.Top;
    task.delay(0.1, () => this.start());
  }

  public addToJanitor<
    O extends keyof void extends never
      ? object
      : I extends keyof void
      ? void[I]
      : M extends true
      ? Callback | thread
      : M extends undefined
      ? RBXScriptConnection | { Destroy(): void }
      : object,
    M extends undefined | ((this: O) => void) | ((_: O) => void) | ExtractKeys<O, () => void> | true,
    I extends keyof void | undefined = undefined
  >(object: O, methodName?: M, index?: I): O {
    return this.janitor.Add(object, methodName, index);
  }

  public destroy(): void {
    this.janitor.Destroy();
  }
}