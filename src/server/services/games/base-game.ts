import { Janitor } from "@rbxts/janitor";
import { GameTable } from "server/components/game-table";

export default abstract class BaseGame {
  protected readonly janitor = new Janitor;
  protected readonly tableTop: MeshPart;

  public constructor(
    protected readonly gameTable: GameTable
  ) {

    this.tableTop = this.gameTable.instance.Table.Top;
    task.delay(0.1, () => this.start());
  }

  protected abstract start(): void;

  public destroy(): void {
    this.janitor.Destroy();
  }
}