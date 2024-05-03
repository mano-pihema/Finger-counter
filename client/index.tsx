
import  { createRoot } from 'react-dom/client'
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { routes } from './routes'


const queryClient = new QueryClient()

const router = createBrowserRouter(routes)
const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router}/>
  </QueryClientProvider>

)
