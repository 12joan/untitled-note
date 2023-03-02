import useViewportSize from '~/lib/useViewportSize'

const useBreakpoints = () => {
  const { width } = useViewportSize()

  return {
    is4xs: width >= 128,
    is3xs: width >= 256,
    is2xs: width >= 384,
    isXs: width >= 512,
    isSm: width >= 640,
    isMd: width >= 768,
    isLg: width >= 1024,
    isXl: width >= 1280,
    is2xl: width >= 1536,
  }
}

export default useBreakpoints
