'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createBlog, likeBlog } from '@/lib/blogs'
export async function addBlog(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  const author = String(formData.get('author') ?? '').trim()
  const url = String(formData.get('url') ?? '').trim()
  if (!title || !author || !url) throw new Error('All fields are required')
  await createBlog({ title, author, url })
  revalidatePath('/blogs')
  redirect('/blogs')
}
export async function likeBlogAction(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  await likeBlog(id)
  revalidatePath('/blogs')
  revalidatePath(`/blogs/${id}`)
}
