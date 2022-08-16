import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { AxiosRequestConfig } from 'axios'
import React, { FocusEvent, useEffect, useRef, useState } from 'react'
import { AiFillEdit, AiOutlineSave } from 'react-icons/ai'
import { FaTrashAlt } from 'react-icons/fa'
import { GiConfirmed } from 'react-icons/gi'
import { MdTitle } from 'react-icons/md'
import * as Yup from 'yup'
import Button from '../../../components/Button'
import Header from '../../../components/Header'
import Input from '../../../components/Input'
import Pagination from '../../../components/Pagination'
import constants from '../../../constants/constants'
import errors from '../../../constants/errors'
import { IPayload, IStore } from '../../../domains/management'
import { useToast } from '../../../hooks/toast'
import { newStoreSchema } from '../../../schemas'
import api from '../../../services/apiClient'
import formatDate from '../../../utils/formatDate'
import getValidationErrors from '../../../utils/getValidationErrors'
import { Container, FormContainer, PageTitle, TableContainer } from './styles'

const StoreManagement: React.FC = () => {
  const [stores, setStores] = useState<IStore[]>([])
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const [isDeskTopScreen] = useState<boolean>(window.innerWidth > 720)
  const [currentPage, setCurrentPage] = useState<number | null>(null)
  const [pages, setPages] = useState([])

  const currentPageLimit: number = isDeskTopScreen ? constants.desktopPageLimit : constants.mobilePageLimit

  const updatePageNumbers = (totalCount: number): void => {
    const totalPages: Number = Math.ceil(totalCount / currentPageLimit)
    const arrayPages = []
    for (let i = 1; i <= totalPages; i++) {
      arrayPages.push(i)
    }
    setPages(arrayPages)
  }

  const getOffset = (): number => ((currentPage || 1) * currentPageLimit) - currentPageLimit

  const loadStores = async () => {
    const token = sessionStorage.getItem(constants.sessionStorage.token)
    const config: AxiosRequestConfig = {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        offset: getOffset(),
        limit: currentPageLimit,
      },
    }
    const { data, headers } = await api.get('/stores', config)
    const storesList: IStore[] = data
      .sort((a: { name: string }, b: { name: string }) => ((a.name > b.name) ? 1 : -1))
      .map((store: any) => ({
        id: store.id,
        name: store.name,
        createdAt: formatDate(store.created_at),
        ...store.updatedAt && { updatedAt: formatDate(store.updated_at) },
        disabled: true,
        editMode: 'edit',
        deleteMode: 'delete',
      }))
    updatePageNumbers(headers[constants.headers.totalCount])
    setStores(storesList)
  }

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
      setCurrentPage(1)
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

  const handleConfirmDelete = async (storeId: string) => {
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
    setStores(stores.map((store) => {
      const isSameStore = store.id === storeId
      return {
        ...store,
        disabled: !isSameStore && store.editMode === 'edit',
        editMode: isSameStore ? 'save' : store.editMode,
        className: isSameStore || store.className === 'editable' ? 'editable' : null,
      }
    }))
  }

  const handleDeleteStore = (storeId: string) => {
    setStores(stores.map((store) => ({
      ...store,
      deleteMode: store.id === storeId ? 'confirm' : store.deleteMode,
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
    setStores(stores.map((store) => (
      store.id === storeId
        ? {
          ...store,
          name: input.value,
          disabled: true,
          editMode: 'edit',
          className: 'null',
          deleteMode: 'delete',
        }
        : store
    )))
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
  }, [])

  useEffect(() => {
    async function refreshStores(): Promise<void> {
      if (currentPage) await loadStores()
    }
    refreshStores()
  }, [currentPage])

  return (
    <>
      <Header current="Management" />
      <PageTitle>Store Management</PageTitle>
      <Container>
        <FormContainer>
          <Form ref={formRef} onSubmit={handleNewStore}>
            <Input icon={MdTitle} name="name" placeholder="Store" cleanError={() => formRef.current?.setErrors({})} maxLength={20} />
            <Button type="submit">Save</Button>
          </Form>
        </FormContainer>
        {stores.length > 0 && (
          <>
            <TableContainer>
              <table>
                <thead>
                  <tr>
                    <th>Store</th>
                    <th>Created</th>
                    {isDeskTopScreen && <th>Updated</th>}
                    <th>Edit</th>
                    <th>Delete</th>
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
                          onClick={() => (store.editMode === 'edit'
                            ? handleEditStore(store.id)
                            : handleUpdateStore(store.id))}
                        >
                          { store.editMode === 'edit' ? <AiFillEdit color="#5636D3" /> : <AiOutlineSave color="#5636D3" /> }
                        </Button>
                      </td>
                      <td>
                        <Button
                          type="button"
                          onClick={() => (store.deleteMode === 'delete'
                            ? handleDeleteStore(store.id)
                            : handleConfirmDelete(store.id))}
                        >
                          {store.deleteMode === 'delete' ? <FaTrashAlt color="#FF872C" /> : <GiConfirmed color="#FF872C" />}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableContainer>
            <Pagination currentPage={currentPage || 1} setCurrentPage={setCurrentPage} pages={pages} />
          </>
        )}

      </Container>
    </>
  )
}

export default StoreManagement
