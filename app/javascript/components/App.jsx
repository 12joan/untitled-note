import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import TopBar from 'components/layout/TopBar'
import ProjectsBar from 'components/layout/ProjectsBar'
import NavigationMenu from 'components/layout/NavigationMenu'
import ContentArea from 'components/layout/ContentArea'

const App = props => {
  return (
    <Router>
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

          <div className="col mh-100 overflow-scroll bg-light">
            <ContentArea />
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
