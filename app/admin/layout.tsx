'use client'
import { AnimatePresence, motion } from 'framer-motion';
import AdminSideBarNavigation from '../components/admin_sidebar';
import ToastProvider from '../components/toastprovider';
import SessionProvider from '../components/sessionprovider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SessionProvider storageKey="userLogin" redirectPath="/">
        <SessionProvider storageKey="filename" redirectPath="/files">
          <ToastProvider>
            <AdminSideBarNavigation />
              <AnimatePresence>
                <motion.main 
                  className="flex-1 p-8 ml-64"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{opacity: 0}}
                  transition={{ duration: 0.3 }}
                  >
                  {children}
                </motion.main>
            </AnimatePresence>
          </ToastProvider>
        </SessionProvider>
      </SessionProvider>
    </div>
  )
}