import { Networking } from "@flamework/networking";
import { DataKey, DataValue, GameDataModel } from "./data-models/generic";

interface ServerEvents {
  data: {
    initialize(): void;
    loaded(): void;
    set(key: DataKey, value: DataValue): void;
    increment(key: ExtractKeys<GameDataModel, number>, amount?: number): void;
  };
}

interface ClientEvents {
  data: {
    update(key: DataKey, value: DataValue): void;
  };
  game: {
    toggleCamera(tableID: string, on: boolean): void;
    ejectSeatOccupant(tableID: string): void;
  };
}

interface ServerFunctions {
  data: {
    get(key: DataKey): DataValue;
  };
}

interface ClientFunctions {}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
