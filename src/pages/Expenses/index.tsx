import React, { useCallback, useRef, useState, useEffect } from 'react'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import { endOfDay, startOfMonth, format } from 'date-fns'
import * as Yup from 'yup'
import { HiOutlineCurrencyDollar, HiOutlineSelector } from 'react-icons/hi'
import { IoMdCheckboxOutline } from 'react-icons/io'
import { MdDateRange, MdTitle } from 'react-icons/md'

import { useToast } from '../../hooks/toast'
import { useBalance } from '../../hooks/balance'
import income from '../../assets/income.svg'
import outcome from '../../assets/outcome.svg'
import total from '../../assets/total.svg'
import api from '../../services/apiClient'
import { formatAmount, unformatAmount } from '../../utils/formatAmount'
import { Container, Card, CardContainer, FormContainer } from './styles'
import Input from '../../components/Input'
import Select from '../../components/Select'
import Button from '../../components/Button'
import Header from '../../components/Header'
import CheckboxInput from '../../components/Checkbox'
import getValidationErrors from '../../utils/getValidationErrors'

interface Balance {
  paying: string
  payed: string
  total: string
}

interface Expense {
  description: string
  category: string
  date: string
  amount: string
  options: [string]
}

interface Category {
  id: string
  description: string
}

interface CheckboxOption {
  id: string
  value: string
  label: string
}

const Expenses: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const { getBalance } = useBalance()
  const [balance, setBalance] = useState<Balance>({} as Balance)
  const [categories, setCategories] = useState<Category[]>([])

  const checkboxOptions: CheckboxOption[] = [
    { id: 'personal', value: 'personal', label: 'Personal Expense' },
    { id: 'split', value: 'split', label: 'Split Expense' },
  ]

  const loadCategories = useCallback(async () => {
    const token = sessionStorage.getItem('@expenses:token')
    const config = { headers: { Authorization: `Bearer ${token}` } }
    const { data } = await api.get('/categories', config)
    setCategories(data)
  }, [])

  const updateBalance = useCallback(async () => {
    await getBalance()
    const balanceString = sessionStorage.getItem('@expenses:balance')
    if (balanceString) {
      const parsedBalance = JSON.parse(balanceString)
      const updatedBalance = {
        paying: formatAmount(parsedBalance.paying),
        payed: formatAmount(parsedBalance.payed),
        total: formatAmount(parsedBalance.total),
      }
      setBalance(updatedBalance)
    }
  }, [getBalance])

  const handleSubmit = useCallback(async (data: Expense) => {
    try {
      formRef.current?.setErrors({})
      const schema = Yup.object().shape({
        description: Yup.string().required('Description is required'),
        category: Yup.string().required('Category is required'),
        date: Yup.string().required('Date is required'),
        amount: Yup.string().required('Amount is required'),
      })
      await schema.validate(data, { abortEarly: false })
      const token = sessionStorage.getItem('@expenses:token')
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const payload = {
        description: data.description,
        category_id: data.category,
        date: data.date,
        amount: unformatAmount(data.amount),
        personal: data.options[0] === 'personal',
        split: data.options[0] === 'split',
      }
      await api.post('/expenses', payload, config)
      await updateBalance()
      addToast({
        type: 'success',
        title: 'Create expense',
        description: 'Expense created successfully',
      })
      formRef.current?.reset()
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err)
        formRef.current?.setErrors(errors)
        return
      }
      addToast({
        type: 'error',
        title: 'Create expense error',
        description: 'Error on creating expense',
      })
    }
  }, [addToast, updateBalance])

  const dateMax = format(endOfDay(new Date()), 'yyyy-MM-dd')
  const dateMin = format(startOfMonth(new Date()), 'yyyy-MM-dd')

  useEffect(() => {
    async function loadExpenses(): Promise<void> {
      await updateBalance()
      await loadCategories()
    }
    loadExpenses()
  }, [updateBalance, loadCategories])

  return (
    <>
      <Header current="CreateExpense" />
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
            <h1>{balance.payed}</h1>
          </Card>
          <Card total>
            <header>
              <p>Balance</p>
              <img src={total} alt="Saldo" />
            </header>
            <h1>{balance.total}</h1>
          </Card>
        </CardContainer>
        <FormContainer>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Create Expense</h1>
            <Input icon={MdTitle} name="description" placeholder="Expense description" />
            <Select icon={HiOutlineSelector} name="category" options={categories} placeholder="Select a category" />
            <Input icon={MdDateRange} name="date" type="date" max={dateMax} min={dateMin} />
            <Input icon={HiOutlineCurrencyDollar} name="amount" placeholder="99,99" isCurrency />
            <CheckboxInput icon={IoMdCheckboxOutline} name="options" options={checkboxOptions} />
            <Button type="submit">Save</Button>
          </Form>
        </FormContainer>
      </Container>
    </>
  )
}

export default Expenses
