import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getStoredUser } from "./lib/auth";
import "./index.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { routeTree } from "./routeTree.gen"

const router = createRouter({
  routeTree,
  context: {
    user: null,
  },
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <RouterProvider 
        router={router} 
        context={{ 
          user: getStoredUser()
        }}
        />
    </ThemeProvider>
  </StrictMode>
)
