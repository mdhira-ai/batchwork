'use client'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react";


const MyTab = ({
    children,
    ...props
}) => {


    const [data, setdata] = useState([])

    useEffect(() => {
        if (props.data) {
            setdata(
                props.data.map((item, index) => {
                    return {
                        file_name: item.file_name,
                        size: item.size,
                        checked: false,
                        path: item.path
                    }
                })
            )
        }
    }, [props.data])



    useEffect(() => {
        window.electronAPI.invoke('store').then(res => {

            const mappedData = Object.entries(res).map(([file_name, item]) => ({
                file_name,
                size: item.size,
                checked: item.status,
                path: item.path
            }));

            setdata(mappedData)

        })




    }, []);

    useEffect(() => {

        window.electronAPI.on('msg' , (e,d ) => {
           alert(d)
        
        })

    },[])




    async function inputfile(e) {
        const file = e.target.files[0].name
        console.log(file)
    }



    function handleButtonClick() {
        const selectedData = data.filter(item => item);


        for (let i in selectedData) {
            window.electronAPI.send('runfile', {
                path: selectedData[i].path,
                file_name: selectedData[i].file_name,
                size: selectedData[i].size,
                status: selectedData[i].checked
            })

        }
        // if (selectedData.length === 0) {
        //     alert('Select any of the file')
        // }
        // else {


        // }

    }

    return (
        <>
            <Table>
                <TableHeader className=''>
                    <TableRow className=''>
                        <TableHead className='pl-5'>File name</TableHead>
                        <TableHead className="text-center">Size</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">
                                <div className="flex items-center">
                                    <div className="ml-4">{item.file_name}</div>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <div className="text-sm text-gray-500">{item.size}</div>
                            </TableCell>
                            <TableCell className="text-center">
                                <div className="text-sm text-gray-500">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox text-indigo-600 rounded-full"
                                        checked={item.checked}
                                        onChange={() => {
                                            const newData = [...data];
                                            newData[index].checked = !newData[index].checked;
                                            setdata(newData);
                                        }}

                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="bg-transparent w-screen flex flex-col pr-4 items-end mt-4">
                <button
                    className="bg-black px-4 py-3 text-white w-44 hover:bg-slate-700"
                    onClick={handleButtonClick}
                >
                    Run as startup
                </button>
            </div>
        </>
    );
}

export default MyTab;