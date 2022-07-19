type IDefaultParams = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  disabled: boolean
  editMode: 'edit' | 'save'
  deleteMode: 'delete' | 'confirm'
  className: string | null
}

export interface IBank extends IDefaultParams {}

export interface ICategory extends Omit<IDefaultParams, 'name'> {
  description: string
}

export interface IPaymentType extends Omit<IDefaultParams, 'name'> {
  description: string
  hasStatement: boolean
}

export interface IStore extends IDefaultParams {}

export interface IPayload {
  name: string
}
