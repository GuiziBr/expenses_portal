import React from 'react'

import { Link } from 'react-router-dom'

import { Container } from './styles'

interface HeaderProps {
  size?: 'small' | 'large';
}

const Header: React.FC<HeaderProps> = ({ size = 'large' }) => (
  <Container size={size}>
    <header>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/create">Create Expense</Link>
      </nav>
    </header>
  </Container>
)

export default Header
