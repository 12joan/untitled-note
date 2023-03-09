import { useMemo, useEffect } from 'react'
import { createPlugins } from '@udecode/plate-headless'

import { useTypographyPlugins, components } from '~/lib/editor/typography'
import useBehaviourPlugins from '~/lib/editor/behaviour'

const usePlugins = options => {
  const typographyPlugins = useTypographyPlugins(options)
  const behaviourPlugins = useBehaviourPlugins(options)

  return useMemo(() => createPlugins([
    ...typographyPlugins,
    ...behaviourPlugins,
  ], {
    components,
  }), [ typographyPlugins, behaviourPlugins])
}

export default usePlugins
