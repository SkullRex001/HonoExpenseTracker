
import { Skeleton } from "@/components/ui/skeleton"

import { MdDelete } from "react-icons/md";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { MoonLoader } from "react-spinners"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { deleteExpense, getAllExpensesOptions, loadingCreateExpenseQueryOptions } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner";




const Expenses = () => {

    const { data, isPending, error } = useQuery(getAllExpensesOptions)

    const { data: loadingCreateExpense } = useQuery(loadingCreateExpenseQueryOptions)



    return (
        <div className='p-2 max-w-3xl m-auto'>

            <Table>
                <TableCaption>A list of your spendings.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Id</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Delete</TableHead>
                    </TableRow>
                </TableHeader>
                {loadingCreateExpense?.expense && (
                    <TableRow>
                        <TableCell className="font-medium"><Skeleton className="h-4" /></TableCell>
                        <TableCell><Skeleton className="h-4" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 " /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 " /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 " /></TableCell>
                    </TableRow>

                )}
                {isPending ? (Array(3).fill(0).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium"><Skeleton className="h-4" /></TableCell>
                        <TableCell><Skeleton className="h-4" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 " /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 " /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 " /></TableCell>
                    </TableRow>

                ))) : error ? (<p> "something Went wrong" </p>) : (<TableBody>{(data.expense.map((item, index) =>
                (<TableRow key={index}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell className="text-right">${item.amount}</TableCell>
                    <TableCell className="text-right">
                        <ExpenseDeleteButton id={item.id}/>
                    </TableCell>
                </TableRow>
                )
                ))}
                </TableBody>)}

            </Table>

        </div>
    )
}

export default Expenses

function ExpenseDeleteButton({id}: {id: number}) {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn : deleteExpense,
        onError: ()=>{

            toast("Error" , {
                description : `Failed to delete expense ${id}⚠️`
            })

        },
        onSuccess : ()=>{

            queryClient.setQueryData(getAllExpensesOptions.queryKey , (existingExpense)=> ({
                existingExpense,
                expense : existingExpense!.expense.filter((e)=>e.id !== id)
            }))


            toast("Success" , {
                description : `Successfully deleted expense ${id}😊`
            })

        }
    })
    return (
        <Button variant="outline" size="icon" onClick={()=> mutation.mutate({id})}  disabled = {mutation.isPending}>
            {
                mutation.isPending ? <MoonLoader color="#FFFFFF" size={10} />: <MdDelete className="h-4 w-4" color="#5d0101" />
            }
        </Button>
    )
}