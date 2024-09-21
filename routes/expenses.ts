import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator';
import { createPostSchema} from "../validationTypes";
import { getUser } from "../kinde";
import { db } from "../db";
import { expenses as expensesTable } from "../db/schema/expenses";
import { and, desc, eq, sum } from "drizzle-orm";
import { insertExpenseSchema } from "../db/schema/expenses";

export const expensesRoute = new Hono();


const route = expensesRoute.get('/', getUser, async (c) => {
    const user = c.var.user //is this sotored in local variable , if yes , i should not use it to get the user , otherwise this local variable will change as the new user login
    // I think I should req the cookie and make database call from it

    const expense = await db.select().from(expensesTable).where(eq(expensesTable.userId, user.id)).orderBy(desc(expensesTable.createdAt))
    //i think i will add pagination here with .limit

    console.log(expense)


    return c.json({ expense })
}).post('/', getUser, zValidator("json", createPostSchema), async (c) => {
    const user = c.var.user

    const expense = await c.req.valid("json");
    const finalExpense = {...expense ,  userId: user.id}
  
    const validatedExpense = insertExpenseSchema.parse(finalExpense)

    const result = await db.insert(expensesTable).values(validatedExpense).returning().then((res)=> res[0])

    console.log(result)
    c.status(201)
    return c.json(result)

}).get("/:id{[0-9]+}", getUser, async (c) => {

    //route not used in frontend
    const id = Number.parseInt(c.req.param("id"))
    const user = c.var.user;

    const expense = await db.select().from(expensesTable).where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id))).then(res => res[0])

    if (!expense) {
        return c.notFound()
    }

    return c.json({ expense })



}).get("/total-spent", getUser, async (c) => {
    const user = c.var.user;
    const total = await db.select({ total: sum(expensesTable.amount) }).from(expensesTable).where(eq(expensesTable.userId, user.id)).then(res => res[0])
    return c.json(total)
}).delete("/:id{[0-9]+}", getUser, async (c) => {

    
    const id = Number.parseInt(c.req.param("id"))
    const user = c.var.user;

    const expense = await db.delete(expensesTable).where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id))).returning().then(res => res[0])
     console.log("Deleted Expense:-")
    console.log(expense)

    if (!expense) {
        throw new Error("Expense not found!")
    
    }

    return c.json({ expense })



});

export type AppType = typeof route