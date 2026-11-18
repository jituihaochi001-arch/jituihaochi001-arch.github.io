---
title: 花间月 · 四季桃源
published: 2026-11-19
description: 用 Three.js 构建的古风空中小岛，在桃花、夏雨、夕阳与雪夜之间，漫游楼阁与月亮船。
aiPolished: false
image: /assets/images/jitui/work-huajianyue.png
imageColor: "#b8c6d4"
tags: ["Three.js", "WebGL", "交互场景"]
category: 网站
comment: false
---

<a href="/demos/huajianyue/" target="_blank" rel="noopener noreferrer" data-no-swup>打开「花间月」互动场景 ↗</a>

## 作品介绍

「花间月」是一座漂浮在云间的微缩桃源。木构楼阁、桃花树、暖色孔明灯与清澈水池围绕在一起，月亮船上住着一个安静的梦。

场景提供四种季节氛围：春日桃花、夏日细雨、秋日夕阳和冬日雪夜。可以旋转视角欣赏建筑，也可以唤醒船上的少女，走上露台、打开木门，进入古风客厅与卧房。

## 体验方式

- 拖动画面旋转视角，滚轮缩放；底部按钮切换四季。
- 点击月亮船入口，进入第三人称探索。
- WASD 移动，空格跳跃，Shift 奔跑，进入水中自动游泳。
- 靠近房门按 E 开关门，Esc 返回观景。
- 点击音乐按钮，自选播放或关闭背景音乐。

建议使用支持 WebGL 的桌面浏览器体验，角色探索需要键盘。

## 实现

使用 Three.js 构建建筑、屋瓦、木质栏杆、月亮船与人物，结合程序化材质、水面动画、季节粒子和角色控制器实现互动。场景以独立 HTML 页面运行。
