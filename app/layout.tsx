import './globals.css'
import type { Metadata } from 'next'
import BaseProvider from '@/components/providers/BaseProvider'
import { appInfo } from '@/config/appInfo'

export const metadata: Metadata = {
  title: appInfo.title,
  description: appInfo.description
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <BaseProvider>
          {children}
        </BaseProvider>
      </body>
    </html>
  )
}
