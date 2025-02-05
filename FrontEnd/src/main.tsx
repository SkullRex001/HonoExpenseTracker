import React from 'react'
import { ThemeProvider } from "@/components/theme-provider"
import ReactDOM from 'react-dom/client'


import './index.css'
import {
  QueryClient , QueryClientProvider
  
} from '@tanstack/react-query'

import { routeTree } from './routeTree.gen'

import { RouterProvider, createRouter } from '@tanstack/react-router'

const queryClient = new QueryClient()

const router = createRouter({ routeTree , context : {queryClient} })


declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
