import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { expensesRoute } from './routes/expenses';
import { serveStatic } from 'hono/bun'
import {authRoute} from './routes/auth'
const app = new Hono();


app.use('*' , logger());



app.basePath("/api").route('/expenses' , expensesRoute ).route('/' , authRoute )

app.get('*', serveStatic({ root: "FrontEnd/dist" }))

app.get('*', serveStatic({ path: "FrontEnd/dist/index.html" }))

export default app;




