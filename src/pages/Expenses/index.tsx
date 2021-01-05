import React, {
  useCallback, useRef, useState, useEffect,
} from 'react'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import {
  endOfMonth, startOfMonth, format,
} from 'date-fns'
import * as Yup from 'yup'

import { useToast } from '../../hooks/toast'
import income from '../../assets/income.svg'
import outcome from '../../assets/outcome.svg'
import total from '../../assets/total.svg'
import api from '../../services/apiClient'
import { formatAmount, unformatAmount } from '../../utils/formatAmount'
import {
  Container, Card, CardContainer, FormContainer,
} from './styles'
import Input from '../../components/Input/defaultInput'
import CurrencyInput from '../../components/Input/currencyInput'
import Button from '../../components/Button'
import Header from '../../components/Header'
import getValidationErrors from '../../utils/getValidationErrors'

interface Balance {
  paying: string,
  payer: string,
  total: string
}

interface Expense {
  description: string,
  date: string,
  amount: string
}

const Expenses: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const [balance, setBalance] = useState<Balance>({} as Balance)

  const handleSubmit = useCallback(async (data: Expense) => {
    try {
      formRef.current?.setErrors({})
      const schema = Yup.object().shape({
        description: Yup.string().required('Description is required'),
        date: Yup.string().required('Date is required'),
        amount: Yup.string().required('Amount is required'),
      })
      await schema.validate(data, { abortEarly: false })
      const token = sessionStorage.getItem('@expenses:token')
      const config = { headers: { Authorization: `Bearer ${token}` }}
      const payload = {
        description: data.description,
        date: data.date,
        amount: unformatAmount(data.amount),
      }
      await api.post('/expenses', payload, config)
      formRef.current?.reset()
      addToast({
        type: 'success',
        title: 'Create expense',
        description: 'Expense created successfully',
      })
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
  }, [addToast])

  const dateMax = format(endOfMonth(new Date()), 'yyyy-MM-dd')
  const dateMin = format(startOfMonth(new Date()), 'yyyy-MM-dd')

  useEffect(() => {
    async function loadExpenses(): Promise<void> {
      const token = sessionStorage.getItem('@expenses:token')
      const config = { headers: { Authorization: `Bearer ${token}` }}
      const { data } = await api.get('/expenses/balance', config)

      const updatedBalance = {
        paying: formatAmount(data.paying),
        payer: formatAmount(data.payed),
        total: formatAmount(data.total),
      }

      setBalance(updatedBalance)
    }
    loadExpenses()
  }, [])

  return (
    <>
      <Header />
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
              <img src={total} alt="Saldo" />
            </header>
            <h1>{balance.total}</h1>
          </Card>
        </CardContainer>
        <FormContainer>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Create Expense</h1>
            <Input name="description" placeholder="Expense description" />
            <Input name="date" type="date" max={dateMax} min={dateMin} placeholder="Expense date" />
            <CurrencyInput id="amount" name="amount" placeholder="Expense amount" />
            <Button type="submit">Save</Button>
          </Form>
        </FormContainer>
      </Container>
    </>
  )
}

export default Expenses
