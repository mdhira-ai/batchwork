import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";

const FileinfoTable = ({ data ,version}: any) => {
    async function deletefile(id: any) {
        // delete from db
        const f = await fetch('/api/deleteid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        })

        if (!f.ok) {
            throw new Error(`HTTP error! status: ${f.status}`);
        }
        else {
            const d = await f.json();
            console.log("File deleted successfully", d)
        }

        window.location.reload();
    }

    return (
        <>
            <Table>
                <TableCaption>
                    Batchfile - Version: {version} <br/>
                    {data.length ? "A list of Batchfile" : "No Batchfile found"}
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="">id</TableHead>
                        <TableHead>filepath</TableHead>
                        {/* <TableHead className="">updatedAt</TableHead> */}
                        <TableHead className="text-end">status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item: any, index: number) => {
                        return (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell className="max-w-xs overflow-hidden text-wrap">
                                    {item.filepath}
                                </TableCell>
                                {/* <TableCell className="">
                                    {item?.updatedAt?.toDateString()}
                                </TableCell> */}
                                <TableCell className="text-end">
                                    <Button
                                        onClick={() => deletefile(item.id)}
                                        variant={"outline"}
                                        size="icon"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
};

export default FileinfoTable;
