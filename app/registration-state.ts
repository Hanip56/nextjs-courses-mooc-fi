export type RegistrationValues = { name: string; username: string }
export type RegistrationErrors = Partial<Record<"name" | "username" | "password" | "confirmPassword", string>>
export type RegistrationState = { values: RegistrationValues; errors: RegistrationErrors }
export const initialRegistrationState: RegistrationState = {
  values: { name: "", username: "" },
  errors: {},
}
