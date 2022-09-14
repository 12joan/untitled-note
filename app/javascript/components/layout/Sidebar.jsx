import React from 'react'

import { OverviewLink } from '~/lib/routes'

import OverviewIcon from '~/components/icons/OverviewIcon'
import NewDocumentIcon from '~/components/icons/NewDocumentIcon'
import SearchIcon from '~/components/icons/SearchIcon'

const Sidebar = () => {
  return (
    <div className="w-full max-w-48 space-y-5 pb-3">
      <section className="-ml-3">
        <ButtonWithIcon as={OverviewLink} nav icon={OverviewIcon} label="Overview" />
        <ButtonWithIcon icon={NewDocumentIcon} label="New document" />
        <ButtonWithIcon icon={SearchIcon} label="Search" />
      </section>

      <SectionWithHeading heading="Pinned documents">
        <Button label="Document 1" />
        <Button label="Document 2" />
        <Button label="Document 3" />
      </SectionWithHeading>

      <SectionWithHeading heading="Recently viewed">
        <Button label="Document 4" />
        <Button label="Document 5" />
        <Button label="Document 6" />
      </SectionWithHeading>

      <SectionWithHeading heading="Tags">
        <Button label="Tag 1" />
        <Button label="Tag 2" />
        <Button label="Tag 3" />
      </SectionWithHeading>
    </div>
  )
}

const SectionWithHeading = ({ heading, children }) => {
  return (
    <section>
      <strong className="text-slate-500 text-xs uppercase tracking-wide select-none dark:text-slate-400">
        {heading}
      </strong>

      <div className="-ml-3">
        {children}
      </div>
    </section>
  )
}

const ButtonWithIcon = ({ as: Component = 'button', icon: Icon, label, ...otherProps }) => {
  const buttonProps = Component === 'button' ? { type: 'button' } : {}

  return (
    <Component
      {...buttonProps}
      className="btn btn-transparent w-full px-3 py-2 flex gap-2 items-center"
      {...otherProps}
    >
      <span className="text-primary-500 dark:text-primary-400 window-inactive:text-slate-500 dark:window-inactive:text-slate-400">
        <Icon size="1.25em" noAriaLabel />
      </span>

      {label}
    </Component>
  )
}

const Button = ({ as: Component = 'button', label, ...otherProps }) => {
  const buttonProps = Component === 'button' ? { type: 'button' } : {}

  return (
    <Component
      {...buttonProps}
      className="btn btn-transparent w-full px-3 py-1 flex"
      children={label}
      {...otherProps}
    />
  )
}

export default Sidebar
