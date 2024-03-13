export interface GitHubTag {
  readonly name: string;
}

export interface GitHubCommit {
  readonly sha: string;
}

export interface GitHubCommitResponse {
  readonly commit: GitHubCommit;
}

export interface GitHubInfo {
  readonly commits: GitHubCommit[];
  readonly tags: GitHubTag[];
}