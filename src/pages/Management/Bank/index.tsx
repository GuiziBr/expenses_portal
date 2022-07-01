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
import { newBankSchema } from '../../../schemas'
import api from '../../../services/apiClient'
import formatDate from '../../../utils/formatDate'
import getValidationErrors from '../../../utils/getValidationErrors'
import { Container, FormContainer, PageTitle, TableContainer } from './styles'

interface IBank {
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

const BankManagement: React.FC = () => {
  const [banks, setBanks] = useState<IBank[]>([])
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const [isDeskTopScreen] = useState<boolean>(window.innerWidth > 720)

  const loadBanks = useCallback(async () => {
    const token = sessionStorage.getItem(constants.sessionStorage.token)
    const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` }}
    const { data } = await api.get('/banks', config)
    const banksList: IBank[] = data
      .sort((a: { name: string }, b: { name: string }) => ((a.name > b.name) ? 1 : -1))
      .map((bank: any) => ({
        id: bank.id,
        name: bank.name,
        createdAt: formatDate(bank.created_at),
        updatedAt: formatDate(bank.updated_at),
        disabled: true,
        mode: 'edit',
      }))
    setBanks(banksList)
  }, [])

  const handleNewBank = async (payload: IPayload) => {
    try {
      formRef.current?.setErrors({})
      await newBankSchema.validate(payload, { abortEarly: false })
      const token = sessionStorage.getItem(constants.sessionStorage.token)
      const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` }}
      await api.post('/banks', payload, config)
      addToast({
        type: 'success',
        title: 'Create Bank',
        description: 'Bank created successfully',
      })
      formRef.current?.reset()
      await loadBanks()
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const error = getValidationErrors(err)
        formRef.current?.setErrors(error)
        return
      }
      addToast({
        type: 'error',
        title: 'Create Bank error',
        description: err.response.data.message === errors.alreadyExistingBank
          ? 'Bank already exists'
          : 'Error on creating bank',
      })
    }
  }

  const handleDelete = async (bankId: string) => {
    try {
      const token = sessionStorage.getItem(constants.sessionStorage.token)
      const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` }}
      await api.delete(`/banks/${bankId}`, config)
      addToast({
        type: 'success',
        title: 'Delete Bank',
        description: 'Bank deleted successfully',
      })
      await loadBanks()
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Delete Bank error',
        description: 'Error on deleting bank',
      })
    }
  }

  const handleEditBank = (bankId: string) => {
    setBanks(banks.map((bank) => ({
      ...bank,
      disabled: bank.id !== bankId && bank.mode === 'edit',
      mode: bank.id === bankId ? 'save' : bank.mode,
      className: bank.id === bankId ? 'editable' : null,
    })))
  }

  const handleOnFocus = (target: HTMLInputElement) => {
    target.className = 'editable'
  }

  const handleUpdateBank = async (bankId: string) => {
    const input: HTMLInputElement = document.querySelector(`input#input-${bankId}`)
    const selectedBank = banks.find((bank) => bank.id === bankId)
    if (input.value && input.value !== selectedBank?.name) {
      const payload = { name: input.value }
      const token = sessionStorage.getItem(constants.sessionStorage.token)
      const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` }}
      try {
        await api.patch(`/banks/${bankId}`, payload, config)
        addToast({
          type: 'success',
          title: 'Update Bank',
          description: 'Bank updated successfully',
        })
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Create Bank error',
          description: err.response.data.message === errors.alreadyExitingUpdateBank
            ? errors.alreadyExitingUpdateBank
            : 'Error on creating bank',
        })
        input.value = selectedBank.name
      }
    }
    setBanks(banks.map((bank) => ({
      ...bank,
      name: bank.id === bankId ? input.value : bank.name,
      disabled: bank.id === bankId,
      mode: bank.id === bankId ? 'edit' : bank.mode,
      className: bank.id === bankId ? 'null' : bank.className,
    })))
  }

  const handleOnBlur = (event: FocusEvent<HTMLInputElement>, bankId: string) => {
    const input = banks.find((bank) => bank.id === bankId)
    if (input) {
      event.target.className = null
      if (event.target.value === '') event.target.value = input.name
    }
  }

  useEffect(() => {
    async function loadDashboard(): Promise<void> {
      await loadBanks()
    }
    loadDashboard()
  }, [loadBanks])

  return (
    <>
      <Header current="Management" />
      <PageTitle>Bank Management</PageTitle>
      <Container>
        <FormContainer>
          <Form ref={formRef} onSubmit={handleNewBank}>
            <Input icon={MdTitle} name="name" placeholder="Bank" cleanError={() => formRef.current?.setErrors({})} />
            <Button type="submit">Save</Button>
          </Form>
        </FormContainer>
        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Bank</th>
                <th>Created</th>
                {isDeskTopScreen && <th>Updated</th>}
              </tr>
            </thead>
            <tbody>
              {banks.map((bank) => (
                <tr key={bank.id} id={bank.id}>
                  <td onDoubleClick={() => handleEditBank(bank.id)}>
                    <input
                      name="bank-name"
                      type="text"
                      defaultValue={bank.name}
                      disabled={bank.disabled}
                      onBlur={(event) => handleOnBlur(event, bank.id)}
                      id={`input-${bank.id}`}
                      className={bank.className}
                      onFocus={(event) => handleOnFocus(event.target)}
                    />
                  </td>
                  <td>{bank.createdAt}</td>
                  {isDeskTopScreen && <td className="date-updated">{bank.updatedAt}</td>}
                  <td>
                    <Button
                      type="button"
                      onClick={() => (bank.mode === 'edit'
                        ? handleEditBank(bank.id)
                        : handleUpdateBank(bank.id))}
                    >
                      { bank.mode === 'edit' ? <AiFillEdit color="#5636D3" /> : <AiOutlineSave color="#5636D3" /> }
                    </Button>
                  </td>
                  <td>
                    <Button type="button" onClick={() => handleDelete(bank.id)}>
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

export default BankManagement
