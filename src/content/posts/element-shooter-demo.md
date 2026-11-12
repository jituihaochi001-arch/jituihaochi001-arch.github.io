---
title: 3D 元素射击 Demo
published: 2026-09-20
description: 把「手感」拆成一条条可调的链路：输入 → 位移 → 瞄准 → 命中 → 反馈，每一段都能单独调。
aiPolished: false
image: /assets/images/jitui/work-shooter.jpg
imageColor: "#93b8d6"
tags: ["Unity", "URP", "射击"]
category: 游戏
comment: false
---

把「手感」拆成一条条可调的链路：输入 → 位移 → 瞄准 → 命中 → 反馈，每一段都能单独调。

## 背景

想搞清楚射击游戏里「打中了很爽」到底由哪些环节凑出来。

## 个人开发

个人独立开发：架构与状态、移动控制、瞄准与战斗链路、命中判定、反馈表现与 UI 同步。

## 做了什么

- 泛型状态机 + 管理器注册 + 事件驱动，分离输入、移动、战斗、AI、UI 与场景流程
- 相机朝向 + Root Motion + CharacterController 处理移动跳跃，滞空速度补偿优化空中控制
- 屏幕中心射线 + LayerMask + 目标切换 + 上半身动画约束，统一成一条战斗链路
- 分段 Raycast 与重叠检测改善高速弹道漏判，相机震动与受击表现用事件同步到战斗 UI

## 相关链接

- [看源码](https://github.com/jituihaochi001-arch?tab=repositories)