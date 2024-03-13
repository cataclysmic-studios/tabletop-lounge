interface PlayerGui extends BasePlayerGui {
	Games: Folder & {
		Uno: ScreenGui & {
			Draw: TextButton & {
				Title: TextLabel;
			};
		};
	};
	Menu: ScreenGui;
	LoadScreen: ScreenGui & {
		Background: ImageLabel & {
			UIGradient: UIGradient;
			UIPadding: UIPadding;
			Spinner: ImageLabel & {
				UIAspectRatioConstraint: UIAspectRatioConstraint;
				MiniSpinner: ImageLabel;
			};
			Logo: ImageLabel & {
				UIAspectRatioConstraint: UIAspectRatioConstraint;
			};
		};
	};
}