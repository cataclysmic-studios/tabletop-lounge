import type { Components } from "@flamework/components";
import { Service, type OnStart } from "@flamework/core";

import { Assets } from "shared/utilities/helpers";

import type { LogStart } from "shared/hooks";
import type { Speaker } from "server/components/speaker";

@Service()
export class MusicService implements OnStart, LogStart {
  public constructor(
    private readonly components: Components
  ) {}

  public onStart(): void {
    const music = Assets.Music.GetChildren();
    task.spawn(() => {
      while (true) {
        const selectedSong = <Sound>music[math.random(1, music.size() - 1)];
        this.play(selectedSong);
        task.wait(selectedSong.TimeLength);
      }
    });
  }

  public play(song: Sound): void {
    const speakers = this.components.getAllComponents<Speaker>();
    for (const speaker of speakers)
      task.spawn(() => speaker.play(song));
  }
}