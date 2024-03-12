import { Players, HttpService as HTTP } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";
import Object from "@rbxts/object-utils";

import DestroyableComponent from "shared/base-components/destroyable";
import type Game from "shared/structs/game";

interface Attributes {
  Game: Game;
  MinimumPlayers: number;
  ID: string;
}

export abstract class BaseGameTable<A extends {} = {}, I extends GameTableModel = GameTableModel> extends DestroyableComponent<Attributes & A, I> {
  protected readonly seatJanitors: Record<string, Janitor> = {};

  protected abstract seatOccupied(seat: Seat): void;
  protected abstract seatLeft(seat: Seat): void;

  public getSatPlayers(): Player[] {
    return this.getSeats()
      .mapFiltered(seat => seat.Occupant?.Parent)
      .mapFiltered(character => Players.GetPlayerFromCharacter(character));
  }

  protected onStart(): void {
    this.createSeatJanitors();
    this.fixAttributes();
  }

  protected getID(): string {
    return <string>this.instance.GetAttribute("ID");
  }

  protected toggleSeats(on: boolean): void {
    for (const seat of this.getSeats()) {
      if (!on && this.getSeatOccupantPlayer(seat)) continue;
      seat.Disabled = !on;
    }
  }

  protected getSeatOccupantPlayer(seat: Seat): Maybe<Player> {
    return Players.GetPlayerFromCharacter(seat.Occupant?.Parent);
  }

  protected geatSeatID(seat: Seat): string {
    return <string>seat.GetAttribute("ID");
  }

  protected getSeatJanitor(seat: Seat): Janitor {
    return this.seatJanitors[this.geatSeatID(seat)];
  }

  protected getSeats(): Seat[] {
    return (<(Model & { Seat: Seat; })[]>this.instance.Chairs.GetChildren()).map(chair => chair.Seat)
  }

  private createSeatJanitors(): void {
    for (const seat of this.getSeats()) {
      const id = HTTP.GenerateGUID();
      const janitor = new Janitor;
      this.seatJanitors[id] = janitor;
      seat.SetAttribute("ID", id);

      janitor.Add(seat.GetPropertyChangedSignal("Occupant").Connect(() =>
        this[this.getSeatOccupantPlayer(seat) !== undefined ? "seatOccupied" : "seatLeft"](seat)
      ));
      this.janitor.Add(janitor);
    }
  }

  private fixAttributes(): void {
    for (const [name, value] of Object.entries(<Map<keyof (Attributes & A), AttributeValue>>this.instance.GetAttributes()))
      this.attributes[name] = <never>value;
  }
}