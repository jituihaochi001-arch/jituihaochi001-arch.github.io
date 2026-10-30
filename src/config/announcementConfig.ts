import type { AnnouncementConfig } from "../types/announcementConfig";

export const announcementConfig: AnnouncementConfig = {
	title: "关于这个小站",
	content: "这里收着三个做过的项目和一路写下来的时间线。留言墙只做展示，想聊游戏可以直接邮件我。",
	closable: true,
	links: [{ enable: true, text: "看看作品", url: "/archive/", external: false }],
};
