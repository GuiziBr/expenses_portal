import React from 'react'

import { Link } from 'react-router-dom'

import { Container } from './styles'
import { useAuth } from '../../hooks/auth'

interface HeaderProps {
  size?: 'small' | 'large'
}

const Header: React.FC<HeaderProps> = ({ size = 'large' }) => {
  const { signOut } = useAuth()
  return (
    <Container size={size}>
      <header>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/expenses">Create Expense</Link>
        </nav>
        <nav>
          <Link to="/" onClick={signOut}>Logout</Link>
        </nav>
      </header>
    </Container>
  )
}

export default Header
