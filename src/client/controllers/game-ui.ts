import { Controller, type OnInit } from "@flamework/core";

import { Events } from "client/network";
import { PlayerGui } from "shared/utilities/client";
import type { LogStart } from "shared/hooks";

@Controller()
export class GameUIController implements OnInit, LogStart {
  public onInit(): void {
    Events.games.cards.toggleGameUI.connect((_game, on) => {
      const ui = <ScreenGui>PlayerGui.Games.WaitForChild(_game);
      ui.Enabled = on;
    });
  }
}