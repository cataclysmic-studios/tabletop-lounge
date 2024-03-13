import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

import type { LogStart } from "shared/hooks";
import { PlayerGui } from "shared/utilities/client";
import { slice } from "@rbxts/string-utils";
import { Functions } from "client/network";

@Component({
  tag: "VersionLabel",
  ancestorWhitelist: [ PlayerGui ]
})
export class VersionLabel extends BaseComponent<{}, TextLabel> implements OnStart, LogStart {
  public async onStart(): Promise<void> {
    const { tags: [tag], commits: [commit] } = await Functions.external.github.getInfo();
    this.instance.Text = `${tag.name} (${slice(commit.sha, 0, 7)})`;
  }
}