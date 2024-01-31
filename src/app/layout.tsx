import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from './components/Navbar'
import AuthProvider from './context/AuthProvider'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {/* <Navbar /> */}
          <main className="flex justify-center items-start bg-zinc-800  min-h-screen">
            {children}
          </main>
        </AuthProvider>
            <Toaster/>
      </body>
    </html>
  )
}
