import type { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { TweenInfoBuilder } from "@rbxts/builders";

import { PlayerGui } from "shared/utilities/client";
import { tween } from "shared/utilities/ui";
import DestroyableComponent from "client/base-components/destroyable";
import Log from "shared/logger";

interface Attributes {
  Delay: number;
  Lifetime: number;
}

@Component({
  tag: "LoadScreen",
  ancestorWhitelist: [ PlayerGui ]
})
export class LoadScreen extends DestroyableComponent<Attributes, PlayerGui["LoadScreen"]> implements OnStart {
  private readonly background = this.instance.Background;

  public onStart(): void {
    Log.component("LoadScreen", this);
    this.instance.Enabled = true;
    this.janitor.Add(this.instance);

    const logoSize = this.background.Logo.Size;
    this.background.Logo.Size = new UDim2;
    task.delay(this.attributes.Delay, () => {
      this.startLogoAnimation(logoSize);
      task.delay(this.attributes.Lifetime, () => this.destroy());
    });
  }

  private startLogoAnimation(size: UDim2): void {
    tween(
      this.background.Logo,
      new TweenInfoBuilder()
        .SetTime(1.5)
        .SetEasingStyle(Enum.EasingStyle.Back),

      { Size: size }
    );
  }
}