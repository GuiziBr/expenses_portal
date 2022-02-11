export default {
  desktopPageLimit: 5,
  mobilePageLimit: 10,
  createExpenseCheckboxOptions: {
    desktopLabel: [
      { id: 'personal', value: 'personal', label: 'Personal Expense' },
      { id: 'split', value: 'split', label: 'Split Expense' },
    ],
    mobileLabel: [
      { id: 'personal', value: 'personal', label: 'Personal' },
      { id: 'split', value: 'split', label: 'Split' },
    ],
  },
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
  toastSuccess: {
    title: 'Create expense',
    description: 'Expense created successfully',
  },
  expenseModel: {
    personal: 'personal',
    split: 'split',
  },
  headers: { totalCount: 'x-total-count' },
}
