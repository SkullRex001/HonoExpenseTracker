import RouteNav from '@/components/RouteNav'
import { Outlet  , createRootRouteWithContext} from '@tanstack/react-router'
import { Toaster } from "@/components/ui/sonner"
import { type QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
    queryClient  : QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: () => (
        <>

            <RouteNav />

            <Outlet />

            <Toaster />


        </>
    ),
})
