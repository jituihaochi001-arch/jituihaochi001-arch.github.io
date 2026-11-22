---
title: 求职助手 Career Copilot
published: 2026-11-22
description: 纯前端简历工作台：新建或导入简历，九套模板可视化调版式，粘岗位 JD 一键诊断，AI 模拟面试出评分报告，六种格式导出。
aiPolished: false
image: /assets/images/jitui/work-resume-copilot.jpg
imageColor: "#d9d3c7"
video: /assets/videos/resume-copilot-demo.webm
tags: ["前端", "AI", "效率工具"]
category: 工具
categories: ["网站"]
comment: false
---

<a href="https://eastern-hare-d7gpz96umb56910e4-1538459523.ap-shanghai.app.tcloudbase.com/7a8d66c4dde0470a" target="_blank" rel="noopener noreferrer" data-no-swup>打开在线 Demo ↗</a>

## 作品介绍

「求职助手 Career Copilot」面向大学生和转行求职者：简历不会写、投递没回音、面试没底。打开网页即可新建或导入简历，九套模板可视化调整模块与版式；粘贴岗位 JD 一键诊断并逐条采纳，AI 模拟面试按岗位追问并生成评分报告；支持 PDF、DOCX、PNG 等六种导出。无需安装，本地优先存储，用你自己的模型 Key。九套模板均一页成稿，线上版国内可直连。

## 主要功能

- **简历库**：多份简历并存，支持 DOCX / PDF / Markdown 导入解析，随时复制、导出与恢复备份。
- **可视化编辑**：模块增删、拖拽排序、隐藏；头像、主题色、字体、行高与名字字号都可调，实时预览。
- **九套模板**：经典、两栏、模块标题、时间轴、极简、优雅、创意、海报、瑞士，一键切换并自动压成一页。
- **一键优化**：粘岗位 JD 诊断匹配度，逐条采纳建议，结果直接回写当前简历且可撤销；没有配置 Key 时自动回落到规则版建议。
- **模拟面试**：按岗位与简历追问，结束生成评分报告；错题本只留问题与参考答案，答案默认折叠。
- **六种导出**：PDF（A4 自动分页）、DOCX、PNG、Markdown、TXT、JSON。

## 实现

- 纯前端单页：双击 `index.html` 即可运行，无需后端、无需安装。
- 版式引擎：同一份数据驱动九套模板的 DOM 排版与打印分页，配合「紧凑一页」自动收敛字号与间距。
- 导出链路：PDF / DOCX / PNG 均在浏览器内生成，Markdown / TXT / JSON 直接序列化，全部在本机完成。
- BYOK：模型 Key 只存在本机，前端直连兼容 OpenAI 协议的接口，可切 DeepSeek、通义千问、Kimi、智谱 GLM、OpenRouter 等。
- 线上版：腾讯云 CloudBase 单个云函数同时承载 `/api/*` 与静态资源，同源请求免 CORS。

## 相关链接

- [在线 Demo](https://eastern-hare-d7gpz96umb56910e4-1538459523.ap-shanghai.app.tcloudbase.com/7a8d66c4dde0470a)
- [源码仓库](https://github.com/jituihaochi001-arch/agrihackathon-resume-copilot)