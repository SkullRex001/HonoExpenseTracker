import Create from '@/pages/Create'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/create')({
  component: Create
})