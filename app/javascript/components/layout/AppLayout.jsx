import React, { useRef } from 'react'

import { useContext } from '~/lib/context'
import useBreakpoints from '~/lib/useBreakpoints'
import useElementSize from '~/lib/useElementSize'
import abbreviate from '~/lib/abbreviate'

import SettingsIcon from '~/components/icons/SettingsIcon'
import AccountIcon from '~/components/icons/AccountIcon'
import OverviewIcon from '~/components/icons/OverviewIcon'
import SearchIcon from '~/components/icons/SearchIcon'
import BoldIcon from '~/components/icons/formatting/BoldIcon'
import ItalicIcon from '~/components/icons/formatting/ItalicIcon'
import StrikethroughIcon from '~/components/icons/formatting/StrikethroughIcon'
import LinkIcon from '~/components/icons/formatting/LinkIcon'
import HeadingOneIcon from '~/components/icons/formatting/HeadingOneIcon'
import QuoteIcon from '~/components/icons/formatting/QuoteIcon'
import CodeBlockIcon from '~/components/icons/formatting/CodeBlockIcon'
import BulletedListIcon from '~/components/icons/formatting/BulletedListIcon'
import NumberedListIcon from '~/components/icons/formatting/NumberedListIcon'
import IndentIcon from '~/components/icons/formatting/IndentIcon'
import UnindentIcon from '~/components/icons/formatting/UnindentIcon'

/*
import { useContext } from '~/lib/context'

import TopBar from '~/components/layout/TopBar'
import Sidebar from '~/components/layout/Sidebar'
import ContentArea from '~/components/layout/ContentArea'
import SwitchProjectModal from '~/components/projects/SwitchProjectModal'
import NewProjectModal from '~/components/projects/NewProjectModal'
import EditProjectModal from '~/components/projects/EditProjectModal'
import DeleteProjectModal from '~/components/projects/DeleteProjectModal'
import SearchModal from '~/components/layout/SearchModal'
import TrixDialogs from '~/components/layout/TrixDialogs'
import KeyboardNavigationModal from '~/components/layout/KeyboardNavigationModal'
*/

