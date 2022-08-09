interface IBank {
  id: string
  name: string
  total: number
}

interface IPayment {
  id: string
  description: string
  banks: Array<IBank>
  total: number
}

interface IReport {
  id : string
  name?: string
  payments?: Array<IPayment>
  total: number
}

export interface IConsolidatedReport {
  requester: IReport,
  partner?: IReport,
  balance: number
}

export interface IFormData {
  month: string
}
