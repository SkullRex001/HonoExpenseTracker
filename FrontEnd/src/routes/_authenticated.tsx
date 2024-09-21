import { createFileRoute, Outlet } from '@tanstack/react-router'
import { userQueryOptions } from '@/lib/api'

const Login = () => {
  return (
    <>
    <div>You have to login</div>
    <a href="/api/login">Login</a>
    </>
  )
}

const Component = () => {
  const { user } = Route.useRouteContext();


  if (!user) {
    return <Login />

  }

  return <Outlet />


}

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    try {
      const queryClient = context.queryClient
      const data = await queryClient.fetchQuery(userQueryOptions)
      console.log(data)
      return data
    } catch (error) {

      console.log(error)
      return { user: null }


    }
  },
  component: Component
})