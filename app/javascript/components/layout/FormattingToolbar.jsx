import React, { forwardRef } from 'react'

import Tooltip from '~/components/Tooltip'
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
      className="fixed bottom-0 right-0 p-5 pl-1 overflow-y-auto flex"
      {...otherProps}
    >
      <div className="my-auto space-y-2">
        {[
          ['Bold', BoldIcon],
          ['Italic', ItalicIcon],
          ['Strikethrough', StrikethroughIcon],
          ['Link', LinkIcon],
          ['Heading', HeadingOneIcon],
          ['Quote', QuoteIcon],
          ['Code block', CodeBlockIcon],
          ['Bulleted list', BulletedListIcon],
          ['Numbered list', NumberedListIcon],
          ['Indent', IndentIcon],
          ['Unindent', UnindentIcon],
        ].map(([label, Icon], index) => (
          <Tooltip key={index} content={label} placement="left">
            <button className="block btn btn-transparent p-3 aspect-square text-center">
              <Icon size="1.25em" ariaLabel={label} />
            </button>
          </Tooltip>
        ))}
      </div>
    </aside>
  )
})

export default FormattingToolbar
