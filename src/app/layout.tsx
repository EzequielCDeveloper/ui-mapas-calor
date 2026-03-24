import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Chapitos Gym',
  description: 'Sistema de gestión de membresías — Chapitos Gym',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className="bg-black-900 text-white antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: '#1A1A1A',
              border: '1px solid #2A2A2A',
              color: '#FFFFFF',
            },
          }}
          richColors
        />
      </body>
    </html>
  )
}
