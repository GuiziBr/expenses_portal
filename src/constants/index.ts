const constants = {
  pageLimit: 5,
  createExpenseCheckboxOptions: [
    { id: 'personal', value: 'personal', label: 'Personal Expense' },
    { id: 'split', value: 'split', label: 'Split Expense' },
  ],
  monthDateFormat: 'yyyy-MM',
  dateFormat: 'yyyy-MM-dd',
  expenseType: {
    income: 'income',
    outcome: 'outcome',
  },
  sessionStorage: {
    token: '@expenses:token',
    user: '@expenses:user',
    balance: '@expenses:balance',
  },
  providerErrorMsg: (context, provider) => `${context} must be used within an ${provider}`,
  schemaValidationError: {
    description: 'Description is required',
    category: 'Category is required',
    date: 'Date is required',
    amount: 'Amount is required',
    email: 'E-mail is required',
    emailFormat: 'Invalid e-mail format',
    password: 'Password is required',
  },
  toastSuccess: {
    title: 'Create expense',
    description: 'Expense created successfully',
  },
  toastError: {
    title: 'Create expense error',
    description: 'Error on creating expense',
  },
  toastAuthError: {
    title: 'Authentication error',
    description: 'Error on login',
  },
  expenseModel: {
    personal: 'personal',
    split: 'split',
  },
  headers: { totalCount: 'x-total-count' },
}

export default constants
