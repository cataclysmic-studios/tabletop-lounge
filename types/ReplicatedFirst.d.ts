interface ReplicatedFirst extends Instance {
  Assets: Folder & {
    Music: Folder;
    UI: Folder & {
      GameTimer: Part & {
        Countdown: BillboardGui & {
          Remaining: TextLabel & {
            UIStroke: UIStroke;
          };
        };
      };
    };
    Games: Folder & {
      Uno: Folder & {
        Cards: Folder & {
          Wildcard: UnionOperation & {
            Logo: Decal;
            WildChange: Decal;
          };
          DrawFour: UnionOperation & {
            ["+4"]: Decal;
            Logo: Decal;
          };
          Blue: Folder & {
            Skip: UnionOperation & {
              Skip: Decal;
              Logo: Decal;
            };
            ["3"]: UnionOperation & {
              ["3"]: Decal;
              Logo: Decal;
            };
            ["2"]: UnionOperation & {
              Logo: Decal;
              ["2"]: Decal;
            };
            ["5"]: UnionOperation & {
              ["5"]: Decal;
              Logo: Decal;
            };
            ["4"]: UnionOperation & {
              Logo: Decal;
              ["4"]: Decal;
            };
            ["7"]: UnionOperation & {
              ["7"]: Decal;
              Logo: Decal;
            };
            ["6"]: UnionOperation & {
              Logo: Decal;
              ["6"]: Decal;
            };
            ["9"]: UnionOperation & {
              ["9"]: Decal;
              Logo: Decal;
            };
            ["8"]: UnionOperation & {
              Logo: Decal;
              ["8"]: Decal;
            };
            Reverse: UnionOperation & {
              Logo: Decal;
              Reverse: Decal;
            };
            ["1"]: UnionOperation & {
              ["1"]: Decal;
              Logo: Decal;
            };
            DrawTwo: UnionOperation & {
              Logo: Decal;
              ["+2"]: Decal;
            };
          };
          Green: Folder & {
            ["1"]: UnionOperation & {
              ["1"]: Decal;
              Logo: Decal;
            };
            ["3"]: UnionOperation & {
              ["3"]: Decal;
              Logo: Decal;
            };
            ["2"]: UnionOperation & {
              Logo: Decal;
              ["2"]: Decal;
            };
            ["5"]: UnionOperation & {
              ["5"]: Decal;
              Logo: Decal;
            };
            ["4"]: UnionOperation & {
              Logo: Decal;
              ["4"]: Decal;
            };
            ["7"]: UnionOperation & {
              ["7"]: Decal;
              Logo: Decal;
            };
            ["6"]: UnionOperation & {
              Logo: Decal;
              ["6"]: Decal;
            };
            ["9"]: UnionOperation & {
              ["9"]: Decal;
              Logo: Decal;
            };
            ["8"]: UnionOperation & {
              Logo: Decal;
              ["8"]: Decal;
            };
            Reverse: UnionOperation & {
              Logo: Decal;
              Reverse: Decal;
            };
            Skip: UnionOperation & {
              Skip: Decal;
              Logo: Decal;
            };
            DrawTwo: UnionOperation & {
              Logo: Decal;
              ["+2"]: Decal;
            };
          };
          Yellow: Folder & {
            ["1"]: UnionOperation & {
              ["1"]: Decal;
              Logo: Decal;
            };
            ["3"]: UnionOperation & {
              ["3"]: Decal;
              Logo: Decal;
            };
            ["2"]: UnionOperation & {
              Logo: Decal;
              ["2"]: Decal;
            };
            ["5"]: UnionOperation & {
              ["5"]: Decal;
              Logo: Decal;
            };
            ["4"]: UnionOperation & {
              Logo: Decal;
              ["4"]: Decal;
            };
            ["7"]: UnionOperation & {
              ["7"]: Decal;
              Logo: Decal;
            };
            ["6"]: UnionOperation & {
              Logo: Decal;
              ["6"]: Decal;
            };
            ["9"]: UnionOperation & {
              ["9"]: Decal;
              Logo: Decal;
            };
            ["8"]: UnionOperation & {
              Logo: Decal;
              ["8"]: Decal;
            };
            Reverse: UnionOperation & {
              Logo: Decal;
              Reverse: Decal;
            };
            DrawTwo: UnionOperation & {
              Logo: Decal;
              ["+2"]: Decal;
            };
            Skip: UnionOperation & {
              Skip: Decal;
              Logo: Decal;
            };
          };
          Red: Folder & {
            Skip: UnionOperation & {
              Skip: Decal;
              Logo: Decal;
            };
            ["3"]: UnionOperation & {
              ["3"]: Decal;
              Logo: Decal;
            };
            ["2"]: UnionOperation & {
              Logo: Decal;
              ["2"]: Decal;
            };
            ["5"]: UnionOperation & {
              ["5"]: Decal;
              Logo: Decal;
            };
            ["4"]: UnionOperation & {
              Logo: Decal;
              ["4"]: Decal;
            };
            ["7"]: UnionOperation & {
              ["7"]: Decal;
              Logo: Decal;
            };
            ["6"]: UnionOperation & {
              Logo: Decal;
              ["6"]: Decal;
            };
            ["9"]: UnionOperation & {
              ["9"]: Decal;
              Logo: Decal;
            };
            ["8"]: UnionOperation & {
              Logo: Decal;
              ["8"]: Decal;
            };
            Reverse: UnionOperation & {
              Logo: Decal;
              Reverse: Decal;
            };
            DrawTwo: UnionOperation & {
              Logo: Decal;
              ["+2"]: Decal;
            };
            ["1"]: UnionOperation & {
              ["1"]: Decal;
              Logo: Decal;
            };
          };
        };
      }
      Chess: Folder & {
        Board: Model & {
          Squares: Folder & {
            F5: Part;
            F4: Part;
            H5: Part;
            G4: Part;
            H4: Part;
            D5: Part;
            B5: Part;
            A5: Part;
            B7: Part;
            A7: Part;
            A3: Part;
            B1: Part;
            C3: Part;
            B3: Part;
            D2: Part;
            H6: Part;
            F2: Part;
            G2: Part;
            C6: Part;
            D6: Part;
            E6: Part;
            F6: Part;
            D8: Part;
            E8: Part;
            B8: Part;
            C8: Part;
            H8: Part;
            H2: Part;
            F8: Part;
            G8: Part;
            G1: Part;
            H7: Part;
            F1: Part;
            H1: Part;
            G7: Part;
            A8: Part;
            C4: Part;
            E5: Part;
            A4: Part;
            B4: Part;
            A6: Part;
            B6: Part;
            C1: Part;
            A2: Part;
            B2: Part;
            C2: Part;
            E3: Part;
            D3: Part;
            E1: Part;
            D1: Part;
            D7: Part;
            C7: Part;
            F7: Part;
            E7: Part;
            F3: Part;
            E2: Part;
            C5: Part;
            H3: Part;
            G3: Part;
            D4: Part;
            E4: Part;
            A1: Part;
          };
          Trim: Model;
        };
        Pieces: Folder & {
          Bishop: MeshPart;
          Queen: MeshPart;
          Knight: MeshPart;
          Pawn: MeshPart;
          King: MeshPart;
          Rook: MeshPart;
        };
      };
    };
  };
}