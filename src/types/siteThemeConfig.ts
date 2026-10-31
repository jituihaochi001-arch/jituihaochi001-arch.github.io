export type SiteTheme = "tasty-chicken" | "pure";

export interface SiteThemeConfig {
	enabled: boolean;
	defaultTheme: SiteTheme;
}
