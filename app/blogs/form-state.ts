export type BlogFormValues = { title: string; author: string; url: string }
export type BlogFormErrors = Partial<Record<keyof BlogFormValues, string>>
export type BlogFormState = { errors: BlogFormErrors; values: BlogFormValues }

export const initialBlogFormState: BlogFormState = {
  errors: {},
  values: { title: "", author: "", url: "" },
}
