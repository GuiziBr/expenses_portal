import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { AxiosRequestConfig } from 'axios'
import { format } from 'date-fns'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MdDateRange } from 'react-icons/md'
import Modal from 'react-modal'
import { assembleExpense } from '../../assemblers/expensesAssembler'
import income from '../../assets/income.svg'
import outcome from '../../assets/outcome.svg'
import total from '../../assets/total.svg'
import Button from '../../components/Button'
import Header from '../../components/Header'
import Input from '../../components/Input'
import { NewExpenseModal } from '../../components/NewExpenseModal'
import Pagination from '../../components/Pagination'
import constants from '../../constants'
import { useExpense } from '../../hooks/expense'
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

const SharedDashboard: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [pages, setPages] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [currentDate, setCurrentDate] = useState<string>()
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false)
  const defaultDate = format(new Date(), constants.monthDateFormat)

  const { balance, getBalance } = useExpense()

  Modal.setAppElement('#root')

  const updatePageNumbers = (totalCount: number) => {
    const totalPages: Number = Math.ceil(totalCount / constants.pageLimit)
    const arrayPages = []
    for (let i = 1; i <= totalPages; i++) {
      arrayPages.push(i)
    }
    setPages(arrayPages)
  }

  const getOffset = () => (currentPage * constants.pageLimit) - constants.pageLimit

  const loadExpenses = useCallback(async (date?: string) => {
    const token = sessionStorage.getItem(constants.sessionStorage.token)
    const config: AxiosRequestConfig = {
      headers: { Authorization: `Bearer ${token}` },
      params: { date: date || currentDate, offset: getOffset(), limit: constants.pageLimit },
    }
    const { data, headers } = await api.get('/expenses/shared', config)
    const expenseList = data
      .sort((a: { date: string }, b: { date: string }) => ((a.date < b.date) ? 1 : -1))
      .map(assembleExpense)

    updatePageNumbers(headers[constants.headers.totalCount])
    setExpenses(expenseList)
    if (date) {
      setCurrentDate(date)
      await getBalance(date)
    }
  }, [currentPage])

  function handleOpenNewExpenseModal() {
    setIsNewExpenseModalOpen(true)
  }

  async function handleCloseNewExpenseModal() {
    setIsNewExpenseModalOpen(false)
    await loadExpenses()
  }

  const handleSubmit = useCallback(async (data: Request) => {
    await loadExpenses(data.date)
    setCurrentPage(1)
  }, [loadExpenses])

  useEffect(() => {
    async function loadDashboard(): Promise<void> {
      await loadExpenses()
      await getBalance(currentDate)
    }
    loadDashboard()
  }, [loadExpenses])

  return (
    <>
      <Header current="SharedDashboard" />
      <NewExpenseModal isOpen={isNewExpenseModalOpen} onRequestClose={handleCloseNewExpenseModal} />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Incomes</p>
              <img src={income} alt="Income" />
            </header>
            <h1>{formatAmount(balance.sharedBalance?.paying)}</h1>
          </Card>
          <Card>
            <header>
              <p>Outcomes</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1>{formatAmount(balance.sharedBalance?.payed)}</h1>
          </Card>
          <Card total>
            <header>
              <p>Balance</p>
              <img src={total} alt="Balance" />
            </header>
            <h1>{formatAmount(balance.sharedBalance?.total)}</h1>
          </Card>
        </CardContainer>
        <FormContainer>
          <Button type="button" onClick={handleOpenNewExpenseModal}>Create Expense</Button>
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
                  <td className={expense.type}>{expense.formattedAmount}</td>
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

export default SharedDashboard
