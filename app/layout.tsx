import type { ReactNode } from "react"
import Link from "next/link"
import { auth } from "@/auth"
import { logoutAction } from "@/app/auth-actions"
import { NotificationProvider } from "@/components/notification-provider"
import "./globals.css"

export const metadata = { title: "Blog App", description: "Full Stack Open Next.js exercises" }
const navLink = "rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white focus-visible:outline-2 focus-visible:outline-white"

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  return <html lang="en"><body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
    <nav className="bg-slate-900 text-white" aria-label="Main navigation">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-3 sm:px-6">
        <Link href="/" className="mr-4 text-lg font-bold tracking-tight">Blog App</Link>
        <Link href="/blogs" className={navLink}>Blogs</Link>
        <Link href="/users" className={navLink}>Users</Link>
        {session?.user ? <>
          <Link href="/blogs/new" className={navLink}>Create new</Link>
          <Link href="/me" className={navLink}>Me</Link>
          <div className="ml-auto flex items-center gap-3"><span className="hidden text-sm text-slate-300 sm:inline">{session.user.name}</span>
            <form action={logoutAction}><button className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold hover:bg-rose-700">Logout</button></form></div>
        </> : <div className="ml-auto flex gap-2"><Link href="/login" className={navLink}>Sign in</Link><Link href="/register" className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold hover:bg-blue-700">Register</Link></div>}
      </div>
    </nav>
    <NotificationProvider><div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">{children}</div></NotificationProvider>
  </body></html>
}
