import React from 'react'

const LinkSelect = props => {
  return (
    <div className="dropdown">
      {props.children}

      <ul className="dropdown-menu">
        {props.beforeOptions}

        {
          Object.keys(props.options).map((option, index) => {
            const selected = option === props.value

            return (
              <li key={index}>
                <button
                  type="button"
                  className={`dropdown-item ${selected ? 'active' : ''}`}
                  aria-current={selected ? 'true' : undefined}
                  onClick={() => props.onChange(option)}>
                  {props.options[option]}
                </button>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default LinkSelect
