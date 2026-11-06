"use server"

import { randomUUID } from "node:crypto"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/db"
import { users } from "@/db/schema"

export async function generateToken() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  await db.update(users).set({ token: randomUUID() }).where(eq(users.id, session.user.id))
  revalidatePath("/me")
}
