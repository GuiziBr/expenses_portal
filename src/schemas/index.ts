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
})
