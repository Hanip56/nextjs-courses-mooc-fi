import { NewBlogForm } from "./new-blog-form"
export default async function NewBlog() {
  return <main className="mx-auto max-w-2xl space-y-6">
    <header><p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Contribute</p>
      <h1 className="text-3xl font-bold tracking-tight">Create a blog</h1>
      <p className="mt-1 text-slate-500">Share a new blog with the community.</p></header>
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><NewBlogForm /></div>
  </main>
}
