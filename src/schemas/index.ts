import * as Yup from 'yup'
import constants from '../constants'

export const signInSchema = Yup.object({
  email: Yup.string().required(constants.schemaValidationError.email).email(constants.schemaValidationError.emailFormat),
  password: Yup.string().required(constants.schemaValidationError.password),
})

export const newExpenseSchema = Yup.object().shape({
  description: Yup.string().required(constants.schemaValidationError.description),
  category: Yup.string().required(constants.schemaValidationError.category),
  date: Yup.string().required(constants.schemaValidationError.date),
  amount: Yup.string().required(constants.schemaValidationError.amount),
  paymentType: Yup.string().required(constants.schemaValidationError.paymentType),
})
