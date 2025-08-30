// 简单的 Gemini API 测试脚本
const API_KEY = 'sk-uq5N8kDcsnbGcskR0PknOVLecd5LWYCBzsJLHiHDZ0gLGoU5';
const MODEL = 'gemini-2.5-flash-image-preview';

// 测试图片 - 1x1 红色像素
const SAMPLE_IMAGE = "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=";

async function testGeminiAPI() {
  console.log('测试 Gemini API...');
  console.log('模型:', MODEL);
  console.log('-------------------');

  try {
    const response = await fetch(
      `https://apipro.maynor1024.live/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: "这是一张测试图片，请描述你看到的内容。"
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: SAMPLE_IMAGE
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500
          }
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error('错误响应:', data);
    } else {
      console.log('成功响应:');
      console.log(JSON.stringify(data, null, 2));
      
      // 提取文本响应
      if (data.candidates && data.candidates[0] && 
          data.candidates[0].content && data.candidates[0].content.parts) {
        const textPart = data.candidates[0].content.parts.find(p => p.text);
        if (textPart) {
          console.log('\n模型回复:', textPart.text);
        }
      }
    }
  } catch (error) {
    console.error('请求失败:', error);
  }
}

// 如果在 Node.js 环境中运行
if (typeof require !== 'undefined' && require.main === module) {
  testGeminiAPI();
}