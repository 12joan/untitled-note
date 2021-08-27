import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { Collapse, Offcanvas } from 'bootstrap'

import { useContext } from 'lib/context'

import ProjectsBar from 'components/layout/ProjectsBar'
import NavigationMenu from 'components/layout/NavigationMenu'

const Sidebar = props => {
  const { toggleSidebarEvent } = useContext()

  const viewportWidth = useViewportWidth()
  const isOffcanvas = viewportWidth < 992

  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  const collapseInstance = useRef(undefined)
  const offcanvasInstance = useRef(undefined)

  const showOffcanvas = () => offcanvasInstance.current?.show()
  const dismissOffcanvas = () => offcanvasInstance.current?.hide()

  useEffect(() => {
    if (isOffcanvas) {
      offcanvasInstance.current = Offcanvas.getOrCreateInstance(
        document.querySelector('#sidebar')
      )
    } else {
      collapseInstance.current = Collapse.getOrCreateInstance(
        document.querySelector('#sidebar-collapse')
      )

      dismissOffcanvas()
    }

    const onToggle = () => {
      if (isOffcanvas) {
        showOffcanvas()
      } else {
        setSidebarExpanded(expanded => !expanded)
      }
    }

    toggleSidebarEvent.addEventListener(onToggle)
    return () => toggleSidebarEvent.removeEventListener(onToggle)
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
          className={isOffcanvas ? 'offcanvas offcanvas-start' : 'h-100 border-end visible'}
          id="sidebar">
          <div className="carousel slide" data-bs-interval="false" id="sidebar-carousel">
            <div className="carousel-inner">
              <div className="carousel-item">
                <ProjectsBar />
              </div>

              <div className="carousel-item active">
                <NavigationMenu dismissOffcanvas={dismissOffcanvas} />
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
