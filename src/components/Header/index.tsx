import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/auth'
import { Container } from './styles'

interface HeaderProps {
  size?: 'small' | 'large'
  current: 'PersonalDashboard' | 'SharedDashboard' | 'CreateExpense'
}

const MENU_TITLES = {
  desktopTitles: {
    shared: 'Shared Dashboard',
    personal: 'Personal Dashboard',
  },
  mobileTitles: {
    shared: 'Shared',
    personal: 'Personal',
  },
}

const Header: React.FC<HeaderProps> = ({ size = 'large', current }) => {
  const { signOut } = useAuth()
  const getClassName = (path: string) => (current === path ? 'active' : 'inactive')
  const [isDeskTopScreen] = useState<boolean>(window.innerWidth > 720)

  const getMenuTitle = (menu: string) => (isDeskTopScreen ? MENU_TITLES.desktopTitles[menu] : MENU_TITLES.mobileTitles[menu])

  return (
    <Container size={size} current={current}>
      <header>
        <nav>
          <Link className={getClassName('SharedDashboard')} to="/sharedDashboard">{getMenuTitle('shared')}</Link>
          <Link className={getClassName('PersonalDashboard')} to="/personalDashboard">{getMenuTitle('personal')}</Link>
        </nav>
        <nav>
          <Link to="/" onClick={signOut}>Logout</Link>
        </nav>
      </header>
    </Container>
  )
}

export default Header
