import './pages.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import SideNavigation from '../components/sidenav'
import ToastProvider from '../components/toastprovider'
import Footer from '../components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JRMSU U-Week Tabulation',
  description: 'Score tabulation for Univeristy Week',
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
          <SideNavigation />
            {children}
        </ToastProvider>
        <Footer />
      </body>
    </html>
  )
}