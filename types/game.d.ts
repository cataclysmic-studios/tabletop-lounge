interface GameTableModel extends Model {
	GameIcon: Part & {
		BillboardGui: BillboardGui & {
			ImageLabel: ImageLabel;
		};
	};
	Chairs: Folder;
	Table: Model & {
		["Top"]: MeshPart;
		["Meshes/Home_pCube158"]: MeshPart;
	};
}
