import type { AppType } from "../../../routes/auth"
import { hc } from "hono/client"
import { createPostSchema } from "../../../validationTypes"
import {z} from 'zod'
const client = hc<AppType>("/api")

import { queryOptions } from "@tanstack/react-query"

const getCurrentUser = async () => {

  try {

    const response = await client.me.$get()
    const data = await response.json()
    return data
  }

  catch (error) {
    throw new Error("Server Error")
  }


}


export const userQueryOptions = queryOptions({
    queryKey : ["get-current-use"],
    queryFn : getCurrentUser,
 
})

//I have cached it becasue there is no feature to chnage profile yet




import type { AppType  as AppType2 } from '../../../routes/expenses'


const client2 = hc<AppType2>("/api/expenses")

export const getTotalSpent = async () => {

  try {

      const response = await client2.index.$get()
      const data = await response.json()
      return data

  }

  catch (error) {
      throw new Error("Server Error")
  }


}


export const getAllExpensesOptions = queryOptions({
  queryKey: ["get-all-expense"],
  queryFn: getTotalSpent,
  staleTime : 1000*60*5
})


export const loadingCreateExpenseQueryOptions = queryOptions<{expense?:  z.infer<typeof createPostSchema>}>({
  queryKey : ['loading-create-expense'],
  queryFn : async ()=>{
    return {}
  },
  staleTime : Infinity
})

export const deleteExpense = async ({id} : {id : number}) =>{

try {
  const res = await client2[":id{[0-9]+}"].$delete({
    param : {
      id : id.toString()
    }
  })
  if(!res.ok) {
    throw new Error("Cannot find expense")
  }
  return res
  
} catch (error) {

  console.log(error)

  throw new Error("server error")
  
}

 

}