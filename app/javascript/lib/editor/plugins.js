import { useMemo, useEffect } from 'react'
import { createPlugins } from '@udecode/plate-headless'

import { useTypographyPlugins, components } from '~/lib/editor/typography'
import useBehaviourPlugins from '~/lib/editor/behaviour'
import useAutoformatPlugins from '~/lib/editor/autoformat'

const usePlugins = options => {
  const typographyPlugins = useTypographyPlugins(options)
  const behaviourPlugins = useBehaviourPlugins(options)
  const autoformatPlugins = useAutoformatPlugins(options)

  return useMemo(() => createPlugins([
    ...typographyPlugins,
    ...behaviourPlugins,
    ...autoformatPlugins,
  ], {
    components,
  }), [ typographyPlugins, behaviourPlugins, autoformatPlugins])
}

export default usePlugins
