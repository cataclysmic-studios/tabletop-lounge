interface Workspace extends WorldModel {
  GameProps: Folder & {
    Cards: Folder & {
      Uno: Folder & {
        Table: Folder;
        Hands: Folder;
      };
    };
  };
}