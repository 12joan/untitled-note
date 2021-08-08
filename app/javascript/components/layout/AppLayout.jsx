import React from 'react'

import TopBar from 'components/layout/TopBar'
import ProjectsBar from 'components/layout/ProjectsBar'
import NavigationMenu from 'components/layout/NavigationMenu'
import ContentHeader from 'components/layout/ContentHeader'
import ContentArea from 'components/layout/ContentArea'
import NewProjectModal from 'components/projects/NewProjectModal'
import EditProjectModal from 'components/projects/EditProjectModal'
import DeleteProjectModal from 'components/projects/DeleteProjectModal'

const AppLayout = props => {
  return (
    <>
      <div className="continer-fluid h-100 d-flex flex-column ">
        <div className="row g-0 flex-shrink-0">
          <TopBar />
        </div>

        <div className="row g-0 flex-fill" style={{ minHeight: 0 }}>
          <div className="col-auto mh-100 overflow-scroll">
            <ProjectsBar />
          </div>

          <div className="col-auto mh-100 overflow-scroll">
            <NavigationMenu />
          </div>

          <div className="col mh-100 d-flex flex-column">
            <ContentHeader />

            <div className="flex-grow-1 overflow-scroll bg-light">
              <ContentArea />
            </div>
          </div>
        </div>
      </div>

      <NewProjectModal />
      <EditProjectModal />
      <DeleteProjectModal />
    </>
  )
}

export default AppLayout
