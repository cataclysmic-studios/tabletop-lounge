import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { SoundService as Sound } from "@rbxts/services";

@Component({ tag: "Speaker" })
export class Speaker extends BaseComponent<{}, BasePart> implements OnStart {
  private readonly audio = new Instance("Sound", this.instance);

  public onStart(): void {
    this.audio.SoundGroup = Sound.Speakers;
  }

  public play(audio: Sound): void {
    this.audio.Stop();
    this.audio.SoundId = audio.SoundId;
    this.audio.Play();
  }
}