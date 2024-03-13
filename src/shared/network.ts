import { Networking } from "@flamework/networking";
import { DataKey, DataValue, GameDataModel } from "./data-models/generic";
import type { GitHubInfo } from "./structs/github";
import type CardType from "./structs/cards/card-type";

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
      draw(tableID: string): void;
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
      addHand(tableID: string, hand: CardType[]): void;
      addToHand(tableID: string, card: CardType): void;
      draw(tableID: string, card: CardType): void;
    };
  };
}

interface ServerFunctions {
  data: {
    get(key: DataKey): DataValue;
  };
  games: {
    cards: {
      canPlayCard(tableID: string, card: CardType): boolean;
    };
  };
  github: {
    getInfo(): GitHubInfo;
  };
}

interface ClientFunctions {}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
