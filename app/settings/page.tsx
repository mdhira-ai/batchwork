"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { ArrowBigLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page = () => {
  const { toast } = useToast();
  const [checked, setChecked] = useState<boolean>();

  function startup() {
    toast({
      title: "Startup settings saved successfully!",
    });
    setChecked(!checked);
    if (typeof window !== "undefined" && "electronAPI" in window) {
      (window as any).electronAPI.send("startup", checked ? false : true);
    }
  }
  async function check() {
    if (typeof window !== "undefined" && "electronAPI" in window) {
      const d = await (window as any).electronAPI.getstartup();
      setChecked(d);
    }
  }

  useEffect(() => {
    check();
  }, []);

  return (
    <div className="flex flex-col p-5 gap-2">
      <Link href="/">
        <Button variant="outline" size="icon">
          <ArrowBigLeft className="h-5 w-5" />
        </Button>
      </Link>

      <div className="flex border p-5 flex-row justify-between gap-4">
        <h4>Run on startup</h4>

        <Switch checked={checked} onCheckedChange={startup} />
      </div>
    </div>
  );
};

export default Page;
