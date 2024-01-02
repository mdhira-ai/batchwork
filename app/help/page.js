
'use client'

import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"
import React from "react"




const page = () => {

    const [checkval, setcheckval] = useState()


    useEffect(() => {

        window.electronAPI.invoke('isstartup').then(res => {
            setcheckval(res)
            console.log(res)
        
        })

      
    }, [])
    


    function check(){
        if (checkval == true) {
            setcheckval(false)
            console.log(checkval)
            window.electronAPI.send('startup',false)
        } else {
            setcheckval(true)
            console.log(checkval)
            window.electronAPI.send('startup',true)

        }



        
    }

    return (
        <div className="flex flex-col container  h-screen">

            <div className="flex flex-col mt-4">
                <h2 className="text-2xl font-bold">General</h2>

                {/* make a separator */}
                <hr className="my-3 border-gray-500 dark:border-white" />
                <div className="flex flex-row mt-4 justify-between items-center">
                    <h3 className="text-xl ">   Run on startup</h3>
                   
                    <Switch

                        checked={checkval}
                        onCheckedChange={check}

                    />
                </div>

            </div>

        </div>

    )
}
export default page;