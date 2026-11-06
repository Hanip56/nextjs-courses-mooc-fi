import type { MDXComponents } from 'mdx/types'

// Next.js App Router's MDX integration requires this component map.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components }
}
