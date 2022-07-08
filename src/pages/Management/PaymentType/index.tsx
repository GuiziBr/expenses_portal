import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { AxiosRequestConfig } from 'axios'
import React, { FocusEvent, useCallback, useEffect, useRef, useState } from 'react'
import { AiFillEdit, AiOutlineSave } from 'react-icons/ai'
import { BsCreditCard } from 'react-icons/bs'
import { FaTrashAlt } from 'react-icons/fa'
import { GiConfirmed } from 'react-icons/gi'
import { MdTitle } from 'react-icons/md'
import * as Yup from 'yup'
import Button from '../../../components/Button'
import CheckboxInput from '../../../components/Checkbox'
import Header from '../../../components/Header'
import Input from '../../../components/Input'
import constants from '../../../constants/constants'
import errors from '../../../constants/errors'
import { useToast } from '../../../hooks/toast'
import { newPaymentTypeSchema } from '../../../schemas'
import api from '../../../services/apiClient'
import formatDate from '../../../utils/formatDate'
import getValidationErrors from '../../../utils/getValidationErrors'
import { Container, FormContainer, PageTitle, TableContainer } from './styles'

interface IPaymentType {
  id: string
  description: string
  createdAt: string
  updatedAt: string
  disabled: boolean
  editMode: 'edit' | 'save'
  deleteMode: 'delete' | 'confirm'
  className: string | null
  hasStatement: boolean
}

interface IPayload {
  description: string
  hasStatement: Array<string>
}

