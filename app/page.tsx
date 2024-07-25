"use client";
import { Button } from "@/components/ui/button";
// import prisma from  "@/lib/db";
import { useEffect, useState } from "react";
import FileinfoTable from "@/components/FileinfoTable";
import { RefreshCcw, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

export interface dprop {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  filepath: string;
}

const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { toast } = useToast();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [data, setData] = useState<dprop[]>([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [version, setversion] = useState<any>()

  const fetchData = async () => {
    const res = await fetch('/api/getallinfo',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const d = await res.json();

    if (d !== null) {
      console.log(d);
      setData(d);
      toast({
        title: "Data fetched successfully",
        description: "You can now see the file information.",
        duration: 5000,
      });
    } else {
      toast({
        title: "Error fetching data",
        description: "Please check your internet connection and try again.",
        duration: 5000,
      });
    }
  };

  function getversion(){
    console.log('version')
    if (typeof window!== 'undefined' && 'electronAPI' in window) {
      const d = (window as any).electronAPI.getVersion()
      setversion(d)
    }
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    getversion()
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fileOpen() {
    console.log("file");
    if (typeof window !== "undefined" && "electronAPI" in window) {
      (window as any).electronAPI.opendialog();
    }
  }

  return (
    <div className="flex  h-screen w-screen flex-col items-center p-5">
      <div className="flex flex-row justify-between w-full items-center gap-3">
        <div>
          <Link
            href="/settings"
          >
            <Button
              variant={'outline'}
              size={'icon'}
            >

              <Settings
                className="cursor-pointer h-5 w-5"

              />
            </Button>
          </Link>
        </div>
        <div
          className="flex flex-row items-center gap-3"
        >

          <h1>Batch file</h1>
          <Button onClick={() => fileOpen()} variant={"outline"}>
            open
          </Button>

          <Button variant="outline" size={"icon"}>
            <RefreshCcw className="h-5 w-5" onClick={() => fetchData()} />
          </Button>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <FileinfoTable version={version}  data={data} />
      </div>
    </div>
  );
};

export default page;
