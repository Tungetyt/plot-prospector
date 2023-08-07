import { ReactNode, useId } from 'react'
import { useTranslations } from 'next-intl'

export const Drawer = ({
  children,
  sidebar,
}: {
  children: ReactNode
  sidebar: ReactNode
}) => {
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
        <label htmlFor={drawerId} className="drawer-overlay"></label>
        <ul className="menu w-56 h-full bg-base-200 text-base-content">
          {sidebar}
        </ul>
      </div>
    </div>
  )
}