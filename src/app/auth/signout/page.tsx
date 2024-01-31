import { options } from "@/app/api/auth/[...nextauth]/options"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export const Signout  = ()=>{
    async function handleClick(){
      await  signOut()
    }
    
    return (
        <div className="h-screen flex justify-center items-center w-full">
            <Button className="px-4" onClick={handleClick}>Sign Out</Button>
        </div>
    )
}