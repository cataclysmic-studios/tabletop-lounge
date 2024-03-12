import { Janitor } from "@rbxts/janitor";

import type { ServerBaseGameTable } from "server/base-components/base-game-table";

export default abstract class BaseGame {
  protected readonly janitor = new Janitor;
  protected readonly tableTop: MeshPart;

  public constructor(
    protected readonly gameTable: ServerBaseGameTable
  ) {

    this.tableTop = this.gameTable.instance.Table.Top;
    task.delay(0.1, () => this.start());
  }

  protected abstract start(): void;

  public destroy(): void {
    this.janitor.Destroy();
  }
}