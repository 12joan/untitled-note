import React, { forwardRef } from 'react'

import OverviewIcon from '~/components/icons/OverviewIcon'
import NewDocumentIcon from '~/components/icons/NewDocumentIcon'
import SearchIcon from '~/components/icons/SearchIcon'

const Sidebar = forwardRef(({ ...otherProps }, ref) => {
  return (
    <nav
      ref={ref}
      className="fixed bottom-0 overflow-y-auto p-5 pr-0 w-48 space-y-5"
      {...otherProps}
    >
      <section className="-ml-3">
        {[
          ['Overview', OverviewIcon],
          ['New document', NewDocumentIcon],
          ['Search', SearchIcon],
        ].map(([label, Icon], index) => (
          <button key={index} className="btn btn-transparent w-full px-3 py-2 flex gap-2 items-center">
            <Icon size="1.25em" noAriaLabel /> {label}
          </button>
        ))}
      </section>

      <section>
        <strong className="text-slate-500 text-xs uppercase tracking-wide select-none dark:text-slate-400">
          Pinned documents
        </strong>

        <div className="-ml-3">
          {['Document 1', 'Document 2', 'Document 3'].map((label, index) => (
            <button key={index} className="btn btn-transparent w-full px-3 py-1 flex gap-2 items-center">
              {label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <strong className="text-slate-500 text-xs uppercase tracking-wide select-none dark:text-slate-400">
          Recently viewed
        </strong>

        <div className="-ml-3">
          {['Document 4', 'Document 5', 'Document 6'].map((label, index) => (
            <button key={index} className="btn btn-transparent w-full px-3 py-1 flex gap-2 items-center">
              {label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <strong className="text-slate-500 text-xs uppercase tracking-wide select-none dark:text-slate-400">
          Tags
        </strong>

        <div className="-ml-3">
          {['Tag 1', 'Tag 2', 'Tag 3'].map((label, index) => (
            <button key={index} className="btn btn-transparent w-full px-3 py-1 flex gap-2 items-center">
              {label}
            </button>
          ))}
        </div>
      </section>
    </nav>
  )
})

/*import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react'
import { Offcanvas } from 'bootstrap'

import { useContext } from '~/lib/context'
import classList from '~/lib/classList'

import NavigationMenu from '~/components/layout/NavigationMenu'

const Sidebar = props => {
  const { sendSidebarEvent } = useContext()

  const viewportWidth = useViewportWidth()
  const isOffcanvas = (viewportWidth === undefined) || viewportWidth < 992

  const SidebarComponent = isOffcanvas ? OffcanvasSidebar : CollapsibleSidebar
  const sidebarComponentRef = useRef()

  const delegateSidebarEvent = event => sidebarComponentRef.current.handleSidebarEvent(event)

  useEffect(() => {
    sendSidebarEvent.addEventListener(delegateSidebarEvent)
    return () => sendSidebarEvent.removeEventListener(delegateSidebarEvent)
  }, [])

  return (
    <SidebarComponent ref={sidebarComponentRef} id="sidebar" className="layout-column overflow-hidden bg-light">
      <NavigationMenu isOffcanvas={isOffcanvas} dismissOffcanvas={() => delegateSidebarEvent('hide')} />
    </SidebarComponent>
  )
}

const OffcanvasSidebar = forwardRef((props, ref) => {
  const offcanvasRef = useRef()

  useImperativeHandle(ref, () => ({
    handleSidebarEvent: event => {
      const offcanvas = Offcanvas.getOrCreateInstance(offcanvasRef.current)
      const handler = offcanvas[event]

      if (typeof handler === 'function') {
        handler.bind(offcanvas)()
      } else {
        throw `Offcanvas does not understand ${event}`
      }
    },
  }))

  return (
    <div
      ref={offcanvasRef}
      id={props.id}
      className={classList([props.className, 'offcanvas offcanvas-start'])}>
      {props.children}
    </div>
  )
})

const CollapsibleSidebar = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(true)

  useImperativeHandle(ref, () => ({
    handleSidebarEvent: event => {
      switch (event) {
        case 'toggle':
          setVisible(!visible)
          break

        case 'show':
          setVisible(true)
          break
      }
    },
  }))

  return (
    <div
      id={props.id}
      className={classList([props.className, 'flex-shrink-0 border-end', { 'd-none': !visible }])} style={{ width: 'var(--offcanvas-horizontal-width)' }}>
      {props.children}
    </div>
  )
})

const useViewportWidth = () => {
  const [viewportWidth, setViewportWidth] = useState()

  useEffect(() => {
    const onResize = () => {
      setViewportWidth(document.documentElement.clientWidth)
    }

    onResize()

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return viewportWidth
}*/

export default Sidebar
