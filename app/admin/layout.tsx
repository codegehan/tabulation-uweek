'use client'
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
              <div className="flex-1 p-8 ml-64">
                {children}
              </div>
          </ToastProvider>
        </SessionProvider>
      </SessionProvider>
    </div>
  )
}