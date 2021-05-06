import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/auth'
import Button from '../Button'
import { Container } from './styles'

interface HeaderProps {
  size?: 'small' | 'large'
  current: 'PersonalDashboard' | 'SharedDashboard' | 'CreateExpense'
  onOpenNewExpenseModal: () => void
}

const Header: React.FC<HeaderProps> = ({ size = 'large', current, onOpenNewExpenseModal }) => {
  const { signOut } = useAuth()
  const getClassName = (path: string) => (current === path ? 'active' : 'inactive')
  return (
    <Container size={size} current={current}>
      <header>
        <nav>
          <Link className={getClassName('SharedDashboard')} to="/sharedDashboard">Shared Dashboard</Link>
          <Link className={getClassName('PersonalDashboard')} to="/personalDashboard">Personal Dashboard</Link>
          <Button onClick={onOpenNewExpenseModal}>Create Expense</Button>
        </nav>
        <nav>
          <Link to="/" onClick={signOut}>Logout</Link>
        </nav>
      </header>
    </Container>
  )
}

export default Header
