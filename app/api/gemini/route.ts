import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt, imageData } = await request.json()
    
    if (!prompt) {
      return NextResponse.json({ error: '请提供描述' }, { status: 400 })
    }

    const apiKey = process.env.MAYNOR_API_KEY
    const model = 'gemini-2.5-flash-image-preview'

    if (!apiKey) {
      return NextResponse.json({ error: 'API配置缺失' }, { status: 500 })
    }

    // 构建请求内容
    const parts: any[] = [
      {
        text: prompt
      }
    ]

    // 如果有图片数据，添加到请求中
    if (imageData) {
      parts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: imageData
        }
      })
    }

    // 使用正确的 Gemini API 格式
    const response = await fetch(
      `https://apipro.maynor1024.live/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: parts
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
            responseModalities: imageData ? ["TEXT", "IMAGE"] : ["TEXT"]
          }
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('API错误:', errorData)
      return NextResponse.json({ 
        error: errorData.error?.message || '生成失败',
        details: errorData 
      }, { status: response.status })
    }

    const data = await response.json()
    console.log('API响应:', data)
    
    // 解析 Gemini 响应
    if (data.candidates && data.candidates[0]) {
      const candidate = data.candidates[0]
      const content = candidate.content
      
      if (content && content.parts) {
        // 检查是否有生成的图片
        for (const part of content.parts) {
          if (part.inline_data) {
            // 返回生成的图片数据
            return NextResponse.json({ 
              imageData: part.inline_data.data,
              mimeType: part.inline_data.mime_type,
              text: content.parts.find((p: any) => p.text)?.text || ''
            })
          }
        }
        
        // 如果只有文本响应
        const textPart = content.parts.find((p: any) => p.text)
        if (textPart) {
          return NextResponse.json({ 
            text: textPart.text,
            message: '模型返回了文本响应'
          })
        }
      }
    }

    return NextResponse.json({ 
      error: '未能从响应中提取内容',
      raw_response: data 
    }, { status: 500 })
  } catch (error) {
    console.error('生成错误:', error)
    return NextResponse.json({ 
      error: '生成失败', 
      details: error instanceof Error ? error.message : '未知错误' 
    }, { status: 500 })
  }
}