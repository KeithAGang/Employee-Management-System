import { UnpromotedManagersList } from '@/components/unpromoted-managers-list'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/manager/promote')({
  component: RouteComponent,
})

function RouteComponent() {
  return <UnpromotedManagersList />
}
