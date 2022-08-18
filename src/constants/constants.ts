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
  menuTitles: {
    desktopTitles: {
      shared: 'Shared Dashboard',
      personal: 'Personal Dashboard',
      sharedBalance: 'Shared Balance',
      management: 'Management',
    },
    mobileTitles: {
      shared: 'Shared',
      personal: 'Personal',
      sharedBalance: 'Balance',
      management: 'Manage',
    },
  },
  dropdownItems: [
    {
      path: '/bankManagement',
      title: 'Bank',
    },
    {
      path: '/categoryManagement',
      title: 'Category',
    },
    {
      path: '/paymentTypeManagement',
      title: 'Payment Type',
    },
    {
      path: '/storeManagement',
      title: 'Store',
    },
  ],
  columnNames: {
    description: 'description',
    amount: 'amount',
    date: 'date',
    dueDate: 'due_date',
    category: 'category',
    paymentType: 'payment_type',
    bank: 'bank',
    store: 'store',
  },
  columnFilters: [
    {
      id: 'categories',
      description: 'Category',
    },
    {
      id: 'paymentType',
      description: 'Method',
    },
    {
      id: 'banks',
      description: 'Bank',
    },
    {
      id: 'stores',
      description: 'Store',
    },
  ],
  filterValues: {
    categories: 'category',
    paymentType: 'payment_type',
    banks: 'bank',
    stores: 'store',
  },
  sharedBalanceTypes: [
    {
      id: 'categories',
      description: 'Category',
    },
    {
      id: 'payments',
      description: 'Payment Type',
    },
  ],
}
