import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import { MdDateRange } from 'react-icons/md'
import { format } from 'date-fns'
import income from '../../assets/income.svg'
import outcome from '../../assets/outcome.svg'
import total from '../../assets/total.svg'

import api from '../../services/apiClient'

import Header from '../../components/Header'
import Button from '../../components/Button'
import Input from '../../components/Input'

import { formatAmount } from '../../utils/formatAmount'
import { assembleExpense } from '../../assemblers/expensesAssembler'

import { Container, CardContainer, Card, TableContainer, FormContainer } from './styles'

interface Expense {
  id: string;
  description: string;
  category: string,
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

interface Request {
  date: string
}

const SharedDashboard: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [balance, setBalance] = useState<Balance>({} as Balance)

  const loadExpenses = useCallback(async (date?: string) => {
    const token = sessionStorage.getItem('@expenses:token')
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params: { date },
    }
    const { data } = await api.get('/expenses/balance', config)
    const expenseList = data.expenses
      .sort((a: { date: string }, b: { date: string }) => ((a.date < b.date) ? 1 : -1))
      .map(assembleExpense)

    const updatedBalance = {
      paying: formatAmount(data.paying),
      payer: formatAmount(data.payed),
      total: formatAmount(data.total),
    }

    setExpenses(expenseList)
    setBalance(updatedBalance)
  }, [])

  const handleSubmit = useCallback(async (data?: Request) => {
    await loadExpenses(data?.date)
  }, [loadExpenses])

  useEffect(() => {
    async function loadDashboard(): Promise<void> {
      await loadExpenses()
    }
    loadDashboard()
  }, [loadExpenses])

  const defaultDate = format(new Date(), 'yyyy-MM')

  return (
    <>
      <Header current="SharedDashboard" />
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
              <img src={total} alt="Balance" />
            </header>
            <h1>{balance.total}</h1>
          </Card>
        </CardContainer>
        <FormContainer>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Input icon={MdDateRange} name="date" type="month" defaultValue={defaultDate} />
            <Button type="submit">Search</Button>
          </Form>
        </FormContainer>
        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Expense</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="description">{expense.description}</td>
                  <td>{expense.category}</td>
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

export default SharedDashboard
