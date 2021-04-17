import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { AxiosRequestConfig } from 'axios'
import { format } from 'date-fns'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MdDateRange } from 'react-icons/md'
import { assemblePersonalExpense } from '../../assemblers/expensesAssembler'
import total from '../../assets/total.svg'
import Button from '../../components/Button'
import Header from '../../components/Header'
import Input from '../../components/Input'
import Pagination from '../../components/Pagination'
import constants from '../../constants'
import api from '../../services/apiClient'
import { formatAmount } from '../../utils/formatAmount'
import { Card, CardContainer, Container, FormContainer, TableContainer } from './styles'

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
  const [pages, setPages] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [currentDate, setCurrentDate] = useState<string>()

  const updatePageNumbers = (totalCount: number) => {
    const totalPages: Number = Math.ceil(totalCount / constants.pageLimit)
    const arrayPages = []
    for (let i = 1; i <= totalPages; i++) {
      arrayPages.push(i)
    }
    setPages(arrayPages)
  }

  const getOffset = () => (currentPage * constants.pageLimit) - constants.pageLimit

  const loadExpenses = useCallback(async (date: string = currentDate) => {
    const token = sessionStorage.getItem(constants.sessionStorage.token)
    const config: AxiosRequestConfig = {
      headers: { Authorization: `Bearer ${token}` },
      params: { date, offset: getOffset(), limit: constants.pageLimit },
    }
    const { data, headers } = await api.get('/expenses/personalBalance', config)
    const expenseList = data.expenses
      .sort((a: { date: string }, b: { date: string }) => ((a.date < b.date) ? 1 : -1))
      .map(assemblePersonalExpense)
    updatePageNumbers(headers[constants.headers.totalCount])
    setExpenses(expenseList)
    setBalance(formatAmount(data.balance))
    setCurrentDate(date)
  }, [currentPage])

  const handleSubmit = useCallback(async (data?: Request) => {
    await loadExpenses(data?.date)
    setCurrentPage(1)
  }, [])

  useEffect(() => {
    async function loadDashboard(): Promise<void> {
      await loadExpenses()
    }
    loadDashboard()
  }, [loadExpenses])

  const defaultDate = format(new Date(), constants.monthDateFormat)

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
            <Input icon={MdDateRange} name="date" type="month" defaultValue={defaultDate} max={defaultDate} />
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
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pages={pages} />
      </Container>
    </>
  )
}

export default PersonalDashboard
