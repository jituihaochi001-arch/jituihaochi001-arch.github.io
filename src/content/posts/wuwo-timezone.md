---
title: 《无我的时区》
published: 2026-10-03
description: 《无我的时区》是一款以记忆探索与自我认知为主题的 2D 叙事解谜游戏。
aiPolished: false
image: /assets/images/jitui/work-timezone.jpg
imageColor: "#a9c4e6"
video: /assets/videos/wuwo-timezone-pv.mp4
tags: ["Godot", "GDScript", "GameJam"]
category: 游戏
comment: false
---

## 游戏简介

《无我的时区》是一款以记忆探索与自我认知为主题的 2D 叙事解谜游戏。

故事发生在充满怀旧气息的校园与家庭中。少女林栀从熟悉的卧室醒来，却发现自己的记忆出现了缺失。为了寻找遗忘的过去，她穿梭于教室、机房、画室等场景，通过探索日常物品、解开轻量谜题、体验童年小游戏，逐渐收集散落的记忆碎片。

然而，随着记忆逐渐拼合，原本平静的世界开始出现异常。不断延伸的走廊、重复的声音、相互交叠的场景……那些被遗忘的往事背后，似乎还隐藏着另一个自己。

当梦想、友情与家庭的矛盾逐渐浮现，林栀必须重新面对过去，理解那些曾经困住自己的选择。

当所有记忆重新涌现，她又将成为怎样的自己？

## 技术栈

- Godot + GDScript：2D 叙事解谜的整体实现
- 分层架构：StoryCatalog / StorySession / GameDirector / GameState，剧情内容、交互规则与核心流程解耦
- 章节 JSON 数据驱动：6 章、22 个剧情阶段与 A / B / C 三结局
- 交互与小游戏统一接入：调查、磁带、日记、物品组合与三个小游戏，以完成信号衔接胜负、返回与跳过
- 存档与自检：自动存档、章节试阅、结局回看，140 项流程检查覆盖卡关、胜负与存档读写

## 团队成员/个人开发

与伙伴组队参加 TapTap 聚光灯 GameJam，本人负责程序与流程保障。

## 相关链接

- [项目地址](https://www.taptap.cn/app/981759?os=pc)
