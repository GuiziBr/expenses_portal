import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
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
  const [pages, setPages] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [currentDate, setCurrentDate] = useState<string>()
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false)

  Modal.setAppElement('#root')

  function handleOpenNewExpenseModal() {
    setIsNewExpenseModalOpen(true)
  }

  function handleCloseNewExpenseModal() {
    setIsNewExpenseModalOpen(false)
  }

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
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params: { date, offset: getOffset(), limit: constants.pageLimit },
    }
    const { data, headers } = await api.get('/expenses/shared', config)
    const expenseList = data
      .sort((a: { date: string }, b: { date: string }) => ((a.date < b.date) ? 1 : -1))
      .map(assembleExpense)

    const updatedBalance = {
      paying: formatAmount(data.paying),
      payer: formatAmount(data.payed),
      total: formatAmount(data.total),
    }
    updatePageNumbers(headers[constants.headers.totalCount])
    setExpenses(expenseList)
    setBalance(updatedBalance)
    setCurrentDate(date)
  }, [currentPage])

  const handleSubmit = useCallback(async (data?: Request) => {
    await loadExpenses(data?.date)
    setCurrentPage(1)
  }, [loadExpenses])

  useEffect(() => {
    async function loadDashboard(): Promise<void> {
      await loadExpenses()
    }
    loadDashboard()
  }, [loadExpenses])

  const defaultDate = format(new Date(), constants.monthDateFormat)

  return (
    <>
      <Header onOpenNewExpenseModal={handleOpenNewExpenseModal} current="SharedDashboard" />
      <NewExpenseModal isOpen={isNewExpenseModalOpen} onRequestClose={handleCloseNewExpenseModal} />
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
