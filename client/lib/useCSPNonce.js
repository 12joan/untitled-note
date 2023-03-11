import { useMemo } from 'react'

const useCSPNonce = () => useMemo(() => (
  document.querySelector('meta[name="csp-nonce"]').getAttribute('content')
), [])

export default useCSPNonce
