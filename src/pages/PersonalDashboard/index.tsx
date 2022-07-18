import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { AxiosRequestConfig } from 'axios'
import { format, startOfMonth } from 'date-fns'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MdDateRange } from 'react-icons/md'
import Modal from 'react-modal'
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri'
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

interface IExpense {
  id: string
  description: string
  category: string
  amount: number
  formattedAmount: string
  formattedDate: string
  type: 'income' | 'outcome'
  date: Date
  dueDate: Date
  paymentType: string
  bank?: string
  store?: string
  formattedDueDate?: string
  mobileFormatDate: string
  mobileFormatDueDate?: string
}

interface IDates {
  startDate?: string
  endDate?: string
}

const PersonalDashboard: React.FC = () => {
  const defaultDate = format(new Date(), constants.dateFormat)
  const formRef = useRef<FormHandles>(null)
  const [expenses, setExpenses] = useState<IExpense[]>([])
  const [pages, setPages] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [currentDates, setCurrentDates] = useState<IDates>({
    startDate: format(startOfMonth(new Date()), constants.dateFormat),
    endDate: defaultDate,
  })
  const { balance, getBalance } = useExpense()
  const [isDeskTopScreen] = useState<boolean>(window.innerWidth > 720)
  const [maxStartDate, setMaxStartDate] = useState<string>(defaultDate)
  const [minEndDate, setMinEndDate] = useState<string>()

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

  const loadExpenses = useCallback(async (dates?: IDates, orderBy?: string) => {
    const token = sessionStorage.getItem(constants.sessionStorage.token)
    const config: AxiosRequestConfig = {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        ...dates.startDate && { startDate: dates.startDate },
        ...dates.endDate && { endDate: dates.endDate },
        offset: getOffset(),
        limit: currentPageLimit,
        orderBy,
      },
    }
    const { data, headers } = await api.get('/expenses/personal', config)
    const expenseList = data.map(assemblePersonalExpense)

    updatePageNumbers(headers[constants.headers.totalCount])
    setExpenses(expenseList)
    if (dates.startDate || dates.endDate) {
      setCurrentDates(dates)
      await getBalance(dates)
    }
  }, [currentPage])

  function handleOpenNewExpenseModal() {
    setIsNewExpenseModalOpen(true)
  }

  async function handleCloseNewExpenseModal(shouldLoadExpenses?: boolean) {
    setIsNewExpenseModalOpen(false)
    if (shouldLoadExpenses) await loadExpenses(currentDates)
  }

  const handleSubmit = useCallback(async (dates: IDates) => {
    if (dates.startDate || dates.endDate) {
      await loadExpenses(dates)
      setCurrentPage(1)
    }
  }, [])

  useEffect(() => {
    async function loadDashboard(): Promise<void> {
      await loadExpenses(currentDates)
      await getBalance(currentDates)
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
            <div className="inputs">
              <Input
                icon={MdDateRange}
                name="startDate"
                type="date"
                defaultValue={currentDates.startDate}
                max={maxStartDate}
                onChange={(e) => setMinEndDate(e.currentTarget.value)}
              />
              <Input
                icon={MdDateRange}
                name="endDate"
                type="date"
                defaultValue={defaultDate}
                max={defaultDate}
                min={minEndDate}
                onChange={(e) => setMaxStartDate(e.currentTarget.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </Form>
        </FormContainer>
        {expenses.length > 0 && (
          <>
            <TableContainer>
              <table>
                <thead>
                  <tr>
                    <th onClick={() => loadExpenses(currentDates, 'description')}>
                      <p>Expense</p>
                    </th>
                    {isDeskTopScreen && <th><p>Category</p></th>}
                    <th><p>Amount</p></th>
                    {isDeskTopScreen && <th><p>Method</p></th>}
                    <th><p>Purchase</p></th>
                    <th>{isDeskTopScreen ? <p>Due Date</p> : <p>Due</p>}</th>
                    {isDeskTopScreen && <th><p>Bank</p></th>}
                    {isDeskTopScreen && <th><p>Store</p></th>}
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td className="description">{expense.description}</td>
                      {isDeskTopScreen && <td>{expense.category}</td>}
                      <td className="income">{expense.formattedAmount}</td>
                      {isDeskTopScreen && <td>{expense.paymentType}</td>}
                      <td>{isDeskTopScreen ? expense.formattedDate : expense.mobileFormatDate}</td>
                      <td>{isDeskTopScreen ? expense.formattedDueDate : expense.mobileFormatDueDate}</td>
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
