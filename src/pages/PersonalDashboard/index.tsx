import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { AxiosRequestConfig } from 'axios'
import { format } from 'date-fns'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MdDateRange } from 'react-icons/md'
import Modal from 'react-modal'
import { assemblePersonalExpense } from '../../assemblers/expensesAssembler'
import total from '../../assets/total.svg'
import Button from '../../components/Button'
import Header from '../../components/Header'
import Input from '../../components/Input'
import { NewExpenseModal } from '../../components/NewExpenseModal'
import Pagination from '../../components/Pagination'
import constants from '../../constants/constants'
import { useExpense } from '../../hooks/expense'
import api from '../../services/apiClient'
import { formatAmount } from '../../utils/formatAmount'
import { Card, CardContainer, Container, FormContainer, TableContainer } from './styles'

interface Expense {
  id: string
  description: string
  category: string
  amount: number
  formattedAmount: string
  formattedDate: string
  type: 'income' | 'outcome'
  date: Date
  paymentType: string
  bank?: string
  store?: string
}

interface Request {
  date: string
}

const PersonalDashboard: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [pages, setPages] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [currentDate, setCurrentDate] = useState<string>()
  const { balance, getBalance } = useExpense()
  const [isDeskTopScreen] = useState<boolean>(window.innerWidth > 720)
  const defaultDate = format(new Date(), constants.monthDateFormat)

  Modal.setAppElement('#root')

  const currentPageLimit = isDeskTopScreen ? constants.desktopPageLimit : constants.mobilePageLimit

  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false)

  const updatePageNumbers = (totalCount: number) => {
    const totalPages: Number = Math.ceil(totalCount / currentPageLimit)
    const arrayPages = []
    for (let i = 1; i <= totalPages; i++) {
      arrayPages.push(i)
    }
    setPages(arrayPages)
  }

  const getOffset = () => (currentPage * currentPageLimit) - currentPageLimit

  const loadExpenses = useCallback(async (date?: string) => {
    const token = sessionStorage.getItem(constants.sessionStorage.token)
    const config: AxiosRequestConfig = {
      headers: { Authorization: `Bearer ${token}` },
      params: { date: date || currentDate, offset: getOffset(), limit: currentPageLimit },
    }
    const { data, headers } = await api.get('/expenses/personal', config)
    const expenseList = data
      .sort((a: { date: string }, b: { date: string }) => ((a.date < b.date) ? 1 : -1))
      .map(assemblePersonalExpense)
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
  }, [])

  useEffect(() => {
    async function loadDashboard(): Promise<void> {
      await loadExpenses()
      await getBalance(currentDate)
    }
    loadDashboard()
  }, [loadExpenses])

  return (
    <>
      <Header current="PersonalDashboard" />
      <NewExpenseModal isOpen={isNewExpenseModalOpen} onRequestClose={handleCloseNewExpenseModal} isDeskTopScreen={isDeskTopScreen} />
      <Container>
        <CardContainer>
          <Card total>
            <header>
              <p>Balance</p>
              <img src={total} alt="Balance" />
            </header>
            <h1>{formatAmount(balance.personalBalance)}</h1>
          </Card>
        </CardContainer>
        <FormContainer>
          <Button type="button" onClick={handleOpenNewExpenseModal}>Create Expense</Button>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Input icon={MdDateRange} name="date" type="month" defaultValue={defaultDate} max={defaultDate} />
            <Button type="submit">Search</Button>
          </Form>
        </FormContainer>
        {expenses.length > 0 && (
          <>
            <TableContainer>
              <table>
                <thead>
                  <tr>
                    <th>Expense</th>
                    {isDeskTopScreen && <th>Category</th>}
                    <th>Amount</th>
                    {isDeskTopScreen && <th>Type</th>}
                    <th>Date</th>
                    {isDeskTopScreen && <th>Bank</th>}
                    {isDeskTopScreen && <th>Store</th>}
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td className="description">{expense.description}</td>
                      {isDeskTopScreen && <td>{expense.category}</td>}
                      <td className="income">{expense.formattedAmount}</td>
                      {isDeskTopScreen && <td>{expense.paymentType}</td>}
                      <td>{expense.formattedDate}</td>
                      {isDeskTopScreen && <td>{expense.bank}</td>}
                      {isDeskTopScreen && <td>{expense.store}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableContainer>
            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pages={pages} />
          </>
        )}
      </Container>
    </>
  )
}

export default PersonalDashboard
