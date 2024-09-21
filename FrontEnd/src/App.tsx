
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { MoonLoader } from "react-spinners"


import type { AppType } from '../../routes/expenses'
import { hc } from "hono/client"

const client = hc<AppType>("/api/expenses")

import { useQuery } from "@tanstack/react-query"

const getTotalSpent = async () => {

  try {

    const response = await client["total-spent"].$get()
    const data = await response.json()
    return data
  }

  catch (error) {
    throw new Error("Server Error")
  }


}



function App() {

  const {data , isPending , error} = useQuery({
    queryKey: ["get-total-spent"],
    queryFn: getTotalSpent
  })





  return (
    <div className=" w-[calc(100vw - 1rem)] h-[100vh] flex flex-col items-center justify-center">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Total Spent</CardTitle>
            <CardDescription>The total amount you've spent</CardDescription>
          </CardHeader>
          <CardContent>
            
            <p>{isPending? <MoonLoader color="#FFFFFF" size={10} /> : error? "Request Failed!" : data.total} </p>
            {/* add red color to failed request */}
  
          </CardContent>
        </Card>
      </div>


    </div>
  )
}

export default App
