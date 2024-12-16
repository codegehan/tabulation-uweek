import './pages.css'
import { Inter } from 'next/font/google'
import ToastProvider from '../components/toastprovider'
import TopNavigation from '../components/clienttopnav'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={inter.className}>
        <TopNavigation />
        <ToastProvider>
          <main>{children}</main>
        </ToastProvider>
    </div>
  )
}