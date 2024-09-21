import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { createPostSchema } from "../../../validationTypes"
import { cn } from "@/lib/utils"
import type { AppType } from '../../../routes/expenses'
import { hc } from "hono/client"
import { MoonLoader } from "react-spinners"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { getAllExpensesOptions } from "@/lib/api"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { loadingCreateExpenseQueryOptions } from "@/lib/api"
import { toast } from "sonner"
const client = hc<AppType>("/api/expenses")



// const formSchema = z.object({
//     title: z.string().min(3, {
//         message: "Title too short"
//     }).max(100, {
//         message: 'Title too long'
//     }),
//     amount: z.coerce.number({
//         message: "Enter a number"
//     }).positive({
//         message: 'Enter postive number'
//     })

// })
// const formSchema = z.object({
//     title: z.string().min(3, {
//         message: "Title too short"
//     }).max(100, {
//         message: 'Title too long'
//     }),
//     amount: z.string().regex(/^[0-9]+(\.[0-9]+)?$/, {
//         message: "Enter a postitve number"
//       })

// })

const getTotalSpent = async (values: z.infer<typeof createPostSchema>) => {

    try {

        const response = await client.index.$post({
            json: values

        })
        const data = await response.json()
        return data
    }

    catch (error) {
        throw new Error("Server Error")
    }


}



import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"




const Create = () => {

    const navigate = useNavigate()

    const queryClient = useQueryClient()

    const [isPending, setIsPending] = useState<undefined | boolean>()
    const [error, setError] = useState<null | string>(null)
    // const [popoverOpen, setPopoverOpen] = useState<boolean>(false);


    const form = useForm<z.infer<typeof createPostSchema>>({
        resolver: zodResolver(createPostSchema),
        defaultValues: {
            title: "",
            amount: "",
            date: new Date().toISOString()
        },
    })

    async function onSubmit(values: z.infer<typeof createPostSchema>) {

        setIsPending(true)

        try {
  
            const existingExpenses = await queryClient.ensureQueryData(getAllExpensesOptions)

            queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey , { expense : values})

            navigate({to : '/expenses'})
            await new Promise((r)=> setTimeout(r , 3000))
            const data = await getTotalSpent(values);
            setError(null)

            toast("Expense Created", {
                description: "Your expense has created successfully😊.",
              })
          //to get cache data if user hasent already visited expense page , by making a fetch request
            queryClient.setQueryData(getAllExpensesOptions.queryKey ,({
                ...existingExpenses.expense,
                expense : [data , ...existingExpenses.expense ]
            }) )
            
           

        } catch (error) {
            setIsPending(false);
            setError("Something Went Wrong")
            toast("Error", {
                description: "Failed to create new expense⚠️.",
              })
        } finally {
            setIsPending(false)
            queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey , {})
            form.reset()
        }



    }


    return (
        <div className='p-2 max-w-3xl m-auto'>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="eg :- Burger" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Money spent on?
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <Input placeholder="eg :- 20" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Amount spent?
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date of birth</FormLabel>
                                <Popover >
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={new Date(field.value)}
                                            onSelect={(date)=>{
                                                field.onChange(format(date ?? new Date(), 'yyyy-MM-dd'));
                                            }}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>
                                    Your date of birth is used to calculate your age.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {error}
                    <Button type="submit" disabled={isPending}>{isPending ? <MoonLoader color="#000000" size={10} /> : "Submit"}</Button>
                </form>
            </Form>

        </div>
    )
}

export default Create