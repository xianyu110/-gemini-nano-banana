// 测试修复后的 API
const API_KEY = 'sk-uq5N8kDcsnbGcskR0PknOVLecd5LWYCBzsJLHiHDZ0gLGoU5';
const MODEL = 'gemini-2.5-flash-image-preview';
const BASE_URL = 'https://apipro.maynor1024.live/v1beta';

// 测试图片 - 1x1 像素
const SAMPLE_IMAGE = "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=";

async function testGeminiAPI() {
  console.log('测试修复后的 Gemini API...');
  console.log('端点:', `${BASE_URL}/models/${MODEL}:generateContent`);
  console.log('-------------------');

  try {
    const response = await fetch(
      `${BASE_URL}/models/${MODEL}:generateContent?key=${API_KEY}`,
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
                  text: "请描述一只可爱的猫咪"
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
            maxOutputTokens: 500,
            responseModalities: ["TEXT", "IMAGE"]
          }
        })
      }
    );

    console.log('响应状态:', response.status);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ 错误:', data);
    } else {
      console.log('✅ 成功!');
      
      // 提取响应内容
      if (data.candidates && data.candidates[0]) {
        const parts = data.candidates[0].content.parts;
        const textPart = parts.find(p => p.text);
        const imagePart = parts.find(p => p.inline_data);
        
        if (textPart) {
          console.log('\n文本响应:', textPart.text);
        }
        if (imagePart) {
          console.log('\n检测到图片响应');
        }
      }
    }
  } catch (error) {
    console.error('❌ 网络错误:', error.message);
  }
}

// 运行测试
testGeminiAPI();