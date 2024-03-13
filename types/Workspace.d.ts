interface Workspace extends WorldModel {
  GameProps: Folder & {
    Cards: Folder & {
      Uno: Folder & {
        Hand: Folder;
        Table: Folder & {
          Played: Folder;
        };
      };
    };
  };
}