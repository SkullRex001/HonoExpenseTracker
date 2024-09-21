import { Link } from '@tanstack/react-router'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Skeleton } from "@/components/ui/skeleton"




import { useQuery } from "@tanstack/react-query"
import { userQueryOptions } from "@/lib/api"


const RouteNav = () => {
    return (
        <>
        <div className="p-5 flex justify-between mr-4">
            <div className='flex gap-10'>
            <Link to="/" className="[&.active]:font-bold">
                Home
            </Link>{' '}
            <Link to="/expenses" className="[&.active]:font-bold">
                Expenses
            </Link>{' '}
            <Link to="/create" className="[&.active]:font-bold">
                Create
            </Link>{' '}
            <Link to="/profile" className="[&.active]:font-bold">
                Profile
            </Link>{' '}
            </div>
            <div>
                <DropDownMenu />
            </div>
        </div>
        </>
    )
}

export default RouteNav

const DropDownMenu = () => {

    const { data, isPending } = useQuery(userQueryOptions)
    //error handling left
    console.log(data)

    const handleLogout = (e:any) => {
        e.preventDefault();
        window.location.href = '/api/logout';
      
      };


 


    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>{
                   isPending? <AvataarSkeleton/>:<Avataar/>
                    }</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Hii ,  {data?.user? data.user.given_name : "Unknown"}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                    
            
                </DropdownMenuContent>
            </DropdownMenu>


        </>
    )
}


const Avataar = () => {


    return (
        <Avatar >
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>

    )
}
const AvataarSkeleton = () => {


    return (
        <Avatar >
            <Skeleton className="h-12 w-12 rounded-full" />
        </Avatar>

    )
}