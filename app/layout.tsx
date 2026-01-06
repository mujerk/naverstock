import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar';

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
            <div className="flex flex-col md:flex-row h-screen bg-background text-foreground overflow-hidden">
               <Sidebar />
               {children}
            </div>
         </body>
      </html>
   )
}
