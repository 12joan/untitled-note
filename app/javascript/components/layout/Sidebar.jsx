import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { Collapse, Offcanvas } from 'bootstrap'

import { useContext } from 'lib/context'

import ProjectsBar from 'components/layout/ProjectsBar'
import NavigationMenu from 'components/layout/NavigationMenu'

const Sidebar = props => {
  const { sendSidebarEvent } = useContext()

  const viewportWidth = useViewportWidth()
  const isOffcanvas = (viewportWidth === undefined) || viewportWidth < 992

  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  const collapseInstance = useRef(undefined)
  const offcanvasInstance = useRef(undefined)

  const showSidebar = () => {
    if (isOffcanvas) {
      offcanvasInstance.current?.show()
    } else {
      setSidebarExpanded(true)
    }
  }

  const toggleSidebar = () => {
    if (isOffcanvas) {
      offcanvasInstance.current?.toggle()
    } else {
      setSidebarExpanded(sidebarExpanded => !sidebarExpanded)
    }
  }

  useEffect(() => {
    if (isOffcanvas) {
      offcanvasInstance.current = Offcanvas.getOrCreateInstance(
        document.querySelector('#sidebar')
      )
    } else {
      collapseInstance.current = Collapse.getOrCreateInstance(
        document.querySelector('#sidebar-collapse')
      )

      offcanvasInstance.current?.hide()
    }

    const onSidebarEvent = eventType => {
      switch (eventType) {
        case 'toggle':
          toggleSidebar()
          break

        case 'show':
          showSidebar()
          break
      }
    }

    sendSidebarEvent.addEventListener(onSidebarEvent)
    return () => sendSidebarEvent.removeEventListener(onSidebarEvent)
  }, [isOffcanvas])

  useEffect(() => {
    if (!isOffcanvas) {
      if (sidebarExpanded) {
        collapseInstance.current.show()
      } else {
        collapseInstance.current.hide()
      }
    }
  }, [sidebarExpanded, isOffcanvas])

  return (
    <>
      <div
        className={`col-auto mh-100 ${isOffcanvas ? '' : 'collapse collapse-horizontal'}`}
        id="sidebar-collapse">
        <div
          className={`h-100 ${isOffcanvas ? 'offcanvas offcanvas-start' : 'border-end visible'}`}
          id="sidebar">
          <div className="h-100 carousel slide" data-bs-interval="false" id="sidebar-carousel">
            <div className="h-100 carousel-inner">
              <div className="h-100 carousel-item">
                <ProjectsBar />
              </div>

              <div className="h-100 carousel-item active">
                <NavigationMenu isOffcanvas={isOffcanvas} dismissOffcanvas={() => offcanvasInstance.current?.hide()} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

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
