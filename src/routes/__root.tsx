import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import NotFoundPage from "@/components/ui/Layout/NotFoundPage/notfoundpage"
import type { MyRouterContext } from "@/types/router.types"

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
    </>
  ),
  notFoundComponent: () => <NotFoundPage />,
})

