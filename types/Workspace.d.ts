interface Workspace extends WorldModel {
  GameProps: Folder & {
    Cards: Folder & {
      Uno: Folder & {
        Hands: Folder;
        Table: Folder & {
          Played: Folder;
        };
      };
    };
  };
}