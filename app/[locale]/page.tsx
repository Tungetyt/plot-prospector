import dynamic from 'next/dynamic'
import { getServerSession } from 'next-auth'
import { pino } from 'pino'
import PlotCreationController from '@/app/features/PlotCreationController/PlotCreationController'
import SignOut from '@/app/features/Auth/SignOut'
import SignIn from '@/app/features/Auth/SignIn'
import Drawer from '@/app/features/Common/Drawer'

const Map = dynamic(() => import('@/app/features/Map/Map'), { ssr: false })

export default async function Home() {
  const session = await getServerSession()
  pino().info('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
  pino().error('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')

  return (
    <main className="flex flex-col">
      <Drawer
        sidebar={
          session ? (
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
          )
        }
      >
        <Map />
      </Drawer>
    </main>
  )
}
