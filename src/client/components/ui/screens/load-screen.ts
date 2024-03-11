import type { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { TweenInfoBuilder } from "@rbxts/builders";

import { PlayerGui } from "shared/utilities/client";
import { tween } from "shared/utilities/ui";
import DestroyableComponent from "shared/base-components/destroyable";

import type { LogStart } from "shared/hooks";
import type { UIEffectsController } from "client/controllers/ui-effects";

interface Attributes {
  Delay: number;
  Lifetime: number;
}

@Component({
  tag: "LoadScreen",
  ancestorWhitelist: [ PlayerGui ]
})
export class LoadScreen extends DestroyableComponent<Attributes, PlayerGui["LoadScreen"]> implements OnStart, LogStart {
  private readonly background = this.instance.Background;

  public constructor(
    private readonly uiEffects: UIEffectsController
  ) { super(); }

  public onStart(): void {
    this.instance.Enabled = true;
    this.janitor.Add(this.instance);

    const logoSize = this.background.Logo.Size;
    this.background.Logo.Size = new UDim2;
    task.delay(this.attributes.Delay, () => {
      this.startLogoAnimation(logoSize);
      task.delay(this.attributes.Lifetime, async () => {
        await this.uiEffects.blackFade();
        this.destroy();
      });
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