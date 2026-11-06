"use server"
import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { hash } from "bcryptjs"
import { db } from "@/db"
import { users } from "@/db/schema"

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", {
      username: String(formData.get("username") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/",
    })
  } catch (error) {
    if (error instanceof AuthError) redirect("/login?error=credentials")
    throw error
  }
}

import type { RegistrationState, RegistrationErrors } from "@/app/registration-state"

export async function registerAction(
  _previous: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    username: String(formData.get("username") ?? "").trim(),
  }
  const password = String(formData.get("password") ?? "")
  const confirmPassword = String(formData.get("confirmPassword") ?? "")
  const errors: RegistrationErrors = {}

  if (!values.name) errors.name = "Name is required."
  if (!/^[a-zA-Z0-9_]{4,32}$/.test(values.username)) {
    errors.username = "Use 4–32 letters, numbers, or underscores."
  }
  if (password.length < 8) errors.password = "Password must be at least 8 characters."
  if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match."
  if (Object.keys(errors).length) return { values, errors }

  const existing = await db.select({ id: users.id }).from(users)
    .where(eq(users.username, values.username)).limit(1)
  if (existing.length) return { values, errors: { username: "Username already taken." } }

  // Race-safe duplicate handling: the DB unique constraint remains authoritative.
  try {
    await db.insert(users).values({
      ...values,
      passwordHash: await hash(password, 12),
    })
  } catch (error) {
    const conflict = await db.select({ id: users.id }).from(users)
      .where(eq(users.username, values.username)).limit(1)
    if (conflict.length) return { values, errors: { username: "Username already taken." } }
    throw error
  }
  redirect("/login")
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" })
}
