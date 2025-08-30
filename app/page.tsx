'use client'

import { useState } from 'react'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [responseContent, setResponseContent] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setLoading(true)
    setImageUrl('')
    setMessage('')
    setResponseContent('')
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      
      const data = await response.json()
      
      if (data.imageUrl) {
        setImageUrl(data.imageUrl)
      } else if (data.message) {
        setMessage(data.message)
        setResponseContent(data.content || '')
      } else if (data.error) {
        setMessage(`错误: ${data.error}`)
        if (data.details) {
          console.error('详细错误:', data.details)
        }
      }
    } catch (error) {
      console.error('生成失败:', error)
      setMessage('请求失败，请检查网络连接')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem',
      backgroundColor: '#f5f5f5'
    }}>
      <h1 style={{ color: '#333', marginBottom: '2rem' }}>
        Gemini 2.5 Flash 图片生成器 🎨
      </h1>
      
      <div style={{
        width: '100%',
        maxWidth: '600px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="输入你的图片描述..."
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '1rem',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            resize: 'vertical'
          }}
        />
        
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          style={{
            padding: '1rem 2rem',
            fontSize: '18px',
            backgroundColor: loading ? '#ccc' : '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s'
          }}
        >
          {loading ? '生成中...' : '生成图片'}
        </button>
      </div>
      
      {imageUrl && (
        <div style={{
          marginTop: '2rem',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <img 
            src={imageUrl} 
            alt="Generated image"
            style={{
              maxWidth: '100%',
              height: 'auto',
              display: 'block'
            }}
          />
        </div>
      )}
      
      {message && (
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: message.includes('错误') ? '#fee' : '#eef',
          borderRadius: '8px',
          maxWidth: '600px',
          width: '100%'
        }}>
          <p style={{ margin: 0, color: '#333' }}>{message}</p>
          {responseContent && (
            <pre style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '14px'
            }}>{responseContent}</pre>
          )}
        </div>
      )}
    </div>
  )
}