'use client'
import { AnimatePresence, motion } from 'framer-motion';
import SessionProvider from '../components/sessionprovider';
import ToastProvider from '../components/toastprovider';

export default function FilesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SessionProvider storageKey="userLogin" redirectPath="/">
        <ToastProvider>
          <AnimatePresence>
            <motion.main 
              className="flex-1 p-8"
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
    </div>
  )
}