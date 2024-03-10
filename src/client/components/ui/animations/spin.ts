import type { OnRender } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

import { PlayerGui } from "shared/utilities/client";

const { min } = math;

interface Attributes {
  Clockwise: boolean;
}

@Component({
  tag: "Spin",
  ancestorWhitelist: [ PlayerGui ],
  defaults: {
    Clockwise: false
  }
})
export class Spin extends BaseComponent<Attributes, GuiObject> implements OnRender {
  public onRender(dt: number): void {
    dt = min(dt, 1);
    this.instance.Rotation += this.attributes.Clockwise ? 1 : -1;
  }
}