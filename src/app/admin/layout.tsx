import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Panel | Portfolio',
  description: 'Portfolio content management system',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950">
      {children}
    </div>
  )
}
