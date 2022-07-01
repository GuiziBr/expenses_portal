import React from 'react'
import { Link } from 'react-router-dom'
import constants from '../../constants/constants'

interface DropdownProps {
  onClickFunction: (item: string) => void
  isDropdownActive: boolean
}

const Dropdown: React.FC<DropdownProps> = ({ onClickFunction, isDropdownActive }) => (
  <ul className={`${isDropdownActive ? 'management-menu' : ''}`}>
    {
      constants.dropdownItems.map((item) => (
        <li key={item.title} className="nav-item">
          <Link to={item.path} onClick={() => onClickFunction(item.path)}>{item.title}</Link>
        </li>
      ))
    }
  </ul>
)

export default Dropdown
