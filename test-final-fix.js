// 最终修复测试
const API_KEY = 'sk-uq5N8kDcsnbGcskR0PknOVLecd5LWYCBzsJLHiHDZ0gLGoU5';
const MODEL = 'gemini-2.5-flash-image-preview';
const BASE_URL = 'https://apipro.maynor1024.live/v1beta';

// 测试图片
const SAMPLE_IMAGE = "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=";

async function testFinalFix() {
  console.log('测试最终修复...\n');

  try {
    // 使用正确的驼峰命名格式
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: "请根据以下描述生成或编辑一张图片：a cat"
            },
            {
              inlineData: {  // 改为驼峰命名
                mimeType: "image/jpeg",  // 改为驼峰命名
                data: SAMPLE_IMAGE
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
        responseModalities: ["TEXT", "IMAGE"]
      }
    };

    console.log('发送请求到:', `${BASE_URL}/models/${MODEL}:generateContent`);

    const response = await fetch(
      `${BASE_URL}/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    );

    const data = await response.json();
    
    console.log('响应状态:', response.status);
    
    if (!response.ok) {
      console.error('❌ 错误:', data);
    } else {
      console.log('✅ 成功!');
      
      // 解析响应
      if (data.candidates && data.candidates[0]) {
        const parts = data.candidates[0].content.parts;
        const textPart = parts.find(p => p.text);
        const imagePart = parts.find(p => p.inlineData);
        
        if (textPart) {
          console.log('\n文本响应:', textPart.text);
        }
        if (imagePart) {
          console.log('\n✅ 检测到图片响应');
          console.log('图片类型:', imagePart.inlineData.mimeType);
          console.log('图片数据长度:', imagePart.inlineData.data.length);
        }
      }
    }
  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

testFinalFix();