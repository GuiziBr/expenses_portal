import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { AxiosRequestConfig } from 'axios'
import { format, startOfMonth } from 'date-fns'
import React, { useEffect, useRef, useState } from 'react'
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
import { IDates, IExpense, IOrderByTypes } from '../../domains/dashboards'
import { useExpense } from '../../hooks/expense'
import api from '../../services/apiClient'
import { formatAmount } from '../../utils/formatAmount'
import { Card, CardContainer, Container, FormContainer, TableContainer } from './styles'

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
  const [orderByColumns, setOrderByColumns] = useState<IOrderByTypes[]>(
    Object.values(constants.columnNames).map((columnName) => ({ orderBy: columnName, orderType: 'asc', isCurrent: false })),
  )
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false)

  Modal.setAppElement('#root')

  const currentPageLimit: number = isDeskTopScreen ? constants.desktopPageLimit : constants.mobilePageLimit

  const updatePageNumbers = (totalCount: number): void => {
    const totalPages: Number = Math.ceil(totalCount / currentPageLimit)
    const arrayPages = []
    for (let i = 1; i <= totalPages; i++) {
      arrayPages.push(i)
    }
    setPages(arrayPages)
  }

  const getOffset = (): number => (currentPage * currentPageLimit) - currentPageLimit

  const getOrderByType = (columnName?: string): 'asc' | 'desc' => {
    const currentOrder = orderByColumns.find((orderByColumn) => orderByColumn.orderBy === columnName)
    return currentOrder.orderType === 'asc' ? 'desc' : 'asc'
  }

  const loadExpenses = async (dates?: IDates, orderParams?: IOrderByTypes): Promise<void> => {
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
    const { data, headers } = await api.get('/expenses/personal', config)
    const expenseList = data.map(assemblePersonalExpense)

    updatePageNumbers(headers[constants.headers.totalCount])
    setExpenses(expenseList)
  }

  function handleOpenNewExpenseModal(): void {
    setIsNewExpenseModalOpen(true)
  }

  async function handleCloseNewExpenseModal(shouldLoadExpenses?: boolean): Promise<void> {
    setIsNewExpenseModalOpen(false)
    if (shouldLoadExpenses) {
      await Promise.all([
        loadExpenses(currentDates),
        getBalance(currentDates),
      ])
    }
  }

  const handleSubmit = async (dates: IDates): Promise<void> => {
    if (dates.startDate || dates.endDate) {
      await Promise.all([loadExpenses(dates), getBalance(dates)])
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
                    <th onClick={() => handleSortTable(constants.columnNames.description)}>
                      <p>Expense</p>
                    </th>
                    {isDeskTopScreen && <th onClick={() => handleSortTable(constants.columnNames.category)}><p>Category</p></th>}
                    <th onClick={() => handleSortTable(constants.columnNames.amount)}><p>Amount</p></th>
                    {isDeskTopScreen && <th onClick={() => handleSortTable(constants.columnNames.paymentType)}><p>Method</p></th>}
                    <th onClick={() => handleSortTable(constants.columnNames.date)}><p>Purchase</p></th>
                    <th onClick={() => handleSortTable(constants.columnNames.dueDate)}>
                      {isDeskTopScreen ? <p>Due Date</p> : <p>Due</p>}
                    </th>
                    {isDeskTopScreen && <th onClick={() => handleSortTable(constants.columnNames.bank)}><p>Bank</p></th>}
                    {isDeskTopScreen && <th onClick={() => handleSortTable(constants.columnNames.store)}><p>Store</p></th>}
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
