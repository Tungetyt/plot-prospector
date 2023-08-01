import dynamic from "next/dynamic"
import { getServerSession } from "next-auth"
import { GoogleAuth } from "@/app/components/GoogleAuth"
import { Drawer } from "@/app/components/Drawer"

const Map = dynamic(() => import("@/app/components/Map"), { ssr: false })

export default async function Home() {
  const session = await getServerSession()
  return (
    <main className="flex flex-col">
      <Drawer
        sidebar={
          <>
            <li>
              <a>Map</a>
            </li>
            <li>
              <a>Table</a>
            </li>
            <li>
              <GoogleAuth session={session}></GoogleAuth>
            </li>
          </>
        }
      >
        <Map />
      </Drawer>
    </main>
  )
}
