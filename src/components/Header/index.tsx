import React, { useState } from 'react'
import { AiFillCloseSquare } from 'react-icons/ai'
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import constants from '../../constants/constants'
import { useAuth } from '../../hooks/auth'
import Dropdown from './Dropdown'
import { Container } from './styles'

interface HeaderProps {
  size?: 'small' | 'large'
  current: 'PersonalDashboard' | 'SharedDashboard' | 'CreateExpense' | 'Management' | 'ConsolidatedBalance'
}

const Header: React.FC<HeaderProps> = ({ size = 'large', current }) => {
  const [dropdown, setDropdown] = useState<boolean>(false)
  const { signOut } = useAuth()
  const getClassName = (path: string) => (current === path ? 'active' : 'inactive')
  const [isDeskTopScreen] = useState<boolean>(window.innerWidth > 720)

  const refreshPage = (currentPage: string) => {
    if (window.location.pathname === currentPage) window.location.reload()
    setDropdown(false)
  }

  const getMenuTitle = (menu: string) => (
    isDeskTopScreen
      ? constants.menuTitles.desktopTitles[menu]
      : constants.menuTitles.mobileTitles[menu]
  )

  return (
    <Container size={size}>
      <header>
        <nav>
          <Link
            className={getClassName('SharedDashboard')}
            to="/sharedDashboard"
            onClick={() => refreshPage('/sharedDashboard')}
          >
            {getMenuTitle('shared')}
          </Link>
          <Link
            className={getClassName('PersonalDashboard')}
            to="/personalDashboard"
            onClick={() => refreshPage('/personalDashboard')}
          >
            {getMenuTitle('personal')}
          </Link>
          <Link
            className={getClassName('ConsolidatedBalance')}
            to="/consolidatedBalance"
            onClick={() => refreshPage('/consolidatedBalance')}
          >
            {getMenuTitle('consolidated')}
          </Link>
        </nav>
        <nav>
          <div onMouseLeave={() => setDropdown(false)} onMouseEnter={() => setDropdown(!dropdown)}>
            <button onClick={() => setDropdown(!dropdown)} type="button" className={getClassName('Management')}>
              {getMenuTitle('management')}
            </button>
            {dropdown
              ? <RiArrowUpSLine size={20} className={getClassName('Management')} />
              : <RiArrowDownSLine size={20} className={getClassName('Management')} />}
            <Dropdown onClickFunction={refreshPage} isDropdownActive={dropdown} />
          </div>
          <Link to="/" onClick={signOut}>
            {isDeskTopScreen ? 'Logout' : <AiFillCloseSquare size={20} color="orange" />}
          </Link>
        </nav>
      </header>
    </Container>
  )
}

export default Header
