import dynamic from "next/dynamic"
const Map = dynamic(() => import("@/app/components/Map"), { ssr: false })

export default function Home() {
  return (
    <main className="flex flex-col h-screen">
      <div className="drawer lg:drawer-open h-screen">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col  justify-center h-screen">
          <Map></Map>
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden"
          >
            Open drawer
          </label>
        </div>
        <div className="drawer-side z-1000">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu p-4 w-40 h-full bg-base-200 text-base-content">
            {/* Sidebar content here */}
            <li>
              <a>Map</a>
            </li>
            <li>
              <a>Table</a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
