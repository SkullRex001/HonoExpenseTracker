import { createFileRoute } from '@tanstack/react-router'

import Expenses from '@/pages/Expenses'

export const Route = createFileRoute('/_authenticated/expenses')({
  component: Expenses
})



