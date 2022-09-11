import useViewportSize from '~/lib/useViewportSize'

const useBreakpoints = () => {
  const { width } = useViewportSize()

  return {
    isSm: width >= 640,
    isMd: width >= 768,
    isLg: width >= 1024,
    isXl: width >= 1280,
    is2xl: width >= 1536,
  }
}

export default useBreakpoints
