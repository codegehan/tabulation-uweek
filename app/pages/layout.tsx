import './pages.css'
import { Inter } from 'next/font/google'
import SideNavigation from '../components/sidenav'
import ToastProvider from '../components/toastprovider'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={inter.className}>
        <SideNavigation />
        <ToastProvider>
          <main>{children}</main>
        </ToastProvider>
    </div>
  )
}