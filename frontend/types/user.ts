import type { UserRole } from './enums'

export { UserRole } from './enums'

export type User = {
  id: string
  email: string
  name: string
  company: string
  role: UserRole
}
