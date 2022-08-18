interface IBank {
  id: string
  name: string
  total: number
}

export interface IPayment {
  id: string
  description: string
  banks: Array<IBank>
  total: number
}

export interface ICategory {
  id: string
  description: string
  total: number
}

interface IReport {
  id : string
  name?: string
  payments?: Array<IPayment>
  categories?: Array<ICategory>
  total: number
}

export interface ISharedReport {
  requester: IReport,
  partner?: IReport,
  balance: number
}

export interface IFormData {
  month: string
  balanceType: string
}
