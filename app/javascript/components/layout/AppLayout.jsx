import React from 'react'

import { useContext } from 'lib/context'

import TopBar from 'components/layout/TopBar'
import Sidebar from 'components/layout/Sidebar'
import ContentArea from 'components/layout/ContentArea'
import SwitchProjectModal from 'components/projects/SwitchProjectModal'
import NewProjectModal from 'components/projects/NewProjectModal'
import EditProjectModal from 'components/projects/EditProjectModal'
import DeleteProjectModal from 'components/projects/DeleteProjectModal'
import SearchModal from 'components/layout/SearchModal'
import TrixDialogs from 'components/layout/TrixDialogs'
import KeyboardNavigationModal from 'components/layout/KeyboardNavigationModal'

const AppLayout = props => {
  const { projectId, keywordId, documentId } = useContext()

  return (
    <>
      <div className="layout-column position-fixed top-0 bottom-0 start-0 end-0 bg-light">
        <TopBar />

        <div className="layout-row flex-grow-1 overflow-hidden">
          <Sidebar />

          <div className="layout-column flex-grow-1 overflow-hidden">
            <ContentArea key={[projectId, keywordId, documentId]} />
          </div>
        </div>
      </div>

      <SwitchProjectModal />
      <NewProjectModal />
      <EditProjectModal />
      <DeleteProjectModal />
      <SearchModal />
      <TrixDialogs />
      <KeyboardNavigationModal />
    </>
  )
}

export default AppLayout
