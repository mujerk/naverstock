import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar';
import LoginGuard from '@/components/LoginGuard';

export const metadata: Metadata = {
   title: 'Naver Stock Real-time Display',
   description: 'Real-time stock data visualization',
   robots: 'index, follow',
}

export default function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <html lang="ko">
         <body className="font-sans antialiased min-h-screen bg-background text-foreground">
            <LoginGuard>
               <div className="flex flex-col md:flex-row h-screen bg-background text-foreground overflow-hidden">
                  <Sidebar />
                  {children}
               </div>
            </LoginGuard>
         </body>
      </html>
   )
}
