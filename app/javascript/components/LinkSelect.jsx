import React from 'react'

const LinkSelect = props => {
  return (
    <div className="dropdown d-inline">
      <button
        type="button"
        className="btn btn-link text-decoration-none dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false">
        {props.options[props.value]}
      </button>

      <ul className="dropdown-menu">
        {
          Object.keys(props.options).map((option, index) => (
            <li key={index}>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => props.onChange(option)}>
                {props.options[option]}
              </button>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default LinkSelect
