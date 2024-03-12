import type { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";

import type { LogStart } from "shared/hooks";
import { ServerBaseGameTable } from "server/base-components/base-game-table";

@Component({
  tag: "CardGameTable",
})
export class CardGameTable extends ServerBaseGameTable implements OnStart, LogStart {
  public onStart(): void {
    super.onStart();
  }
}