import React, { ElementType } from 'react';
import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_H1,
  ELEMENT_LI,
  ELEMENT_LINK,
  ELEMENT_MENTION,
  ELEMENT_MENTION_INPUT,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  ELEMENT_UL,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  PlateRenderElementProps,
} from '@udecode/plate';
import { twMerge } from 'tailwind-merge';
import { Attachment, ELEMENT_ATTACHMENT } from '~/lib/editor/attachments';
import { LinkComponent } from '~/lib/editor/links';
import { MentionComponent, MentionInputComponent } from '~/lib/editor/mentions';
import { groupedClassNames } from '../groupedClassNames';

const makeElementComponent =
  (Component: ElementType, className?: string) =>
  ({ children, nodeProps = {}, attributes }: PlateRenderElementProps) =>
    (
      <Component
        {...nodeProps}
        {...attributes}
        className={twMerge(className, nodeProps.className)}
        children={children}
      />
    );

const listStyle =
  'pl-[calc(1.5em+var(--list-style-offset,1ch))] marker:em:text-lg/none slate-top-level:list-overflow';

export const components = {
  [ELEMENT_PARAGRAPH]: makeElementComponent(
    'p',
    groupedClassNames({
      indent:
        'literary:em:indent-8 literary:first:indent-0 literary:[p:not(:has([data-slate-string]))+&]:indent-0 literary:[h1+&]:indent-0',
      spacing: 'literary:[p+&]:paragraph-no-spacing',
    })
  ),
  [MARK_BOLD]: makeElementComponent('strong', 'font-semibold'),
  [MARK_ITALIC]: makeElementComponent('em'),
  [MARK_STRIKETHROUGH]: makeElementComponent('del'),
  [MARK_CODE]: makeElementComponent(
    'code',
    groupedClassNames({
      base: 'text-pink-600 dark:text-pink-400',
      diff: 'diff-above:text-diff-700 diff-above:dark:text-diff-300',
    })
  ),
  [ELEMENT_LINK]: LinkComponent,
  [ELEMENT_H1]: makeElementComponent(
    'h1',
    groupedClassNames({
      fontWeight: 'font-medium',
      fontSize: 'slate-string:em:text-xl slate-string:sm:em:text-2xl',
      leading: 'slate-string:reset-leading',
    })
  ),
  [ELEMENT_BLOCKQUOTE]: makeElementComponent(
    'blockquote',
    groupedClassNames({
      padding: 'em:pl-4',
      text: 'italic',
      linePosition:
        'relative after:absolute after:left-0 after:inset-y-0 after:em:w-1',
      lineColor: 'after:bg-plain-200 after:dark:bg-plain-700',
      lineStyle: 'after:rounded-full',
      diff: 'diff:after:bg-diff-500 diff:rounded-r-md',
    })
  ),
  [ELEMENT_CODE_BLOCK]: makeElementComponent(
    'pre',
    groupedClassNames({
      bg: 'bg-plain-800 dark:bg-plain-950',
      text: 'text-white em:text-sm',
      rounded: 'rounded-md',
      padding: 'em:px-5 em:py-4',
      overflow: 'overflow-x-auto',
      diff: 'diff-above:bg-diff-900 diff-above:text-diff-300 no-default-diff-text-color',
    })
  ),
  [ELEMENT_UL]: makeElementComponent(
    'ul',
    groupedClassNames({
      list: listStyle,
      unorderedList:
        'list-disc marker:text-plain-300 dark:marker:text-plain-600 marker:diff:text-diff-300 dark:marker:diff:text-diff-600',
    })
  ),
  [ELEMENT_OL]: makeElementComponent(
    'ol',
    groupedClassNames({
      list: listStyle,
      orderedList:
        'list-decimal marker:text-plain-500 dark:marker:text-plain-400',
    })
  ),
  [ELEMENT_LI]: makeElementComponent('li', 'em:pl-1.5'),
  [ELEMENT_MENTION]: MentionComponent,
  [ELEMENT_MENTION_INPUT]: MentionInputComponent,
  [ELEMENT_ATTACHMENT]: Attachment,
};
