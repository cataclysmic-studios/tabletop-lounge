import { OnInit, Service } from "@flamework/core";
import DataStore2 from "@rbxts/datastore2";

import { DataKey, DataValue, DataKeys } from "shared/data-models/generic";
import { Events, Functions } from "server/network";
import Log from "shared/logger";

import type { LogStart } from "shared/hooks";

@Service()
export class DataService implements OnInit, LogStart {
	public onInit(): void {
		DataStore2.Combine("DATA", ...DataKeys);
		Events.data.initialize.connect((player) => this.setup(player));
		Events.data.set.connect((player, key, value) => this.set(player, key, value));
		Events.data.increment.connect((player, key, amount) => this.increment(player, key, amount))
		Functions.data.get.setCallback((player, key) => this.get(player, key));
	}

	public increment(player: Player, key: DataKey, amount = 1): void {
		const value = this.get<number>(player, key);
		this.set(player, key, value + amount);
	}

	public get<T extends DataValue = DataValue>(player: Player, key: DataKey): T {
		const store = this.getStore<T>(player, key);
		return store.Get()!;
	}

	public set<T extends DataValue = DataValue>(player: Player, key: DataKey, value: T): void {
		const store = this.getStore<T>(player, key);
		store.Set(value);
	}

	private setup(player: Player): void {
		// intialize all data with a default value
    // using the same examples:
    this.initialize(player, "gold", 100);
    this.initialize(player, "gems", 0);

		Log.info("Initialized data");
		Events.data.loaded.predict(player);
	}

	private initialize<T extends DataValue = DataValue>(
		player: Player,
		key: DataKey,
		defaultValue: T
	): void {

		const store = this.getStore(player, key);
		const value = store.Get(defaultValue);
		this.sendToClient(player, key, value);
		store.OnUpdate((value) => this.sendToClient(player, key, value));
	}

	private sendToClient<T extends DataValue = DataValue>(
		player: Player,
		key: DataKey,
		value: T
	): void {

		Events.data.update(player, key, value);
	}

	private getStore<T extends DataValue = DataValue>(player: Player, key: DataKey): DataStore2<T> {
    // if you ever wanna wipe all data, just change the keyID
    // you can also use it to separate test databases and production databases
    const keyID = "PROD";
		return DataStore2<T>(keyID + "_" + key, player);
	}
}