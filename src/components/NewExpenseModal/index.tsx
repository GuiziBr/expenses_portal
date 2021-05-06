import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { endOfDay, format, startOfMonth } from 'date-fns'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { HiOutlineCurrencyDollar, HiOutlineSelector } from 'react-icons/hi'
import { IoMdCheckboxOutline } from 'react-icons/io'
import { MdDateRange, MdTitle } from 'react-icons/md'
import Modal from 'react-modal'
import * as Yup from 'yup'
import constants from '../../constants'
import { useBalance } from '../../hooks/balance'
import { useToast } from '../../hooks/toast'
import api from '../../services/apiClient'
import { formatAmount, unformatAmount } from '../../utils/formatAmount'
import getValidationErrors from '../../utils/getValidationErrors'
import Button from '../Button'
import CheckboxInput from '../Checkbox'
import Input from '../Input'
import Select from '../Select'
import { FormContainer } from './styles'
import closeImg from '../../assets/close.svg'

interface NewExpenseModalProps {
  isOpen: boolean
  onRequestClose: () => void
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

export function NewExpenseModal({ isOpen, onRequestClose }: NewExpenseModalProps) {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const [balance, setBalance] = useState<Balance>({} as Balance)
  const [categories, setCategories] = useState<Category[]>([])

  const loadCategories = useCallback(async () => {
    const token = sessionStorage.getItem(constants.sessionStorage.token)
    const config = { headers: { Authorization: `Bearer ${token}` } }
    const { data } = await api.get('/categories', config)
    setCategories(data)
  }, [])

  const updateBalance = useCallback(async () => {
    const balanceString = sessionStorage.getItem(constants.sessionStorage.balance)
    if (balanceString) {
      const parsedBalance = JSON.parse(balanceString)
      const updatedBalance = {
        paying: formatAmount(parsedBalance.paying),
        payed: formatAmount(parsedBalance.payed),
        total: formatAmount(parsedBalance.total),
      }
      setBalance(updatedBalance)
    }
  }, [])

  const handleSubmit = useCallback(async (data: Expense) => {
    try {
      formRef.current?.setErrors({})
      const schema = Yup.object().shape({
        description: Yup.string().required(constants.schemaValidationError.description),
        category: Yup.string().required(constants.schemaValidationError.category),
        date: Yup.string().required(constants.schemaValidationError.date),
        amount: Yup.string().required(constants.schemaValidationError.amount),
      })
      await schema.validate(data, { abortEarly: false })
      const token = sessionStorage.getItem(constants.sessionStorage.token)
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const payload = {
        description: data.description,
        category_id: data.category,
        date: data.date,
        amount: unformatAmount(data.amount),
        personal: data.options[0] === constants.expenseModel.personal,
        split: data.options[0] === constants.expenseModel.split,
      }
      await api.post('/expenses', payload, config)
      await updateBalance()
      addToast({
        type: 'success',
        title: constants.toastSuccess.title,
        description: constants.toastSuccess.description,
      })
      formRef.current?.reset()
      onRequestClose()
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err)
        formRef.current?.setErrors(errors)
        return
      }
      addToast({
        type: 'error',
        title: constants.toastError.title,
        description: constants.toastError.description,
      })
    }
  }, [addToast, updateBalance])

  useEffect(() => {
    async function loadExpenses(): Promise<void> {
      await updateBalance()
      await loadCategories()
    }
    loadExpenses()
  }, [updateBalance, loadCategories])

  const checkboxOptions: CheckboxOption[] = constants.createExpenseCheckboxOptions

  const dateMax = format(endOfDay(new Date()), constants.dateFormat)
  const dateMin = format(startOfMonth(new Date()), constants.dateFormat)

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      <button type="button" onClick={onRequestClose} className="react-modal-close">
        <img src={closeImg} alt="Close Modal" />
      </button>
      <FormContainer>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h2>Create Expense</h2>
          <Input icon={MdTitle} name="description" placeholder="Expense description" />
          <Select icon={HiOutlineSelector} name="category" options={categories} />
          <Input icon={MdDateRange} name="date" type="date" max={dateMax} min={dateMin} isClickable />
          <Input icon={HiOutlineCurrencyDollar} name="amount" placeholder="99,99" isCurrency />
          <CheckboxInput icon={IoMdCheckboxOutline} name="options" options={checkboxOptions} />
          <Button type="submit">Save</Button>
        </Form>
      </FormContainer>
    </Modal>
  )
}
