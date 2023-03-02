const groupList = (list, decider) => list.reduce(
  (groupedItems, item) => {
    const key = decider(item)
    const group = groupedItems[key] || []
    return { ...groupedItems, [key]: [...group, item] }
  },
  {}
)

export default groupList
