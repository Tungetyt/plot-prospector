import dynamic from 'next/dynamic'
import { getServerSession } from 'next-auth'
import { SignIn } from '@/app/components/SignIn'
import { Drawer } from '@/app/components/Drawer'
import { SignOut } from '@/app/components/SignOut'
import PlotCreationController from '@/app/components/PlotCreationController'

const Map = dynamic(() => import('@/app/components/Map'), { ssr: false })

export default async function Home() {
  const session = await getServerSession()
  return (
    <main className="flex flex-col">
      <Drawer
        sidebar={
          <>
            {session ? (
              <>
                <PlotCreationController />
                <li className="mt-auto">
                  <SignOut />
                </li>
              </>
            ) : (
              <li>
                <SignIn />
              </li>
            )}
          </>
        }
      >
        <Map />
      </Drawer>
    </main>
  )
}
