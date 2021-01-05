import React, { useState, useEffect } from 'react'

import income from '../../assets/income.svg'
import outcome from '../../assets/outcome.svg'
import total from '../../assets/total.svg'

import api from '../../services/apiClient'

import Header from '../../components/Header'

import { formatAmount } from '../../utils/formatAmount'
import formatDate from '../../utils/formatDate'

import {
  Container, CardContainer, Card, TableContainer,
} from './styles'

interface Expense {
  id: string;
  description: string;
  amount: number;
  formattedAmount: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  date: Date;
}

interface Balance {
  paying: string,
  payer: string,
  total: string
}

const Dashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [balance, setBalance] = useState<Balance>({} as Balance)

  useEffect(() => {
    async function loadExpenses(): Promise<void> {
      const token = sessionStorage.getItem('@expenses:token')
      const config = { headers: { Authorization: `Bearer ${token}` }}
      const { data } = await api.get('/expenses/balance', config)

      const expenseList = data.expenses.map((expense: Expense) => ({
        id: expense.id,
        description: expense.description,
        amount: expense.amount,
        formattedAmount: `${expense.type === 'outcome' ? '- ' : ''}${formatAmount(expense.amount)}`,
        formattedDate: formatDate(expense.date),
        type: expense.type,
        date: expense.date,
      }))

      const updatedBalance = {
        paying: formatAmount(data.paying),
        payer: formatAmount(data.payed),
        total: formatAmount(data.total),
      }

      setExpenses(expenseList)
      setBalance(updatedBalance)
    }
    loadExpenses()
  }, [])
  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Incomes</p>
              <img src={income} alt="Income" />
            </header>
            <h1>{balance.paying}</h1>
          </Card>
          <Card>
            <header>
              <p>Outcomes</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1>{balance.payer}</h1>
          </Card>
          <Card total>
            <header>
              <p>Balance</p>
              <img src={total} alt="Saldo" />
            </header>
            <h1>{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Expense</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="description">{expense.description}</td>
                  <td className={expense.type}>{expense.formattedAmount}</td>
                  <td>{expense.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  )
}

export default Dashboard