const PaymentTypeManagement: React.FC = () => {
  const [paymentTypes, setPaymentTypes] = useState<IPaymentType[]>([])
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const [isDeskTopScreen] = useState<boolean>(window.innerWidth > 720)

  const loadPaymentTypes = useCallback(async () => {
    const token = sessionStorage.getItem(constants.sessionStorage.token)
    const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` }}
    const { data } = await api.get('/paymentType', config)
    const paymentTypesList: IPaymentType[] = data
      .sort((a: { description: string }, b: { description: string }) => ((a.description > b.description) ? 1 : -1))
      .map((paymentType: any) => ({
        id: paymentType.id,
        description: paymentType.description,
        createdAt: formatDate(paymentType.created_at),
        updatedAt: formatDate(paymentType.updated_at),
        disabled: true,
        editMode: 'edit',
        deleteMode: 'delete',
        hasStatement: paymentType.hasStatement,
      }))
    setPaymentTypes(paymentTypesList)
  }, [])

  const handleNewPaymentType = async (data: IPayload) => {
    try {
      formRef.current?.setErrors({})
      await newPaymentTypeSchema.validate(data, { abortEarly: false })
      const token = sessionStorage.getItem(constants.sessionStorage.token)
      const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` }}
      const payload = { description: data.description, hasStatement: !!data.hasStatement[0] }
      await api.post('/paymentType', payload, config)
      addToast({
        type: 'success',
        title: 'Create Payment Type',
        description: 'Payment Type created successfully',
      })
      formRef.current?.reset()
      await loadPaymentTypes()
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const error = getValidationErrors(err)
        formRef.current?.setErrors(error)
        return
      }
      addToast({
        type: 'error',
        title: 'Create Payment Type error',
        description: err.response.data.message === errors.alreadyExistingPaymentType
          ? 'Payment type already exists'
          : 'Error on creating payment type',
      })
    }
  }

  const handleConfirmDelete = async (paymentTypeId: string) => {
    try {
      const token = sessionStorage.getItem(constants.sessionStorage.token)
      const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` }}
      await api.delete(`/paymentType/${paymentTypeId}`, config)
      addToast({
        type: 'success',
        title: 'Delete Payment Type',
        description: 'Payment Type deleted successfully',
      })
      await loadPaymentTypes()
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Delete Payment Type error',
        description: 'Error on deleting payment type',
      })
    }
  }

  const handleEditPaymentType = (paymentTypeId: string) => {
    setPaymentTypes(paymentTypes.map((paymentType) => {
      const isSamePaymentType = paymentType.id === paymentTypeId
      return {
        ...paymentType,
        disabled: !isSamePaymentType && paymentType.editMode === 'edit',
        editMode: isSamePaymentType ? 'save' : paymentType.editMode,
        className: isSamePaymentType || paymentType.className === 'editable' ? 'editable' : null,
      }
    }))
  }

  const handleDeletePaymentType = (paymentTypeId: string) => {
    setPaymentTypes(paymentTypes.map((paymentType) => ({
      ...paymentType,
      deleteMode: paymentType.id === paymentTypeId ? 'confirm' : paymentType.deleteMode,
    })))
  }

  const handleOnFocus = (target: HTMLInputElement) => {
    target.className = 'editable'
  }

  const handleUpdatePaymentType = async (paymentTypeId: string) => {
    const input: HTMLInputElement = document.querySelector(`input#input-${paymentTypeId}`)
    const checkbox: HTMLInputElement = document.querySelector(`input#checkbox-${paymentTypeId}`)
    const selectedPaymentType = paymentTypes.find((paymentType) => paymentType.id === paymentTypeId)
    if ((input.value && input.value !== selectedPaymentType?.description) || (checkbox.checked !== selectedPaymentType.hasStatement)) {
      const payload = { description: input.value, hasStatement: checkbox.checked }
      const token = sessionStorage.getItem(constants.sessionStorage.token)
      const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` }}
      try {
        await api.patch(`/paymentType/${paymentTypeId}`, payload, config)
        addToast({
          type: 'success',
          title: 'Update Payment Type',
          description: 'Payment Type updated successfully',
        })
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Create Payment Type error',
          description: err.response.data.message === errors.alreadyExitingUpdatePaymentType
            ? errors.alreadyExitingUpdatePaymentType
            : 'Error on creating payment type',
        })
        input.value = selectedPaymentType.description
      }
    }
    setPaymentTypes(paymentTypes.map((paymentType) => (
      paymentType.id === paymentTypeId
        ? {
          ...paymentType,
          description: input.value,
          disabled: true,
          editMode: 'edit',
          className: null,
          hasStatement: checkbox.checked,
          deleteMode: 'delete',
        }
        : paymentType
    )))
  }

  const handleOnBlur = (event: FocusEvent<HTMLInputElement>, paymentTypeId: string) => {
    const input = paymentTypes.find((paymentType) => paymentType.id === paymentTypeId)
    if (input) {
      event.target.className = null
      if (event.target.value === '') event.target.value = input.description
    }
  }

  useEffect(() => {
    async function loadDashboard(): Promise<void> {
      await loadPaymentTypes()
    }
    loadDashboard()
  }, [loadPaymentTypes])

  return (
    <>
      <Header current="Management" />
      <PageTitle>Payment Type Management</PageTitle>
      <Container>
        <FormContainer>
          <Form ref={formRef} onSubmit={handleNewPaymentType}>
            <Input
              icon={MdTitle}
              name="description"
              placeholder="Payment Type"
              cleanError={() => formRef.current?.setErrors({})}
              maxLength={20}
            />
            <CheckboxInput
              icon={BsCreditCard}
              name="hasStatement"
              options={[{ id: 'hasStatement', value: 'hasStatement', label: 'Statement' }]}
              defaultOnChange={() => {}}
            />
            <Button type="submit">Save</Button>
          </Form>
        </FormContainer>
        {paymentTypes.length > 0 && (
          <TableContainer>
            <table>
              <thead>
                <tr>
                  <th>Payment Type</th>
                  <th>{isDeskTopScreen ? 'Statement' : <BsCreditCard />}</th>
                  {isDeskTopScreen && <th>Created</th>}
                  {isDeskTopScreen && <th>Updated</th>}
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {paymentTypes.map((paymentType) => (
                  <tr key={paymentType.id} id={paymentType.id}>
                    <td className="description" onDoubleClick={() => handleEditPaymentType(paymentType.id)}>
                      <input
                        name="payment-description"
                        type="text"
                        defaultValue={paymentType.description}
                        disabled={paymentType.disabled}
                        onBlur={(event) => handleOnBlur(event, paymentType.id)}
                        id={`input-${paymentType.id}`}
                        className={paymentType.className}
                        onFocus={(event) => handleOnFocus(event.target)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        id={`checkbox-${paymentType.id}`}
                        value="hasStatement"
                        disabled={paymentType.disabled}
                        defaultChecked={paymentType.hasStatement}
                      />
                    </td>
                    {isDeskTopScreen && <td className="date-created">{paymentType.createdAt}</td>}
                    {isDeskTopScreen && <td className="date-updated">{paymentType.updatedAt}</td>}
                    <td>
                      <Button
                        type="button"
                        onClick={() => (paymentType.editMode === 'edit'
                          ? handleEditPaymentType(paymentType.id)
                          : handleUpdatePaymentType(paymentType.id))}
                      >
                        { paymentType.editMode === 'edit' ? <AiFillEdit color="#5636D3" /> : <AiOutlineSave color="#5636D3" /> }
                      </Button>
                    </td>
                    <td>
                      <Button
                        type="button"
                        onClick={() => (paymentType.deleteMode === 'delete'
                          ? handleDeletePaymentType(paymentType.id)
                          : handleConfirmDelete(paymentType.id))}
                      >
                        {paymentType.deleteMode === 'delete' ? <FaTrashAlt color="#FF872C" /> : <GiConfirmed color="#FF872C" />}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableContainer>
        )}
      </Container>
    </>
  )
}

export default PaymentTypeManagement
