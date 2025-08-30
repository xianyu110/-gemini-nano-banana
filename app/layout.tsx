export const metadata = {
  title: 'Gemini Nano Banana - AI图片生成器',
  description: '使用Google Gemini 2.5 Flash生成图片',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}