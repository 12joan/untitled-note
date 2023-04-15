import { useMemo } from 'react'
import useRecomputeOnElementResize from '~/lib/useRecomputeOnElementResize'

const useElementBounds = useRecomputeOnElementResize(
  element => element?.getBoundingClientRect() ?? {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
  }
)

export default useElementBounds
