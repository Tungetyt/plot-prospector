import {ReactNode, useId} from 'react'
import {useTranslations} from 'next-intl'

function Drawer({
  children,
  sidebar
}: {
  children: ReactNode
  sidebar: ReactNode
}) {
  const drawerId = useId()
  const t = useTranslations('Index')

  return (
    <div className="drawer lg:drawer-open">
      <input id={drawerId} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col justify-center">
        {children}
        <label
          htmlFor={drawerId}
          className="btn btn-primary drawer-button lg:hidden"
        >
          {t('Open_navigation')}
        </label>
      </div>
      <div className="drawer-side z-1000">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor={drawerId} className="drawer-overlay" />
        <ul className="menu w-60 h-full bg-base-200 text-base-content">
          {sidebar}
        </ul>
      </div>
    </div>
  )
}

export default Drawer
