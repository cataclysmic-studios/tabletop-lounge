import { Networking } from "@flamework/networking";
import { DataKey, DataValue, GameDataModel } from "./data-models/generic";
import type { CardGame } from "./structs/game-types";
import type CardType from "./structs/card-type";

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
  gameTable: {
    toggleCamera(tableID: string, on: boolean): void;
    ejectOccupant(tableID: string): void;
    addCardHand(tableID: string, hand: CardType[], gameName: CardGame): void;
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
