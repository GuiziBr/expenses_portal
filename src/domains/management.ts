export interface IEntity {
  id: string
  name?: string
  description?: string
  disabled?: boolean
  className: string
  createdAt: string
  updatedAt: string
  editMode: 'edit' | 'save'
  deleteMode: 'delete' | 'confirm'
  hasStatement?: boolean
}

export interface IBank extends IEntity {}

export interface ICategory extends Omit<IEntity, 'name'> {
  description: string
}

export interface IPaymentType extends Omit<IEntity, 'name'> {
  description: string
}

export interface IStore extends IEntity {}

export interface IPayload {
  name?: string
  description?: string
  hasStatement?: Array<string>
}
