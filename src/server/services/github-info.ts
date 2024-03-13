import { type OnInit, Service } from "@flamework/core";
import { HttpService as HTTP } from "@rbxts/services";

import { Functions } from "server/network";
import type { LogStart } from "shared/hooks";
import type { GitHubCommitResponse, GitHubInfo, GitHubTag } from "shared/structs/github";

@Service()
export class GitHubInfoService implements OnInit, LogStart {
  public onInit(): void {
    Functions.external.github.getInfo.setCallback(() => this.retrieve());
  }

  public retrieve(): GitHubInfo {
    const endpoint = "https://api.github.com/repos/R-unic/tabletop-lounge/tags";
    const tags = <GitHubTag[]>HTTP.JSONDecode(HTTP.GetAsync(endpoint));
    const commits = (<GitHubCommitResponse[]>HTTP.JSONDecode(HTTP.GetAsync(endpoint))).map(res => res.commit);
    return { tags, commits };
  }
}