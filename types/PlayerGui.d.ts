interface PlayerGui extends BasePlayerGui {
	Games: Folder & {
		Blackjack: ScreenGui;
		Uno: ScreenGui;
		Chess: ScreenGui;
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
