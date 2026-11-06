"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { createBlog, likeBlog } from "@/lib/blogs"

import type { BlogFormState, BlogFormValues, BlogFormErrors } from "./form-state"

export async function addBlog(
  _previousState: BlogFormState,
  formData: FormData,
): Promise<BlogFormState> {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const values: BlogFormValues = {
    title: String(formData.get("title") ?? "").trim(),
    author: String(formData.get("author") ?? "").trim(),
    url: String(formData.get("url") ?? "").trim(),
  }
  const errors: BlogFormErrors = {}
  for (const field of ["title", "author", "url"] as const) {
    if (values[field].length < 5) {
      errors[field] = `${field[0].toUpperCase()}${field.slice(1)} must contain at least 5 characters.`
    }
  }
  // Retain the URL correctness check from the previous version.
  if (!errors.url) {
    try {
      const parsed = new URL(values.url)
      if (!["https:", "http:"].includes(parsed.protocol)) throw new Error("Invalid protocol")
    } catch {
      errors.url = "Enter a valid http:// or https:// URL."
    }
  }

  if (Object.keys(errors).length > 0) return { errors, values }

  await createBlog({ ...values, userId: session.user.id })
  revalidatePath("/blogs")
  revalidatePath("/users")
  revalidatePath("/me")
  redirect("/blogs")
}

export async function likeBlogAction(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  await likeBlog(id)
  revalidatePath("/blogs")
  revalidatePath(`/blogs/${id}`)
}
