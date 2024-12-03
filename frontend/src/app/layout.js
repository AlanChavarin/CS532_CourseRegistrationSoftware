'use client'
import './globals.css'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import Navbar from './layoutComponents/Navbar'
import Footer from './layoutComponents/Footer'
import { UserProvider } from './context/UserContext'

import localFont from 'next/font/local'
  
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
})

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased flex flex-col min-h-screen bg-white text-black`}>
        <UserProvider>
          <Navbar />
          {children}
          <Footer />
        </UserProvider>
      </body>
    </html>
  )
}
