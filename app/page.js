
'use client'

import MyTab from "@/components/MyTab"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { MenubarGroup } from "@radix-ui/react-menubar"
import { useEffect, useRef, useState } from "react"

export default function page() {

  const [data, setdata] = useState([])

  const [imagepath, setimagepath] = useState(null)

  useEffect(() => {
    const handleSelectedFile = (e, path) => {
      console.log('Selected File:', path);
      setdata([...data, path]);
    };



    window.electronAPI.on('selected-file', handleSelectedFile);

  }, [data]);




  async function inputfile(e) {
    const file = e.target.files[0];
    const filesize = e.target.files[0].size;

    let formattedSize;
    if (filesize < 1024) {
      formattedSize = filesize + " B";
    } else if (filesize < 1024 * 1024) {
      formattedSize = (filesize / 1024).toFixed(2) + " KB";
    } else {
      formattedSize = (filesize / (1024 * 1024)).toFixed(2) + " MB";
    }

    const filedata = {
      file_name: file?.name,
      size: formattedSize + file?.path
    }

    setdata([...data, filedata])
  }

  function openfile() {
    window.electronAPI.send('open-file-dialog')
  }

  function openHelpWindow() {
    window.electronAPI.send('open-help-window')
  }
  










  return (
    <>
      <Menubar >
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>





            <MenubarItem

              onClick={openfile}

            >

              Open File...



            </MenubarItem>


          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>

          <MenubarTrigger>About</MenubarTrigger>

          <MenubarContent >
            <MenubarItem>
              Preferences
            </MenubarItem>

            <MenubarSeparator />

            <MenubarItem onClick={openHelpWindow}>
              Help
            </MenubarItem>
          </MenubarContent>

        </MenubarMenu>

      </Menubar >

      <MyTab
        data={data}
      />



    </>
  )

}
