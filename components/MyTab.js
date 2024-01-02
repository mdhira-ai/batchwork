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
import { FcDeleteDatabase } from "react-icons/fc";


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

            const mappedData = Object.entries(res).map(([file_name, item]) => {
                if (file_name !== 'startup') {
                    return {
                        file_name,
                        size: item.size,
                        checked: item.status,
                        path: item.path
                    };
                }
            }).filter(Boolean);

            setdata(mappedData);

        })




    }, []);

    useEffect(() => {

        window.electronAPI.on('msg', (e, d) => {
            alert(d)

        })

    }, [])




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

    function handleRemoveClicked(item) {
        const newData = [...data];
        const index = newData.findIndex((d) => d.file_name === item.file_name);
        newData.splice(index, 1);
        setdata(newData);

        window.electronAPI.send('removefile', {
            file_name: item.file_name,
        })
    }


    return (
        <>
            <Table>
                <TableHeader className=''>
                    <TableRow className=''>
                        <TableHead className='pl-5'>File name</TableHead>
                        <TableHead className="text-center">Size</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">Action</TableHead>
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

                            <TableCell className="text-center">
                                <div className="flex flex-col items-center">

                                    <FcDeleteDatabase
                                        onClick={() => handleRemoveClicked(item)}

                                        className="cursor-pointer"
                                        size={24}

                                    />

                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="bg-transparent w-screen flex flex-col pr-4 items-end mt-4">
                <button
                    className="bg-fuchsia-600 px-4 py-3 text-white w-44 hover:bg-slate-700"
                    onClick={handleButtonClick}
                >
                    Run as startup
                </button>
            </div>
        </>
    );
}

export default MyTab;