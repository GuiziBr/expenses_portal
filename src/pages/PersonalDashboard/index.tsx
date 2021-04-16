import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import { MdDateRange } from 'react-icons/md'
import { format } from 'date-fns'
import total from '../../assets/total.svg'

import api from '../../services/apiClient'

import Header from '../../components/Header'
import Button from '../../components/Button'
import Input from '../../components/Input'

import { formatAmount } from '../../utils/formatAmount'
import { assemblePersonalExpense } from '../../assemblers/expensesAssembler'

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

interface Request {
  date: string
}

const PersonalDashboard: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [balance, setBalance] = useState<String>()
  const loadExpenses = useCallback(async (date?: string) => {
    const token = sessionStorage.getItem('@expenses:token')
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params: { date },
    }
    const { data } = await api.get('/expenses/personalBalance', config)
    const expenseList = data.expenses
      .sort((a: { date: string }, b: { date: string }) => ((a.date < b.date) ? 1 : -1))
      .map(assemblePersonalExpense)
    setExpenses(expenseList)
    setBalance(formatAmount(data.balance))
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
      <Header current="PersonalDashboard" />
      <Container>
        <CardContainer>
          <Card total>
            <header>
              <p>Balance</p>
              <img src={total} alt="Balance" />
            </header>
            <h1>{balance}</h1>
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
                  <td className="income">{expense.formattedAmount}</td>
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

export default PersonalDashboard
