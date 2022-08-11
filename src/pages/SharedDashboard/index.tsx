import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { AxiosRequestConfig } from 'axios'
import { format, startOfMonth } from 'date-fns'
import React, { useEffect, useRef, useState } from 'react'
import { HiOutlineSelector } from 'react-icons/hi'
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
import Select from '../../components/Select'
import constants from '../../constants/constants'
import { IExpense, IFilters, IFilterValues, IOrderByTypes } from '../../domains/dashboards'
import { useExpense } from '../../hooks/expense'
import api from '../../services/apiClient'
import { formatAmount } from '../../utils/formatAmount'
import { Card, CardContainer, Container, FormContainer, TableContainer } from './styles'

const SharedDashboard: React.FC = () => {
  const { balance, getBalance } = useExpense()
  const defaultDate = format(new Date(), constants.dateFormat)
  const formRef = useRef<FormHandles>(null)
  const [expenses, setExpenses] = useState<IExpense[]>([])
  const [pages, setPages] = useState([])
  const [currentPage, setCurrentPage] = useState<number | null>(null)
  const [currentFilters, setCurrentFilters] = useState<IFilters>({
    startDate: format(startOfMonth(new Date()), constants.dateFormat),
    endDate: defaultDate,
  })
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false)
  const [maxStartDate, setMaxStartDate] = useState<string>(defaultDate)
  const [minEndDate, setMinEndDate] = useState<string>()
  const [orderByColumns, setOrderByColumns] = useState<IOrderByTypes[]>(
    Object.values(constants.columnNames).map((columnName) => ({ orderBy: columnName, orderType: 'asc', isCurrent: false })),
  )
  const [filterValues, setFilterValues] = useState([])
  const shouldDisableFilterValues = filterValues.length === 0
  const isDeskTopScreen = window.innerWidth > 720
  const currentPageLimit: number = isDeskTopScreen ? constants.desktopPageLimit : constants.mobilePageLimit

  Modal.setAppElement('#root')

  const updatePageNumbers = (totalCount: number): void => {
    const totalPages: Number = Math.ceil(totalCount / currentPageLimit)
    const arrayPages = []
    for (let i = 1; i <= totalPages; i++) {
      arrayPages.push(i)
    }
    setPages(arrayPages)
  }

  const getOffset = (): number => ((currentPage || 1) * currentPageLimit) - currentPageLimit

  const getOrderByType = (columnName?: string): 'asc' | 'desc' => {
    const currentOrder = orderByColumns.find((orderByColumn) => orderByColumn.orderBy === columnName)
    return currentOrder.orderType === 'asc' ? 'desc' : 'asc'
  }

  const loadExpenses = async (filters?: IFilters, orderParams?: IOrderByTypes): Promise<void> => {
    const token = sessionStorage.getItem(constants.sessionStorage.token)
    const config: AxiosRequestConfig = {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        ...filters.startDate && { startDate: filters.startDate },
        ...filters.endDate && { endDate: filters.endDate },
        offset: getOffset(),
        limit: currentPageLimit,
        ...orderParams && { ...orderParams },
        ...filters.filterBy && {
          filterBy: constants.filterValues[filters.filterBy],
          filterValue: filters.filterValue,
        },
      },
    }
    const { data, headers } = await api.get('/expenses/shared', config)

    updatePageNumbers(headers[constants.headers.totalCount])
    setExpenses(data.map(assembleExpense))
  }

  const handleOpenNewExpenseModal = (): void => {
    setIsNewExpenseModalOpen(true)
  }

  const handleCloseNewExpenseModal = async (shouldLoadExpenses?: boolean): Promise<void> => {
    setIsNewExpenseModalOpen(false)
    if (shouldLoadExpenses) {
      await Promise.all([
        loadExpenses(currentFilters),
        getBalance(currentFilters),
      ])
    }
  }

  const handleSubmit = async (filters: IFilters): Promise<void> => {
    if (!filters.startDate && !filters.endDate) return
    if (filters.filterBy && !filters.filterValue) return
    await Promise.all([loadExpenses(filters), getBalance(filters)])
    setCurrentFilters(filters)
    setCurrentPage(1)
  }

  const handleSortTable = async (columnName: string): Promise<void> => {
    const orderParams: IOrderByTypes = columnName && {
      orderBy: columnName,
      orderType: getOrderByType(columnName),
    }
    await loadExpenses(currentFilters, orderParams)
    setOrderByColumns(orderByColumns.map((orderByColumn) => {
      const isSameColumn = orderByColumn.orderBy === columnName
      return {
        orderBy: orderByColumn.orderBy,
        orderType: isSameColumn ? orderParams.orderType : orderByColumn.orderType,
        isCurrent: isSameColumn,
      }
    }))
  }

  const sortList = (data:IFilterValues[], field: string): IFilterValues[] => data.sort((a, b) => ((a[field] > b[field]) ? 1 : -1))

  const loadFilterValues = (async (filterType: string): Promise<IFilterValues[]> => {
    const token = sessionStorage.getItem(constants.sessionStorage.token)
    const config = { headers: { Authorization: `Bearer ${token}` }}
    const { data } = await api.get(`/${filterType}`, config)
    return data
  })

  const handleSelectFilter = async (option: string): Promise<void> => {
    if (!option) {
      setFilterValues([])
      return
    }
    const filters = await loadFilterValues(option)
    const sortingKey = Object.keys(filters[0])[1]
    setFilterValues(sortList(filters, sortingKey))
  }

  useEffect(() => {
    async function loadDashboard(): Promise<void> {
      await Promise.all([
        loadExpenses(currentFilters),
        getBalance(currentFilters),
      ])
    }
    loadDashboard()
  }, [])

  useEffect(() => {
    async function refreshExpenses(): Promise<void> {
      if (currentPage) {
        const currentOrderParams = orderByColumns.find((orderByColumn) => orderByColumn.isCurrent)
        await loadExpenses(currentFilters, currentOrderParams)
      }
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
            <div className="filters">
              <Select
                icon={HiOutlineSelector}
                name="filterBy"
                options={constants.columnFilters}
                placeholder="Filter by"
                onChangeFunc={(option) => handleSelectFilter(option)}
              />
              <Select
                icon={HiOutlineSelector}
                name="filterValue"
                options={filterValues}
                placeholder="Filter value"
                shouldDisable={shouldDisableFilterValues}
              />
            </div>
            <div className="inputs">
              <Input
                icon={MdDateRange}
                name="startDate"
                type="date"
                defaultValue={currentFilters.startDate}
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
                    {isDeskTopScreen && (
                    <th onClick={() => handleSortTable(constants.columnNames.category)}>
                      <p>Category</p>
                    </th>
                    )}
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
            <Pagination currentPage={currentPage || 1} setCurrentPage={setCurrentPage} pages={pages} />
          </>
        )}
      </Container>
    </>
  )
}

export default SharedDashboard
