import { createPlugins } from '@udecode/plate-headless'

import { useTypographyPlugins, components } from '~/lib/editor/typography'
import useBehaviourPlugins from '~/lib/editor/behaviour'
import useAutoformatPlugins from '~/lib/editor/autoformat'

const usePlugins = options => createPlugins([
  ...useTypographyPlugins(options),
  ...useBehaviourPlugins(options),
  ...useAutoformatPlugins(options),
], {
  components,
})

export default usePlugins
