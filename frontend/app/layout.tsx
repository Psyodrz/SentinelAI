import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SentinelAI - AI-Powered Cyber Threat Intelligence',
  description: 'SentinelAI uses a multi-agent AI pipeline to analyze suspicious URLs and emails in real-time — before they cause damage.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Barlow+Condensed:wght@300;400;600;700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
