'use client'

import { useState } from 'react'

export default function MVP() {
  const [prompt, setPrompt] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64 = reader.result as string
        // 移除 data:image/xxx;base64, 前缀
        const base64Data = base64.split(',')[1]
        resolve(base64Data)
      }
      reader.onerror = error => reject(error)
    })
  }

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError('请输入描述文字')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      let imageData = null
      if (imageFile) {
        imageData = await convertToBase64(imageFile)
      }

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, imageData })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '请求失败')
        console.error('详细错误:', data.details)
      } else {
        setResult(data)
      }
    } catch (err) {
      setError('网络错误，请重试')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Gemini API MVP 测试</h1>
      
      <div style={{ marginBottom: '1rem' }}>
        <h3>1. 输入描述文字（必须）</h3>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="例如：在这张图片中添加一只可爱的羊驼"
          style={{
            width: '100%',
            height: '100px',
            padding: '0.5rem',
            fontSize: '16px'
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <h3>2. 上传图片（可选）</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginBottom: '0.5rem' }}
        />
        {imagePreview && (
          <div>
            <img 
              src={imagePreview} 
              alt="预览" 
              style={{ maxWidth: '300px', maxHeight: '300px' }}
            />
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !prompt.trim()}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '处理中...' : '发送请求'}
      </button>

      {error && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          backgroundColor: '#f8d7da', 
          color: '#721c24',
          borderRadius: '5px'
        }}>
          错误: {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <h3>响应结果：</h3>
          
          {result.imageData && (
            <div>
              <h4>生成的图片：</h4>
              <img 
                src={`data:${result.mimeType};base64,${result.imageData}`}
                alt="生成的图片"
                style={{ maxWidth: '100%' }}
              />
            </div>
          )}

          {result.text && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              backgroundColor: '#f0f0f0',
              borderRadius: '5px'
            }}>
              <h4>文本响应：</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>{result.text}</p>
            </div>
          )}

          {result.message && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              backgroundColor: '#d4edda',
              color: '#155724',
              borderRadius: '5px'
            }}>
              {result.message}
            </div>
          )}
        </div>
      )}
    </div>
  )
}