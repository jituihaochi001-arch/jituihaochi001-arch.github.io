---
title: 2D ARPG 游戏 Demo
published: 2026-08-20
description: 从零搭一套能持续加内容的 2D 冒险框架：战斗、背包 / 商店、任务、对话、技能树、存档各自成模块，互相只认事件。
aiPolished: false
image: /assets/images/jitui/work-arpg.jpg
imageColor: "#8fbfe0"
tags: ["Unity", "C#", "ARPG"]
category: Unity
comment: false
---

从零搭一套能持续加内容的 2D 冒险框架：战斗、背包 / 商店、任务、对话、技能树、存档各自成模块，互相只认事件。

## 背景

想验证「数据驱动 + 管理器分层」能不能让一个人也稳稳地往里加内容。

## 我负责

架构设计、75+ 脚本、UI 与交互、存档与资源加载、运行时性能优化。

## 做了什么

- 物品、敌人、任务、对话全部抽象成 ScriptableObject 数据资产，新增内容只加数据不改逻辑
- 多存档位 JSON 持久化与状态恢复，配合异步场景加载
- Addressables + 本地化系统管理资源与中英文文本
- 对象池管理敌人与掉落物，权重掉落表替代高频随机遍历，压住内存抖动

## 相关链接

- [看源码](https://github.com/jituihaochi001-arch?tab=repositories)