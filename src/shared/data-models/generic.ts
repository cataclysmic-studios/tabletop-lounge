export interface GameDataModel {
  playtime: number;
}

export type DataValue = GameDataModel[DataKey];
export type DataKey = keyof GameDataModel;

export const DataKeys: DataKey[] = [
  "playtime"
];