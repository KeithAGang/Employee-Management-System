import { ResetPasswordForm } from '@/components/reset-pass'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/passreset')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ResetPasswordForm />
  )
}
