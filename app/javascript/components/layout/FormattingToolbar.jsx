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
      <div className="my-auto space-y-2" id="trix-toolbar">
        {[
          { label: 'Bold', icon: BoldIcon, shortcut: 'b', attribute: 'bold' },
          { label: 'Italic', icon: ItalicIcon, shortcut: 'i', attribute: 'italic' },
          { label: 'Strikethrough', icon: StrikethroughIcon, attribute: 'strike' },
          { label: 'Link', icon: LinkIcon, shortcut: 'k', attribute: 'href', action: 'link' },
          { label: 'Heading', icon: HeadingOneIcon, shortcut: '1', attribute: 'heading1' },
          { label: 'Quote', icon: QuoteIcon, attribute: 'quote' },
          { label: 'Code block', icon: CodeBlockIcon, attribute: 'code' },
          { label: 'Bulleted list', icon: BulletedListIcon, attribute: 'bullet' },
          { label: 'Numbered list', icon: NumberedListIcon, attribute: 'number' },
          { label: 'Indent', icon: IndentIcon, action: 'increaseNestingLevel' },
          { label: 'Unindent', icon: UnindentIcon, action: 'decreaseNestingLevel' },
        ].map(({ label, icon: Icon, shortcut, attribute, action }, index) => (
          <Tooltip key={index} content={label} placement="left">
            <button
              type="button"
              className="block btn btn-transparent p-3 aspect-square text-center"
              data-trix-key={shortcut}
              data-trix-attribute={attribute}
              data-trix-action={action}
            >
              <Icon size="1.25em" ariaLabel={label} />
            </button>
          </Tooltip>
        ))}
      </div>
    </aside>
  )
})

export default FormattingToolbar
