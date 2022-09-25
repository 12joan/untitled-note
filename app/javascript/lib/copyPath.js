const copyPath = path => {
  const url = `${window.location.origin}${path}`

  if (window.location.protocol === 'http:') {
    console.log(url)
  } else {
    navigator.clipboard.writeText(url)
  }
}

export default copyPath
