import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { AxiosRequestConfig } from 'axios'
import { endOfDay, format, startOfMonth } from 'date-fns'
import { useCallback, useEffect, useRef, useState } from 'react'
import { HiOutlineCurrencyDollar, HiOutlineSelector } from 'react-icons/hi'
import { IoMdCheckboxOutline } from 'react-icons/io'
import { MdDateRange, MdTitle } from 'react-icons/md'
import Modal from 'react-modal'
import * as Yup from 'yup'
import { assemblePayload } from '../../assemblers/expensesAssembler'
import closeImg from '../../assets/close.svg'
import constants from '../../constants/constants'
import errors from '../../constants/errors'
import { useExpense } from '../../hooks/expense'
import { useToast } from '../../hooks/toast'
import { newExpenseSchema } from '../../schemas'
import api from '../../services/apiClient'
import getValidationErrors from '../../utils/getValidationErrors'
import Button from '../Button'
import CheckboxInput from '../Checkbox'
import Input from '../Input'
import Select from '../Select'
import { FormContainer } from './styles'

interface NewExpenseModalProps {
  isOpen: boolean
  onRequestClose: () => void
  isDeskTopScreen: boolean
}

interface Category {
  id: string
  description: string
}

interface PaymentType {
  id: string
  description: string
}

interface CheckboxOption {
  id: string
  value: string
  label: string
}

interface Expense {
  description: string
  category: string
  date: string
  amount: string
  options: [string]
  paymentType: string
}

export function NewExpenseModal({ isOpen, onRequestClose, isDeskTopScreen }: NewExpenseModalProps) {
  const formRef = useRef<FormHandles>(null)
  const { createExpense } = useExpense()
  const { addToast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([])

  const sortList = (data:[], field: string) => data.sort((a, b) => ((a[field] > b[field]) ? 1 : -1))

  const loadCategories = useCallback(async () => {
    const token = sessionStorage.getItem(constants.sessionStorage.token)
    const config = { headers: { Authorization: `Bearer ${token}` }}
    const { data } = await api.get('/categories', config)
    setCategories(sortList(data, 'description'))
  }, [])

  const loadPaymentTypes = useCallback(async () => {
    const token = sessionStorage.getItem(constants.sessionStorage.token)
    const config = { headers: { Authorization: `Bearer ${token}` }}
    const { data } = await api.get('/paymentType', config)
    setPaymentTypes(sortList(data, 'description'))
  }, [])

  const handleSubmit = useCallback(async (data: Expense) => {
    try {
      formRef.current?.setErrors({})
      await newExpenseSchema.validate(data, { abortEarly: false })
      const token = sessionStorage.getItem(constants.sessionStorage.token)
      const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` }}
      const payload = assemblePayload(data)
      await createExpense(payload, config)
      addToast({
        type: 'success',
        title: constants.toastSuccess.title,
        description: constants.toastSuccess.description,
      })
      formRef.current?.reset()
      onRequestClose()
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const error = getValidationErrors(err)
        formRef.current?.setErrors(error)
        return
      }
      addToast({
        type: 'error',
        title: errors.toastErrors.title.creation,
        description: err.response.data.message === errors.alreadyExistingExpense
          ? errors.toastErrors.description.existingExpense
          : errors.toastErrors.description.creation,
      })
    }
  }, [addToast])

  useEffect(() => {
    async function loadExpenses(): Promise<void> {
      await Promise.all([
        loadCategories(),
        loadPaymentTypes(),
      ])
    }
    loadExpenses()
  }, [])

  const checkboxOptions: CheckboxOption[] = constants.createExpenseCheckboxOptions[isDeskTopScreen ? 'desktopLabel' : 'mobileLabel']

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
          <Select icon={HiOutlineSelector} name="category" options={categories} placeholder="Select category" />
          <Select icon={HiOutlineSelector} name="paymentType" options={paymentTypes} placeholder="Select payment Type" />
          <Input icon={MdDateRange} name="date" type="date" max={dateMax} min={dateMin} isClickable />
          <Input icon={HiOutlineCurrencyDollar} name="amount" placeholder="99,99" isCurrency />
          <CheckboxInput icon={IoMdCheckboxOutline} name="options" options={checkboxOptions} />
          <Button type="submit">Save</Button>
        </Form>
      </FormContainer>
    </Modal>
  )
}
