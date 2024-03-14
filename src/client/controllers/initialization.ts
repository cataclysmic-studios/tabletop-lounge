import { Controller, type OnStart } from "@flamework/core";
import { Events } from "client/network";
import Log from "shared/logger";

@Controller()
export class InitializationController implements OnStart {
  public onStart(): void {
    Events.data.updated.connect((directory, value) => Log.info(`DATA UPDATED! ${directory}: ${value}`));
    Events.data.initialize();
  }
}