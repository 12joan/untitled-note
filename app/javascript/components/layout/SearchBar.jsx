import React from 'react'
import { Search } from 'react-bootstrap-icons'

const SearchBar = props => {
  return (
    <button
      id="search-bar"
      className="w-100 btn btn-light rounded-pill text-muted py-1"
      data-bs-toggle="modal"
      data-bs-target="#search-modal">
      <Search className="bi" /> Search
    </button>
  )
}

export default SearchBar
