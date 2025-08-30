# Gemini MVP 使用指南

## 🚀 快速开始

### 1. 安装依赖
```bash
cd gemini-nano-banana
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 访问 MVP 页面
打开浏览器访问: http://localhost:3000/mvp

## 📋 功能特点

### 主要改进
1. ✅ 使用正确的 Gemini API 格式（v1beta）
2. ✅ 支持图片上传
3. ✅ 支持纯文本请求
4. ✅ 实时显示响应结果
5. ✅ 错误处理和提示

### API 配置
- **端点**: `https://apipro.maynor1024.live/v1beta/models/`
- **模型**: `gemini-2.5-flash-image-preview`
- **API Key**: 已在 `.env.local` 中配置

## 🧪 测试方法

### 方法1: 使用 Web 界面
1. 访问 http://localhost:3000/mvp
2. 输入文字描述（必须）
3. 可选：上传图片
4. 点击"发送请求"

### 方法2: 使用测试脚本
```bash
node test-gemini-api.js
```

### 方法3: 使用 curl
```bash
curl -X POST "https://apipro.maynor1024.live/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=sk-uq5N8kDcsnbGcskR0PknOVLecd5LWYCBzsJLHiHDZ0gLGoU5" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [
        {"text": "描述一下春天"},
        {"inline_data": {"mime_type": "image/jpeg", "data": "YOUR_BASE64_IMAGE"}}
      ]
    }]
  }'
```

## 📁 项目结构

```
gemini-nano-banana/
├── app/
│   ├── api/
│   │   ├── generate/     # 原始 API（OpenAI 格式）
│   │   └── gemini/       # 新 API（Gemini 格式）✨
│   ├── page.tsx          # 原始页面
│   └── mvp/              # MVP 页面 ✨
│       └── page.tsx
├── test-gemini-api.js    # API 测试脚本 ✨
└── MVP-使用指南.md       # 本文档 ✨
```

## ⚠️ 注意事项

1. **模型限制**: `gemini-2.5-flash-image-preview` 必须包含图片输入
2. **图片格式**: 支持 JPEG, PNG, GIF, WebP
3. **图片大小**: 建议不超过 4MB
4. **响应时间**: 图片处理可能需要 10-30 秒

## 🐛 常见问题

### 1. "The request is not supported by this model"
- 确保请求中包含图片
- 该模型不支持纯文本请求

### 2. "Base64 decoding failed"
- 检查图片是否正确转换为 base64
- 确保移除了 `data:image/xxx;base64,` 前缀

### 3. API 调用失败
- 检查 API Key 是否正确
- 确认网络连接正常
- 查看控制台错误信息

## 🎯 下一步

1. 添加更多图片处理功能
2. 支持批量处理
3. 优化用户界面
4. 添加历史记录功能