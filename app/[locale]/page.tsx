import dynamic from 'next/dynamic'
import {getServerSession} from 'next-auth'
import {pino} from 'pino'
import PlotCreationController from '@/features/PlotCreationController/PlotCreationController'
import SignOut from '@/features/Auth/SignOut'
import SignIn from '@/features/Auth/SignIn'
import Drawer from '@/features/Common/Drawer'
import {isEmail} from '@/utils/common'

const Map = dynamic(() => import('@/features/Map/Map'), {ssr: false})

export default async function Home() {
  const session = await getServerSession()
  pino().info('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
  pino().error('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')

  const email = session?.user?.email

  return (
    <main className="flex flex-col">
      <Drawer
        sidebar={
          session ? (
            <>
              <PlotCreationController email={isEmail(email) ? email : null} />
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
