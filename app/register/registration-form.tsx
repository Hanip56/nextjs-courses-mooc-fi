"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { registerAction } from "@/app/auth-actions"
import { initialRegistrationState, type RegistrationValues } from "@/app/registration-state"
import { useNotification } from "@/components/notification-provider"

export function RegistrationForm() {
  const [state, action, pending] = useActionState(registerAction, initialRegistrationState)
  const [values, setValues] = useState<RegistrationValues>(initialRegistrationState.values)
  const { notify } = useNotification()
  const lastState = useRef(state)
  useEffect(() => {
    if (lastState.current !== state && Object.keys(state.errors).length > 0) {
      notify("Please correct the registration form.", "error")
    }
    lastState.current = state
  }, [state, notify])

  return (
    <form action={action} noValidate className="flex flex-col gap-3">
      {(["name", "username"] as const).map((key) => (
        <label key={key} className="block">
          <span className="block font-medium">{key === "name" ? "Name" : "Username"}</span>
          <input name={key} value={values[key]}
            onChange={(e) => setValues((old) => ({ ...old, [key]: e.target.value }))}
            autoComplete={key === "name" ? "name" : "username"}
            aria-invalid={Boolean(state.errors[key])}
            aria-describedby={state.errors[key] ? `${key}-error` : undefined}
            className="mt-1 block w-full rounded border p-2" />
          {state.errors[key] && <span role="alert" data-testid={`${key}-error`} id={`${key}-error`} className="text-sm text-red-700">{state.errors[key]}</span>}
        </label>
      ))}
      <label className="block">Password
        <input type="password" name="password" autoComplete="new-password" className="mt-1 block w-full rounded border p-2"
          aria-invalid={Boolean(state.errors.password)} aria-describedby={state.errors.password ? "password-error" : undefined} />
        {state.errors.password && <span role="alert" id="password-error" className="text-sm text-red-700">{state.errors.password}</span>}
      </label>
      <label className="block">Confirm Password
        <input type="password" name="confirmPassword" autoComplete="new-password" className="mt-1 block w-full rounded border p-2"
          aria-invalid={Boolean(state.errors.confirmPassword)} aria-describedby={state.errors.confirmPassword ? "confirmPassword-error" : undefined} />
        {state.errors.confirmPassword && <span role="alert" data-testid="passwordConfirm-error" id="confirmPassword-error" className="text-sm text-red-700">{state.errors.confirmPassword}</span>}
      </label>
      <button data-testid="register-button" disabled={pending} type="submit" className="rounded bg-blue-700 p-2 text-white disabled:opacity-60">
        {pending ? "Creating account..." : "Register"}
      </button>
    </form>
  )
}
