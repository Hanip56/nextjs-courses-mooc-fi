import Homepage from './homepage.mdx'

// The content comes from a local MDX file and is statically rendered.
export default function Home() {
  return (
    <main className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
      <div className="markdown-home"><Homepage /></div>
    </main>
  )
}
