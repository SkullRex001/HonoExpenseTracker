import { z } from "zod";
import { insertExpenseSchema } from "./db/schema/expenses";

// export const createPostSchema = z.object({
//     title : z.string().min(3).max(100),
//     amount : z.string().regex(/^[0-9]+(\.[0-9]+)?$/, {
//         message: "Enter a postitve number"
//       })
// })
export const createPostSchema = insertExpenseSchema.omit({
    userId : true,
    createdAt : true,
    id : true
})

export const expenseSchema = z.object({
    id : z.number().int().positive(),
    title : z.string().min(3).max(100),
    amount : z.number().positive().int()
})

export type Expense = z.infer<typeof expenseSchema>

// use this both in backend and frontend in next version