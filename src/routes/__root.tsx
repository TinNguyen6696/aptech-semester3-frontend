import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import NotFoundPage from "@/components/ui/Layout/NotFoundPage/notfoundpage"
export interface MyRouterContext {
  user: {
    userName: string
    skillLevel: string
    role: string
    provinceName: string
    provinceId: number
    primaryCategory: string
    phoneNumber: string
    lastName: string
    firstName: string
    email: string
    bio: string
    id: number
  } | null
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
  notFoundComponent: () => <NotFoundPage />,
})

