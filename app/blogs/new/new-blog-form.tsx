"use client"

import { useActionState, useState } from "react"
import { addBlog } from "../actions"
import { initialBlogFormState, type BlogFormValues } from "../form-state"

export function NewBlogForm() {
  const [state, formAction, pending] = useActionState(addBlog, initialBlogFormState)
  // Controlled inputs preserve their contents after failed Server Action submissions.
  const [values, setValues] = useState<BlogFormValues>(initialBlogFormState.values)

  const fields = ["title", "author", "url"] as const
  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {fields.map((field) => (
        <label key={field} className="block">
          <span className="mb-1.5 block text-sm font-semibold capitalize text-slate-700">{field}</span>
          <input
            name={field}
            id={field}
            type={field === "url" ? "url" : "text"}
            value={values[field]}
            onChange={(event) =>
              setValues((current) => ({ ...current, [field]: event.target.value }))
            }
            aria-invalid={Boolean(state.errors[field])}
            aria-describedby={state.errors[field] ? `${field}-error` : undefined}
            className={`block w-full rounded-lg border bg-white px-3 py-2.5 outline-offset-2 focus:border-blue-600 ${state.errors[field] ? "border-red-600" : "border-slate-300"}`}
          />
          {state.errors[field] && (
            <span id={`${field}-error`} role="alert" className="mt-1 block text-sm text-red-700">
              {state.errors[field]}
            </span>
          )}
        </label>
      ))}
      <button disabled={pending} className="self-start rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60" type="submit">
        {pending ? "Creating..." : "Create"}
      </button>
    </form>
  )
}
