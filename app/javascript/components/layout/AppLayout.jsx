import React from 'react'

import TopBar from 'components/layout/TopBar'
import Sidebar from 'components/layout/Sidebar'
import ContentArea from 'components/layout/ContentArea'
import NewProjectModal from 'components/projects/NewProjectModal'
import EditProjectModal from 'components/projects/EditProjectModal'
import DeleteProjectModal from 'components/projects/DeleteProjectModal'

const AppLayout = props => {
  return (
    <>
      <div className="continer-fluid h-100 d-flex flex-column position-fixed top-0 bottom-0 start-0 end-0">
        <div className="row g-0 flex-shrink-0">
          <TopBar />
        </div>

        <div className="row g-0 flex-fill" style={{ minHeight: 0 }}>
          <Sidebar />

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
