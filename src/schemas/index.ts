import * as Yup from 'yup'
import errors from '../constants/errors'

export const signInSchema = Yup.object({
  email: Yup.string().required(errors.schemaValidationError.email).email(errors.schemaValidationError.emailFormat),
  password: Yup.string().required(errors.schemaValidationError.password),
})

export const newExpenseSchema = Yup.object().shape({
  description: Yup.string().required(errors.schemaValidationError.description),
  category: Yup.string().required(errors.schemaValidationError.category),
  date: Yup.string().required(errors.schemaValidationError.date),
  amount: Yup.string().required(errors.schemaValidationError.amount),
  paymentType: Yup.string().required(errors.schemaValidationError.paymentType),
  bank: Yup.string(),
  store: Yup.string(),
})

export const newPaymentTypeSchema = Yup.object().shape({ description: Yup.string().required(errors.schemaValidationError.paymentType) })

export const newCategorySchema = Yup.object().shape({ description: Yup.string().required(errors.schemaValidationError.category) })

export const newBankSchema = Yup.object().shape({ name: Yup.string().required(errors.schemaValidationError.bank) })

export const newStoreSchema = Yup.object().shape({ name: Yup.string().required(errors.schemaValidationError.bank) })

export const sharedBalanceSchema = Yup.object().shape({
  month: Yup.string().required(errors.schemaValidationError.month),
  balanceType: Yup.string().required(errors.schemaValidationError.balanceType),
})
