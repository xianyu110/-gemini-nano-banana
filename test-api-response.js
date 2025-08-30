// 测试 API 响应格式，用于调试
const API_KEY = 'sk-uq5N8kDcsnbGcskR0PknOVLecd5LWYCBzsJLHiHDZ0gLGoU5';
const MODEL = 'gemini-2.5-flash-image-preview';
const BASE_URL = 'https://apipro.maynor1024.live/v1beta';

// 测试图片
const SAMPLE_IMAGE = "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=";

async function debugAPIResponse() {
  console.log('调试 API 响应格式...\n');

  try {
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: "请根据以下描述生成或编辑一张图片：a cat"
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
        maxOutputTokens: 4096,
        responseModalities: ["TEXT", "IMAGE"]
      }
    };

    console.log('请求体:', JSON.stringify(requestBody, null, 2));
    console.log('\n发送请求到:', `${BASE_URL}/models/${MODEL}:generateContent`);
    console.log('-------------------\n');

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
    console.log('\n完整响应:');
    console.log(JSON.stringify(data, null, 2));
    
    // 分析响应结构
    console.log('\n响应分析:');
    console.log('- 有 candidates?', !!data.candidates);
    if (data.candidates && data.candidates[0]) {
      console.log('- 有 content?', !!data.candidates[0].content);
      if (data.candidates[0].content) {
        console.log('- 有 parts?', !!data.candidates[0].content.parts);
        if (data.candidates[0].content.parts) {
          console.log('- parts 数量:', data.candidates[0].content.parts.length);
          data.candidates[0].content.parts.forEach((part, index) => {
            console.log(`  - Part ${index}:`, Object.keys(part));
          });
        }
      }
    }
  } catch (error) {
    console.error('错误:', error);
  }
}

debugAPIResponse();