const multiplexRefs = (upstreamRefs) => (current) =>
  upstreamRefs.forEach((ref) => {
    if (typeof ref === 'function') {
      ref(current);
    } else if (ref) {
      ref.current = current;
    }
  });

export default multiplexRefs;
