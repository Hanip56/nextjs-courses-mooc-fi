import Link from "next/link"
import { RegistrationForm } from "./registration-form"

export default function Register() {
  return (
    <main className="max-w-md">
      <h1 className="mb-5 text-2xl font-bold">Create account</h1>
      <RegistrationForm />
      <p className="mt-4">Have an account? <Link href="/login" className="underline">Sign in</Link></p>
    </main>
  )
}
