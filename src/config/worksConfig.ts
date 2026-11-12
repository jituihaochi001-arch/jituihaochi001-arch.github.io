// 作品按「功能」而非引擎分类。顺序即分类栏展示顺序；
// 计数为 0 的分类也会显示，便于后续补充网站 / 应用 / 工具类作品。
export interface WorksCategory {
	name: string;
	icon: string;
}

export const worksCategories: WorksCategory[] = [
	{ name: "游戏", icon: "material-symbols:sports-esports-outline-rounded" },
	{ name: "网站", icon: "material-symbols:language" },
	{ name: "应用", icon: "material-symbols:smartphone" },
	{ name: "工具", icon: "material-symbols:build-outline" },
];
