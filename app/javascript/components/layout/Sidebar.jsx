import React from 'react'
import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react'
import { Collapse, Offcanvas } from 'bootstrap'

import { useContext } from 'lib/context'
import classList from 'lib/classList'

import NavigationMenu from 'components/layout/NavigationMenu'

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
      className={classList([props.className, 'border-end', { 'd-none': !visible }])} style={{ width: 'var(--offcanvas-horizontal-width)' }}>
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
}

export default Sidebar
