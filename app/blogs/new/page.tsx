import { addBlog } from '../actions'
export default function NewBlog() {
  return <main><h1 className="mb-4 text-2xl font-bold">Create a blog</h1>
    <form action={addBlog} className="flex max-w-md flex-col gap-3">
      <label>Title<input name="title" required className="block w-full border p-2" /></label>
      <label>Author<input name="author" required className="block w-full border p-2" /></label>
      <label>URL<input name="url" type="url" required className="block w-full border p-2" /></label>
      <button className="rounded bg-blue-700 px-4 py-2 text-white" type="submit">Create</button>
    </form>
  </main>
}
