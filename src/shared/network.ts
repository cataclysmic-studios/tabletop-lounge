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
  games: {
    advanceTurn(tableID: string): void;
    cards: {
      play(tableID: string, card: CardType, cframe: CFrame): void;
    };
  };
}

interface ClientEvents {
  data: {
    update(key: DataKey, value: DataValue): void;
  };
  games: {
    toggleCamera(tableID: string, on: boolean): void;
    ejectOccupant(tableID: string): void;
    turnChanged(tableID: string, turn: Player): void;
    cards: {
      addHand<Card extends CardType = CardType, CardGameType extends CardGame = CardGame>(tableID: string, hand: Card[]): void;
    };
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
