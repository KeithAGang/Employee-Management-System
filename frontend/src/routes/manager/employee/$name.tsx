import { EmployeeProfileCard } from '@/components/employee-profile';
import { createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/manager/employee/$name')({
  component: RouteComponent,
})

function RouteComponent() {
    const email = Route.useParams().name;
  return <EmployeeProfileCard subordinateEmail={email}/>
}
