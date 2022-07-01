import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { AxiosRequestConfig } from 'axios'
import React, { FocusEvent, useCallback, useEffect, useRef, useState } from 'react'
import { AiFillEdit, AiOutlineSave } from 'react-icons/ai'
import { FaTrashAlt } from 'react-icons/fa'
import { MdTitle } from 'react-icons/md'
import * as Yup from 'yup'
import Button from '../../../components/Button'
import Header from '../../../components/Header'
import Input from '../../../components/Input'
import constants from '../../../constants/constants'
import errors from '../../../constants/errors'
import { useToast } from '../../../hooks/toast'
import { newStoreSchema } from '../../../schemas'
import api from '../../../services/apiClient'
import formatDate from '../../../utils/formatDate'
import getValidationErrors from '../../../utils/getValidationErrors'
import { Container, FormContainer, PageTitle, TableContainer } from './styles'

interface IStore {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  disabled: boolean
  mode: 'edit' | 'save'
  className: string | null
}

interface IPayload {
  name: string
}

const StoreManagement: React.FC = () => {
  const [stores, setStores] = useState<IStore[]>([])
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const [isDeskTopScreen] = useState<boolean>(window.innerWidth > 720)

  const loadStores = useCallback(async () => {
    const token = sessionStorage.getItem(constants.sessionStorage.token)
    const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` }}
    const { data } = await api.get('/stores', config)
    const storesList: IStore[] = data
      .sort((a: { name: string }, b: { name: string }) => ((a.name > b.name) ? 1 : -1))
      .map((store: any) => ({
        id: store.id,
        name: store.name,
        createdAt: formatDate(store.created_at),
        updatedAt: formatDate(store.updated_at),
        disabled: true,
        mode: 'edit',
      }))
    setStores(storesList)
  }, [])

  const handleNewStore = async (payload: IPayload) => {
    try {
      formRef.current?.setErrors({})
      await newStoreSchema.validate(payload, { abortEarly: false })
      const token = sessionStorage.getItem(constants.sessionStorage.token)
      const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` }}
      await api.post('/stores', payload, config)
      addToast({
        type: 'success',
        title: 'Create Store',
        description: 'Store created successfully',
      })
      formRef.current?.reset()
      await loadStores()
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const error = getValidationErrors(err)
        formRef.current?.setErrors(error)
        return
      }
      addToast({
        type: 'error',
        title: 'Create Store error',
        description: err.response.data.message === errors.alreadyExistingStore
          ? 'Store already exists'
          : 'Error on creating store',
      })
    }
  }

  const handleDelete = async (storeId: string) => {
    try {
      const token = sessionStorage.getItem(constants.sessionStorage.token)
      const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` }}
      await api.delete(`/stores/${storeId}`, config)
      addToast({
        type: 'success',
        title: 'Delete Store',
        description: 'Store deleted successfully',
      })
      await loadStores()
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Delete Store error',
        description: 'Error on deleting store',
      })
    }
  }

  const handleEditStore = (storeId: string) => {
    setStores(stores.map((store) => ({
      ...store,
      disabled: store.id !== storeId && store.mode === 'edit',
      mode: store.id === storeId ? 'save' : store.mode,
      className: store.id === storeId ? 'editable' : null,
    })))
  }

  const handleOnFocus = (target: HTMLInputElement) => {
    target.className = 'editable'
  }

  const handleUpdateStore = async (storeId: string) => {
    const input: HTMLInputElement = document.querySelector(`input#input-${storeId}`)
    const selectedStore = stores.find((store) => store.id === storeId)
    if (input.value && input.value !== selectedStore?.name) {
      const payload = { name: input.value }
      const token = sessionStorage.getItem(constants.sessionStorage.token)
      const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` }}
      try {
        await api.patch(`/stores/${storeId}`, payload, config)
        addToast({
          type: 'success',
          title: 'Update Store',
          description: 'Store updated successfully',
        })
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Create  Store error',
          description: err.response.data.message === errors.alreadyExitingUpdateStore
            ? errors.alreadyExitingUpdateStore
            : 'Error on creating store',
        })
        input.value = selectedStore.name
      }
    }
    setStores(stores.map((store) => ({
      ...store,
      name: store.id === storeId ? input.value : store.name,
      disabled: store.id === storeId,
      mode: store.id === storeId ? 'edit' : store.mode,
      className: store.id === storeId ? 'null' : store.className,
    })))
  }

  const handleOnBlur = (event: FocusEvent<HTMLInputElement>, storeId: string) => {
    const input = stores.find((store) => store.id === storeId)
    if (input) {
      event.target.className = null
      if (event.target.value === '') event.target.value = input.name
    }
  }

  useEffect(() => {
    async function loadDashboard(): Promise<void> {
      await loadStores()
    }
    loadDashboard()
  }, [loadStores])

  return (
    <>
      <Header current="Management" />
      <PageTitle>Store Management</PageTitle>
      <Container>
        <FormContainer>
          <Form ref={formRef} onSubmit={handleNewStore}>
            <Input icon={MdTitle} name="name" placeholder="Store" cleanError={() => formRef.current?.setErrors({})} />
            <Button type="submit">Save</Button>
          </Form>
        </FormContainer>
        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Store</th>
                <th>Created</th>
                {isDeskTopScreen && <th>Updated</th>}
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.id} id={store.id}>
                  <td className="name" onDoubleClick={() => handleEditStore(store.id)}>
                    <input
                      name="store-name"
                      type="text"
                      defaultValue={store.name}
                      disabled={store.disabled}
                      onBlur={(event) => handleOnBlur(event, store.id)}
                      id={`input-${store.id}`}
                      className={store.className}
                      onFocus={(event) => handleOnFocus(event.target)}
                    />
                  </td>
                  <td>{store.createdAt}</td>
                  {isDeskTopScreen && <td className="date-updated">{store.updatedAt}</td>}
                  <td>
                    <Button
                      type="button"
                      onClick={() => (store.mode === 'edit'
                        ? handleEditStore(store.id)
                        : handleUpdateStore(store.id))}
                    >
                      { store.mode === 'edit' ? <AiFillEdit color="#5636D3" /> : <AiOutlineSave color="#5636D3" /> }
                    </Button>
                  </td>
                  <td>
                    <Button type="button" onClick={() => handleDelete(store.id)}>
                      <FaTrashAlt color="#FF872C" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  )
}

export default StoreManagement
