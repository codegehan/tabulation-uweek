import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Footer from './components/footer'
import ToastProvider from './components/toastprovider'
import { ToastContainer } from 'react-toastify'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JRMSU U-Week Tabulation',
  description: 'Score tabulation for Univeristy Week',
  icons: {
    icon: '/favicon.ico'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          {children}
        </ToastProvider>
        <Footer />
      </body>
    </html>
  )
}