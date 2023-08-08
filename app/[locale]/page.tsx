import dynamic from 'next/dynamic'
import { getServerSession } from 'next-auth'
import { pino } from 'pino'
import PlotCreationController from '@/app/components/PlotCreationController'
import SignOut from '@/app/components/SignOut'
import SignIn from '@/app/components/SignIn'
import Drawer from '@/app/components/Drawer'

const Map = dynamic(() => import('@/app/components/Map'), { ssr: false })

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
