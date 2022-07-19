import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { AxiosRequestConfig } from 'axios'
import { format, startOfMonth } from 'date-fns'
import React, { useEffect, useRef, useState } from 'react'
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
  paymentType: string
  bank?: string
  store?: string
  dueDate: Date
  formattedDueDate?: string
  mobileFormatDate: string
  mobileFormatDueDate?: string
}

interface IDates {
  startDate?: string
  endDate?: string
}

const COLUMN_NAMES = {
  description: 'description',
  amount: 'amount',
  date: 'date',
  dueDate: 'due_date',
  category: 'category',
  paymentType: 'payment_type',
  bank: 'bank',
  store: 'store',
}

interface IOrderByTypes {
  orderBy: string
  orderType: 'asc' | 'desc'
  isCurrent?: boolean
}

const SharedDashboard: React.FC = () => {
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
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false)
  const [isDeskTopScreen] = useState<boolean>(window.innerWidth > 720)
  const [maxStartDate, setMaxStartDate] = useState<string>(defaultDate)
  const [minEndDate, setMinEndDate] = useState<string>()
  const [orderByColumns, setOrderByColumns] = useState<IOrderByTypes[]>(
    Object.values(COLUMN_NAMES).map((columnName) => ({ orderBy: columnName, orderType: 'asc', isCurrent: false })),
  )

  Modal.setAppElement('#root')

  const currentPageLimit = isDeskTopScreen ? constants.desktopPageLimit : constants.mobilePageLimit

  const updatePageNumbers = (totalCount: number) => {
    const totalPages: Number = Math.ceil(totalCount / currentPageLimit)
    const arrayPages = []
    for (let i = 1; i <= totalPages; i++) {
      arrayPages.push(i)
    }
    setPages(arrayPages)
  }

  const getOffset = () => (currentPage * currentPageLimit) - currentPageLimit

  const getOrderByType = (columnName?: string): 'asc' | 'desc' => {
    const currentOrder = orderByColumns.find((orderByColumn) => orderByColumn.orderBy === columnName)
    return currentOrder.orderType === 'asc' ? 'desc' : 'asc'
  }

  const loadExpenses = async (dates?: IDates, orderParams?: IOrderByTypes) => {
    const token = sessionStorage.getItem(constants.sessionStorage.token)
    const config: AxiosRequestConfig = {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        ...dates.startDate && { startDate: dates.startDate },
        ...dates.endDate && { endDate: dates.endDate },
        offset: getOffset(),
        limit: currentPageLimit,
        ...orderParams && { ...orderParams },
      },
    }
    const { data, headers } = await api.get('/expenses/shared', config)
    const expenseList = data
      .map(assembleExpense)

    updatePageNumbers(headers[constants.headers.totalCount])
    setExpenses(expenseList)
  }

  function handleOpenNewExpenseModal() {
    setIsNewExpenseModalOpen(true)
  }

  async function handleCloseNewExpenseModal(shouldLoadExpenses?: boolean) {
    setIsNewExpenseModalOpen(false)
    if (shouldLoadExpenses) await loadExpenses(currentDates)
  }

  const handleSubmit = async (dates: IDates): Promise<void> => {
    if (dates.startDate || dates.endDate) {
      await loadExpenses(dates)
      setCurrentDates(dates)
      setCurrentPage(1)
    }
  }

  const handleSortTable = async (columnName: string): Promise<void> => {
    const orderParams: IOrderByTypes = columnName && {
      orderBy: columnName,
      orderType: getOrderByType(columnName),
    }
    await loadExpenses(currentDates, orderParams)
    setOrderByColumns(orderByColumns.map((orderByColumn) => {
      const isSameColumn = orderByColumn.orderBy === columnName
      return {
        orderBy: orderByColumn.orderBy,
        orderType: isSameColumn ? orderParams.orderType : orderByColumn.orderType,
        isCurrent: isSameColumn,
      }
    }))
  }

  useEffect(() => {
    async function loadDashboard(): Promise<void> {
      await loadExpenses(currentDates)
      await getBalance(currentDates)
    }
    loadDashboard()
  }, [])

  useEffect(() => {
    async function refreshExpenses(): Promise<void> {
      const currentOrderParams = orderByColumns.find((orderByColumn) => orderByColumn.isCurrent)
      await loadExpenses(currentDates, currentOrderParams)
    }
    refreshExpenses()
  }, [currentPage])

  return (
    <>
      <Header current="SharedDashboard" />
      <NewExpenseModal isOpen={isNewExpenseModalOpen} onRequestClose={handleCloseNewExpenseModal} isDeskTopScreen={isDeskTopScreen} />
      <Container>
        <CardContainer>
          {isDeskTopScreen && (
            <>
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
            </>
          )}
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
            <Button type="submit">Search</Button>
          </Form>
        </FormContainer>
        {expenses.length > 0 && (
          <>
            <TableContainer>
              <table>
                <thead>
                  <tr>
                    <th onClick={() => handleSortTable(COLUMN_NAMES.description)}>
                      <p>Expense</p>
                    </th>
                    {isDeskTopScreen && <th onClick={() => handleSortTable(COLUMN_NAMES.category)}><p>Category</p></th>}
                    <th onClick={() => handleSortTable(COLUMN_NAMES.amount)}><p>Amount</p></th>
                    {isDeskTopScreen && <th onClick={() => handleSortTable(COLUMN_NAMES.paymentType)}><p>Method</p></th>}
                    <th onClick={() => handleSortTable(COLUMN_NAMES.date)}><p>Purchase</p></th>
                    <th onClick={() => handleSortTable(COLUMN_NAMES.dueDate)}>{isDeskTopScreen ? <p>Due Date</p> : <p>Due</p>}</th>
                    {isDeskTopScreen && <th onClick={() => handleSortTable(COLUMN_NAMES.bank)}><p>Bank</p></th>}
                    {isDeskTopScreen && <th onClick={() => handleSortTable(COLUMN_NAMES.store)}><p>Store</p></th>}
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td className="description">{expense.description}</td>
                      {isDeskTopScreen && <td>{expense.category}</td>}
                      <td className={expense.type}>{expense.formattedAmount}</td>
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

export default SharedDashboard
