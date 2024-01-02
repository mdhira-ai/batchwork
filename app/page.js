
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
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export default function page() {

  const [data, setdata] = useState([])

  const [imagepath, setimagepath] = useState(null)
  const navigation = useRouter()

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

    // navigation.push('/help')


    window.electronAPI.send('open-help-window')
  }


  function aboutme() {
    window.electronAPI.send('open-about-window')
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

          <MenubarTrigger>
            Settings
          </MenubarTrigger>

          <MenubarContent >
            <MenubarItem onClick={openHelpWindow}>
              Preferences
            </MenubarItem>

            <MenubarSeparator />

              <MenubarItem onClick={aboutme}>

                About
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