const AppLayout = props => {
  //const { projectId, keywordId, documentId } = useContext()
  const { projects, project: currentProject } = useContext()

  const projectsBarRef = useRef()
  const topBarRef = useRef()
  const sideBarRef = useRef()
  const formattingBarRef = useRef()

  const { width: projectsBarWidth } = useElementSize(projectsBarRef)
  const { height: topBarHeight } = useElementSize(topBarRef)
  const { width: sideBarWidth } = useElementSize(sideBarRef)
  const { width: formattingBarWidth } = useElementSize(formattingBarRef)

  const { isMd, isXl } = useBreakpoints()

  return (
    <>
      <nav ref={projectsBarRef} className="fixed top-0 bottom-0 left-0 overflow-y-auto w-20 border-r p-3 bg-slate-100">
        <ul className="space-y-3">
          {projects.map(project => (
            <li
              key={project.id}
              className="bg-white aspect-square rounded-lg shadow hover:bg-slate-100 cursor-pointer flex items-center justify-center text-xl font-light p-1"
            >
              {abbreviate(project.name, 2)}
            </li>
          ))}
        </ul>
      </nav>

      <nav ref={topBarRef} className="fixed top-0 right-0 p-5 pointer-events-none flex justify-between gap-6" style={{ left: projectsBarWidth }}>
        <div>
          <div className="inline-block font-medium -mx-3 -my-2 px-3 py-2 rounded-lg bg-white/75 backdrop-blur pointer-events-auto">
            {currentProject.name}
          </div>
        </div>

        <div className="space-x-2 -m-2">
          {[SettingsIcon, AccountIcon].map((Icon, index) => (
            <button key={index} type="button" className="p-2 aspect-square rounded-full bg-white/75 backdrop-blur pointer-events-auto hover:bg-slate-100/75">
              <Icon size="1.25em" />
            </button>
          ))}
        </div>
      </nav>

      <nav
        ref={sideBarRef}
        className="fixed bottom-0 overflow-y-auto p-5 pr-0 w-48"
        style={{
          top: topBarHeight,
          left: projectsBarWidth,
          display: isMd ? 'initial' : 'none',
        }}
      >
        <section>
          <ul className="-ml-3">
            <li className="px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer flex gap-2 items-center">
              <OverviewIcon size="1.25em" /> Overview
            </li>

            <li className="px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer flex gap-2 items-center">
              <SearchIcon size="1.25em" /> Search
            </li>
          </ul>
        </section>
      </nav>

      <aside ref={formattingBarRef} className="fixed bottom-0 right-0 p-5 pl-0 overflow-y-auto flex" style={{ top: topBarHeight }}>
        <ul className="my-auto space-y-2">
          {[BoldIcon, ItalicIcon, StrikethroughIcon, LinkIcon, HeadingOneIcon, QuoteIcon, CodeBlockIcon, BulletedListIcon, NumberedListIcon, IndentIcon, UnindentIcon].map((Icon, index) => (
            <li key={index} className="p-3 aspect-square rounded-lg hover:bg-slate-100 cursor-pointer text-center">
              <Icon size="1.25em" />
            </li>
          ))}
        </ul>
      </aside>

      {/* Sample dialog */}
      <div className="fixed inset-0 flex p-5 overflow-y-auto hidden">
        <div className="m-auto inline-block bg-slate-100/50 backdrop-blur-xl shadow-dialog rounded-lg p-3 w-full max-w-sm text-center flex flex-col justify-center gap-3">
          <h2 className="text-xl font-medium">Add link</h2>

          <label className="space-y-3">
            <span>Enter the URL of the link you want to add</span>

            <input
              type="text"
              className="block w-full rounded-lg bg-black/5 focus:bg-white p-2"
              placeholder="https://example.com/"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button type="button" className="grow bg-black/5 px-3 py-2 rounded-lg hover:bg-black/10">Cancel</button>
            <button type="button" className="grow bg-black/5 px-3 py-2 rounded-lg hover:bg-black/10">Add link</button>
          </div>
        </div>
      </div>

      <main
        className="text-black"
        style={{
          paddingTop: topBarHeight,
          paddingLeft: projectsBarWidth + sideBarWidth,
          paddingRight: isXl
            ? Math.max(formattingBarWidth, projectsBarWidth + sideBarWidth)
            : formattingBarWidth,
        }}
      >
        <div className="p-5 max-w-screen-md mx-auto space-y-3">
          <h1 className="text-3xl font-medium">My First Document</h1>

          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Fames ac turpis egestas maecenas pharetra convallis posuere morbi leo. Sed faucibus turpis in eu. Diam ut venenatis tellus in metus vulputate eu. Id cursus metus aliquam eleifend mi in nulla. Enim ut sem viverra aliquet. Et magnis dis parturient montes nascetur ridiculus mus mauris vitae. Convallis a cras semper auctor neque vitae tempus quam pellentesque. Dis parturient montes nascetur ridiculus mus mauris vitae. Nascetur ridiculus mus mauris vitae. Id consectetur purus ut faucibus pulvinar elementum. Sodales ut etiam sit amet. Ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget gravida. Tortor vitae purus faucibus ornare suspendisse sed nisi.</p>

          <p>Cursus in hac habitasse platea dictumst quisque sagittis. Convallis convallis tellus id interdum velit laoreet. Egestas congue quisque egestas diam. Volutpat lacus laoreet non curabitur gravida arcu ac tortor. Feugiat nisl pretium fusce id velit ut tortor pretium. Lacus suspendisse faucibus interdum posuere. Lacus laoreet non curabitur gravida. Consectetur a erat nam at lectus urna duis convallis convallis. Id diam maecenas ultricies mi eget mauris pharetra et. Orci ac auctor augue mauris augue. Id nibh tortor id aliquet lectus proin nibh nisl. Purus gravida quis blandit turpis cursus in hac habitasse platea. Lorem sed risus ultricies tristique nulla aliquet enim. Malesuada bibendum arcu vitae elementum.</p>

          <p>Dolor sed viverra ipsum nunc aliquet bibendum enim. Arcu dui vivamus arcu felis bibendum ut. Quisque id diam vel quam elementum pulvinar etiam non quam. Turpis massa sed elementum tempus egestas. Cras adipiscing enim eu turpis egestas pretium. Nibh tortor id aliquet lectus proin nibh nisl condimentum. Amet aliquam id diam maecenas ultricies mi eget mauris pharetra. Et netus et malesuada fames. Nunc sed id semper risus in. Ullamcorper sit amet risus nullam eget. Ac tincidunt vitae semper quis lectus nulla at. Congue quisque egestas diam in arcu cursus.</p>

          <p>Ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget. Dolor sit amet consectetur adipiscing elit duis. Semper viverra nam libero justo laoreet sit amet. Justo donec enim diam vulputate. Ac placerat vestibulum lectus mauris. Purus in massa tempor nec feugiat nisl pretium fusce. Eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis orci. Rhoncus mattis rhoncus urna neque viverra justo. Vulputate enim nulla aliquet porttitor lacus luctus accumsan. Ultricies lacus sed turpis tincidunt id aliquet risus feugiat in. Proin nibh nisl condimentum id. Facilisi nullam vehicula ipsum a arcu cursus vitae congue mauris. Tristique senectus et netus et malesuada. Mauris pharetra et ultrices neque ornare aenean euismod.</p>

          <p>Mattis nunc sed blandit libero volutpat. Cursus risus at ultrices mi tempus imperdiet nulla. Diam vel quam elementum pulvinar etiam non. Leo urna molestie at elementum eu facilisis sed. Orci sagittis eu volutpat odio facilisis mauris sit amet. Sed velit dignissim sodales ut eu sem. Sed egestas egestas fringilla phasellus. Dictum at tempor commodo ullamcorper a lacus vestibulum sed. Orci phasellus egestas tellus rutrum. Convallis a cras semper auctor neque vitae.</p>

          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Fames ac turpis egestas maecenas pharetra convallis posuere morbi leo. Sed faucibus turpis in eu. Diam ut venenatis tellus in metus vulputate eu. Id cursus metus aliquam eleifend mi in nulla. Enim ut sem viverra aliquet. Et magnis dis parturient montes nascetur ridiculus mus mauris vitae. Convallis a cras semper auctor neque vitae tempus quam pellentesque. Dis parturient montes nascetur ridiculus mus mauris vitae. Nascetur ridiculus mus mauris vitae. Id consectetur purus ut faucibus pulvinar elementum. Sodales ut etiam sit amet. Ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget gravida. Tortor vitae purus faucibus ornare suspendisse sed nisi.</p>

          <p>Cursus in hac habitasse platea dictumst quisque sagittis. Convallis convallis tellus id interdum velit laoreet. Egestas congue quisque egestas diam. Volutpat lacus laoreet non curabitur gravida arcu ac tortor. Feugiat nisl pretium fusce id velit ut tortor pretium. Lacus suspendisse faucibus interdum posuere. Lacus laoreet non curabitur gravida. Consectetur a erat nam at lectus urna duis convallis convallis. Id diam maecenas ultricies mi eget mauris pharetra et. Orci ac auctor augue mauris augue. Id nibh tortor id aliquet lectus proin nibh nisl. Purus gravida quis blandit turpis cursus in hac habitasse platea. Lorem sed risus ultricies tristique nulla aliquet enim. Malesuada bibendum arcu vitae elementum.</p>

          <p>Dolor sed viverra ipsum nunc aliquet bibendum enim. Arcu dui vivamus arcu felis bibendum ut. Quisque id diam vel quam elementum pulvinar etiam non quam. Turpis massa sed elementum tempus egestas. Cras adipiscing enim eu turpis egestas pretium. Nibh tortor id aliquet lectus proin nibh nisl condimentum. Amet aliquam id diam maecenas ultricies mi eget mauris pharetra. Et netus et malesuada fames. Nunc sed id semper risus in. Ullamcorper sit amet risus nullam eget. Ac tincidunt vitae semper quis lectus nulla at. Congue quisque egestas diam in arcu cursus.</p>

          <p>Ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget. Dolor sit amet consectetur adipiscing elit duis. Semper viverra nam libero justo laoreet sit amet. Justo donec enim diam vulputate. Ac placerat vestibulum lectus mauris. Purus in massa tempor nec feugiat nisl pretium fusce. Eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis orci. Rhoncus mattis rhoncus urna neque viverra justo. Vulputate enim nulla aliquet porttitor lacus luctus accumsan. Ultricies lacus sed turpis tincidunt id aliquet risus feugiat in. Proin nibh nisl condimentum id. Facilisi nullam vehicula ipsum a arcu cursus vitae congue mauris. Tristique senectus et netus et malesuada. Mauris pharetra et ultrices neque ornare aenean euismod.</p>

          <p>Mattis nunc sed blandit libero volutpat. Cursus risus at ultrices mi tempus imperdiet nulla. Diam vel quam elementum pulvinar etiam non. Leo urna molestie at elementum eu facilisis sed. Orci sagittis eu volutpat odio facilisis mauris sit amet. Sed velit dignissim sodales ut eu sem. Sed egestas egestas fringilla phasellus. Dictum at tempor commodo ullamcorper a lacus vestibulum sed. Orci phasellus egestas tellus rutrum. Convallis a cras semper auctor neque vitae.</p>
        </div>
      </main>
    </>
  )

  /*return (
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
  )*/
}

export default AppLayout
