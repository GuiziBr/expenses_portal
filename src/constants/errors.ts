export default {
  providerErrorMsg: (context: string, provider: string) => `${context} must be used within an ${provider}`,
  schemaValidationError: {
    description: 'Description is required',
    category: 'Category is required',
    date: 'Date is required',
    amount: 'Amount is required',
    email: 'E-mail is required',
    emailFormat: 'Invalid e-mail format',
    password: 'Password is required',
    paymentType: 'Payment type is required',
  },
  alreadyExistingExpense: 'This expense is already registered',
  toastErrors: {
    title: {
      authentication: 'Authentication error',
      creation: 'Create expense error',
    },
    description: {
      existingExpense: 'This expense is already registered for this day',
      creation: 'Error on creating expense',
      login: 'Error on login',
    },
  },
}
