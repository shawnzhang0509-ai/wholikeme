# 谁喜欢过我 · MVP Prototype

目标：验证核心感觉——**好奇 → 输入 → 等待 → 发现 → 身份匹配 → 神秘 → 想继续解锁**。

## 技术栈
- 微信小程序原生开发
- GitHub 作为唯一 source of truth
- `/api` 为 Vercel Serverless API layer；当前返回 Mock Data
- 前端调用顺序固定为：`Page -> Service -> API -> Mock Data`

## 已实现
1. 微信小程序项目初始化
2. 首页
3. 身份输入
4. Matching Animation
5. Matching Result
6. Identity Matching
7. Relationship Card
8. Mock Data
9. API layer
10. README
11. GitHub-ready project structure

## 目录
```text
/
├── miniprogram/
│   ├── pages/                 # home/profile/matching/results/person/relationship
│   ├── components/            # Button/PersonCard/MatchAnimation/RelationshipCard
│   ├── utils/                 # format
│   ├── services/api.js        # Page 不直接写 mock；以后切 DB 只改 service/api
│   ├── mock/people.js         # 本地演示数据
│   ├── styles/theme.wxss      # colors/typography/spacing tokens
│   └── app.*
├── api/                       # Vercel: /api/match /api/users /api/relationships
├── package.json
└── README.md
```

## 下一步建议
- 先用真机体验闭环，不改功能，只记录哪一步最让人想继续点。
- 确认核心感觉成立后，再接：真实 DB、用户身份、关系图谱、分享回流、付费解锁。
