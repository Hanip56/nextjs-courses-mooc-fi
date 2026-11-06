import Link from 'next/link'
import { loginAction } from '@/app/auth-actions'
export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string; registered?: string }> }) {
  const params = await searchParams
  return <main className="max-w-md"><h1 className="mb-5 text-2xl font-bold">Sign in</h1>
    {params.error && <p role="alert" className="mb-4 text-red-700">Invalid username or password.</p>}
    {params.registered && <p className="mb-4 text-green-700">Account created. Sign in below.</p>}
    <form action={loginAction} className="flex flex-col gap-3">
      <label>Username<input name="username" required autoComplete="username" className="block w-full rounded border p-2" /></label>
      <label>Password<input type="password" name="password" required autoComplete="current-password" className="block w-full rounded border p-2" /></label>
      <button className="rounded bg-blue-700 p-2 text-white">Sign in</button>
    </form><p className="mt-4">No account? <Link href="/register" className="underline">Register</Link></p>
  </main>
}
