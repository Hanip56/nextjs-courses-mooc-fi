import type { ReactNode } from 'react'
import Link from 'next/link'
import './globals.css'
export const metadata = { title: 'Blog App', description: 'Full Stack Open Next.js exercises' }
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body className="mx-auto max-w-3xl p-8 text-slate-900">
    <nav className="mb-8 flex gap-5 border-b pb-4"><Link href="/">Home</Link><Link href="/blogs">Blogs</Link><Link href="/blogs/new">New blog</Link></nav>
    {children}
  </body></html>
}
