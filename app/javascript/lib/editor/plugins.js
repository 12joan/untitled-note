import { createPlugins } from '@udecode/plate-headless'

import { typographyPlugins, components } from '~/lib/editor/typography'
import behaviourPlugins from '~/lib/editor/behaviour'
import autoformatPlugins from '~/lib/editor/autoformat'

const plugins = createPlugins([
  ...typographyPlugins,
  ...behaviourPlugins,
  ...autoformatPlugins,
], {
  components,
})

export default plugins
