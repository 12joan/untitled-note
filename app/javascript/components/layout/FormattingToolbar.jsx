import React, { forwardRef } from 'react'

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

const FormattingToolbar = forwardRef(({ ...otherProps }, ref) => {
  return (
    <aside
      ref={ref}
      className="fixed bottom-0 right-0 p-5 pl-0 overflow-y-auto flex"
      {...otherProps}
    >
      <ul className="my-auto space-y-2">
        {[BoldIcon, ItalicIcon, StrikethroughIcon, LinkIcon, HeadingOneIcon, QuoteIcon, CodeBlockIcon, BulletedListIcon, NumberedListIcon, IndentIcon, UnindentIcon].map((Icon, index) => (
          <li key={index} className="p-3 aspect-square rounded-lg hover:bg-slate-100 cursor-pointer text-center">
            <Icon size="1.25em" />
          </li>
        ))}
      </ul>
    </aside>
  )
})

export default FormattingToolbar
