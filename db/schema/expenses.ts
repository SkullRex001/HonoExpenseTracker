
import {numeric,  pgTable, serial, index , timestamp , date , text} from 'drizzle-orm/pg-core';
import {z} from 'zod'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';



export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  userId : text("userId").notNull(),
  title : text("title").notNull(),
  amount : numeric("amount" , {precision: 12 , scale : 2}).notNull(),
  date : date("date").notNull(),
  createdAt : timestamp('createdAt').defaultNow()
}, (expenses) => {
  return {
    nameIndex: index('name_idx').on(expenses.userId),
  }
});


export const insertExpenseSchema = createInsertSchema(expenses , {
    title: z.string().min(3, {
        message: "Title too short"
    }),
    amount: z.string().regex(/^[0-9]+(\.[0-9]+)?$/, {
      message: "Enter a postitve number"
    })
});

export const selectExpenseSchema = createSelectSchema(expenses);