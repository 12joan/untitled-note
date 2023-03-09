const filterDescendants = (node, filter) => {
  if (!filter(node)) {
    return null
  }

  const filteredNode = { ...node }

  if (filteredNode.children) {
    filteredNode.children = filteredNode.children
      .map(child => filterDescendants(child, filter))
      .filter(child => child !== null)
  }

  return filteredNode
}

export default filterDescendants
