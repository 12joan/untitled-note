import React from 'react'

import TopBar from 'components/layout/TopBar'
import ProjectsBar from 'components/layout/ProjectsBar'
import NavigationMenu from 'components/layout/NavigationMenu'
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
          <div className="col-auto mh-100">
            <ProjectsBar />
          </div>

          <div className="col-auto mh-100">
            <NavigationMenu />
          </div>

          <div className="col mh-100 d-flex flex-column">
            <ContentArea />
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
