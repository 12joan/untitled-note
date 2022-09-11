import React, { forwardRef } from 'react'

import OverviewIcon from '~/components/icons/OverviewIcon'
import SearchIcon from '~/components/icons/SearchIcon'

const Sidebar = forwardRef(({ ...otherProps }, ref) => {
  return (
    <nav
      ref={ref}
      className="fixed bottom-0 overflow-y-auto p-5 pr-0 w-48"
      {...otherProps}
    >
      <section>
        <ul className="-ml-3">
          <li className="btn btn-transparent px-3 py-2 flex gap-2 items-center">
            <OverviewIcon size="1.25em" /> Overview
          </li>

          <li className="btn btn-transparent px-3 py-2 flex gap-2 items-center">
            <SearchIcon size="1.25em" /> Search
          </li>
        </ul>
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
