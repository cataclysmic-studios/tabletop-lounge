export interface GitHubTag {
  readonly name: string;
}

export interface GitHubCommit {
  readonly message: string;
  readonly url: string;
  readonly committer: {
    readonly date: string;
    readonly email: string;
    readonly name: string;
  }
  readonly tree: {
    readonly sha: string;
  };
}

export interface GitHubCommitResponse {
  readonly commit: GitHubCommit;
}

export interface GitHubInfo {
  readonly commits: GitHubCommit[];
  readonly tags: GitHubTag[];
}