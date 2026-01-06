import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
   title: 'Naver Stock Real-time Display',
   description: 'Real-time stock data visualization',
}

export default function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <html lang="ko">
         <body className="font-sans antialiased min-h-screen bg-background text-foreground">
            {children}
         </body>
      </html>
   )
}
