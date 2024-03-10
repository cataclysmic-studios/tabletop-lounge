import type { OnRender, OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

import { PlayerGui } from "shared/utilities/client";
import Log from "shared/logger";

const { min } = math;

interface Attributes {
  Degrees: number;
}

@Component({
  tag: "Spin",
  ancestorWhitelist: [ PlayerGui ],
  defaults: {
    Degrees: 3
  }
})
export class Spin extends BaseComponent<Attributes, GuiObject> implements OnStart, OnRender {
  public onStart(): void {
    Log.component("Spin", this);
  }

  public onRender(dt: number): void {
    dt = min(dt, 1)
    this.instance.Rotation += this.attributes.Degrees * dt * 60;
  }
}