import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { AxiosRequestConfig } from 'axios'
import React, { Fragment, useRef, useState } from 'react'
import { HiOutlineSelector } from 'react-icons/hi'
import { MdDateRange } from 'react-icons/md'
import * as Yup from 'yup'
import income from '../../assets/income.svg'
import outcome from '../../assets/outcome.svg'
import total from '../../assets/total.svg'
import Button from '../../components/Button'
import Header from '../../components/Header'
import Input from '../../components/Input'
import Select from '../../components/Select'
import constants from '../../constants/constants'
import { ICategory, IFormData, IPayment, ISharedReport } from '../../domains/sharedBalance'
import { sharedBalanceSchema } from '../../schemas'
import api from '../../services/apiClient'
import { formatAmount } from '../../utils/formatAmount'
import getValidationErrors from '../../utils/getValidationErrors'
import { Card, CardContainer, Container, FormContainer, Table, TableContainer } from './styles'

const SharedBalance: React.FC = () => {
  const [isDeskTopScreen] = useState<boolean>(window.innerWidth > 720)
  const [sharedReport, setSharedReport] = useState<ISharedReport>()
  const formRef = useRef<FormHandles>(null)
  const [shareType, setShareType] = useState<string>('')

  const loadSharedBalance = async (year: number, month: number, balanceType: string): Promise<void> => {
    const token = sessionStorage.getItem(constants.sessionStorage.token)
    const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` }}
    const { data } = await api.get(`/balance/consolidated/${year}/${month}`, config)
    setShareType(balanceType)
    setSharedReport(data)
  }

  const handleSubmit = async (data: IFormData): Promise<void> => {
    try {
      formRef.current?.setErrors({})
      await sharedBalanceSchema.validate(data, { abortEarly: false })
      const { date: dateString, balanceType } = data
      const [yearString, monthString] = dateString.split('-')
      const year = Number(yearString)
      const month = Number(monthString)
      await loadSharedBalance(year, month, balanceType)
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const error = getValidationErrors(err)
        formRef.current?.setErrors(error)
      }
    }
  }

  const Payments = ({ payments, className }) => (
    payments.map((payment: IPayment) => (
      <Fragment key={payment.id}>
        <tr>
          <td className="payment-type" colSpan={2}>{payment.description}</td>
        </tr>
        {shareType === 'payments' && payment.banks.map((bank) => (
          <tr key={bank.id}>
            <td className="bank-name">{bank.name}</td>
            <td className="bank-total">{formatAmount(bank.total)}</td>
          </tr>
        ))}
        <tr>
          <td className={className} colSpan={2}>
            Total
            {' - '}
            {formatAmount(payment.total)}
          </td>
        </tr>
      </Fragment>
    ))
  )

  const Categories = ({ categories, className }) => (
    categories.map((category: ICategory) => (
      <Fragment key={category.id}>
        <tr>
          <td className="category-name">
            {category.description}
          </td>
          <td className={`category-total ${className}`}>
            Total
            {' - '}
            {formatAmount(category.total)}
          </td>
        </tr>
      </Fragment>
    ))
  )

  const clearFieldError = (fieldName: string): void => {
    if (formRef.current?.getFieldError(fieldName)) {
      formRef.current?.setFieldError(fieldName, '')
    }
  }

  const handleOnChangeInput = (fieldName: string): void => clearFieldError(fieldName)

  const handleOnChangeSelect = (_value?: string, fieldName?: string): void => clearFieldError(fieldName)

  return (
    <>
      <Header current="SharedBalance" />
      <Container>
        <CardContainer>
          {isDeskTopScreen && (
            <>
              <Card>
                <header>
                  <p>{sharedReport?.requester?.name || 'Requester'}</p>
                  <img src={income} alt="Income" />
                </header>
                <h1>{formatAmount(sharedReport?.requester.total || 0)}</h1>
              </Card>
              <Card>
                <header>
                  <p>{sharedReport?.partner?.name || 'Partner'}</p>
                  <img src={outcome} alt="Outcome" />
                </header>
                <h1>{formatAmount(sharedReport?.partner?.total || 0)}</h1>
              </Card>
            </>
          )}
          <Card total>
            <header>
              <p>Balance</p>
              <img src={total} alt="Balance" />
            </header>
            <h1>{formatAmount(sharedReport?.balance || 0)}</h1>
          </Card>
        </CardContainer>
        <FormContainer>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Select
              icon={HiOutlineSelector}
              name="balanceType"
              options={constants.sharedBalanceTypes}
              placeholder="Select type"
              onChangeFunc={handleOnChangeSelect}
            />
            <Input icon={MdDateRange} name="date" type="month" onChange={() => handleOnChangeInput('month')} />
            <Button type="submit">Search</Button>
          </Form>
        </FormContainer>
        {sharedReport && (
          <TableContainer>
            {sharedReport.requester[shareType].length > 0 && (
              <Table>
                <table>
                  <thead>
                    <tr>
                      <th colSpan={2}>{sharedReport.requester.name}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shareType === 'payments' ? (
                      <Payments payments={sharedReport.requester.payments} className="requester" />
                    ) : (
                      <Categories categories={sharedReport.requester.categories} className="requester" />
                    )}
                  </tbody>
                </table>
              </Table>
            )}
            {sharedReport.partner && (
              <Table>
                <table className="table-partner">
                  <thead>
                    <tr>
                      <th colSpan={2}>{sharedReport.partner.name}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shareType === 'payments' ? (
                      <Payments payments={sharedReport.partner.payments} className="partner" />
                    ) : (
                      <Categories categories={sharedReport.partner.categories} className="partner" />
                    )}
                  </tbody>
                </table>
              </Table>
            )}
          </TableContainer>
        )}
      </Container>
    </>
  )
}

export default SharedBalance
