import type { OnStart } from "@flamework/core";
import { Component, type Components } from "@flamework/components";

import { Events } from "client/network";
import { Character, PlayerGui } from "shared/utilities/client";
import DestroyableComponent from "shared/base-components/destroyable";

import type { CardGameTable } from "client/components/card-game-table";

@Component({
  tag: "UnoUI",
  ancestorWhitelist: [ PlayerGui ]
})
export class UnoUI extends DestroyableComponent<{}, PlayerGui["Games"]["Uno"]> implements OnStart {
  public constructor(
    private readonly components: Components
  ) { super(); }

  public onStart(): void {
    this.instance.Draw.Visible = false;
    this.janitor.Add(Events.games.cards.toggleDrawButton.connect((_game, on) => {
      if (_game !== this.instance.Name) return;
      this.instance.Draw.Visible = on
    }));

    const gameTables = this.components.getAllComponents<CardGameTable>();
    this.janitor.Add(this.instance.Draw.MouseButton1Click.Connect(() => {
      const currentGameTable = gameTables.find(_table => {
        const seats = _table.instance.Chairs.GetDescendants().filter((instance): instance is Seat => instance.IsA("Seat"));
        return seats.some(seat => seat.Occupant?.Parent === Character);
      });

      if (!currentGameTable) return;
      Events.games.cards.draw(currentGameTable.attributes.ID);
    }));
  }
}