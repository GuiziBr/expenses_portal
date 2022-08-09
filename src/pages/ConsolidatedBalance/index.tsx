import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { AxiosRequestConfig } from 'axios'
import React, { Fragment, useRef, useState } from 'react'
import { MdDateRange } from 'react-icons/md'
import income from '../../assets/income.svg'
import outcome from '../../assets/outcome.svg'
import total from '../../assets/total.svg'
import Button from '../../components/Button'
import Header from '../../components/Header'
import Input from '../../components/Input'
import constants from '../../constants/constants'
import { IConsolidatedReport, IFormData } from '../../domains/consolidatedBalance'
import api from '../../services/apiClient'
import { formatAmount } from '../../utils/formatAmount'
import { Card, CardContainer, Container, FormContainer, Table, TableContainer } from './styles'

const ConsolidatedBalance: React.FC = () => {
  const [isDeskTopScreen] = useState<boolean>(window.innerWidth > 720)
  const [consolidated, setConsolidated] = useState<IConsolidatedReport>()
  const formRef = useRef<FormHandles>(null)

  const loadConsolidatedBalance = async (month: number): Promise<void> => {
    const token = sessionStorage.getItem(constants.sessionStorage.token)
    const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` }}
    const { data } = await api.get(`/balance/consolidated/${month}`, config)
    setConsolidated(data)
  }

  const handleSubmit = async ({ month: date }: IFormData) => {
    if (!date) return
    const month = Number(date.split('-')[1])
    await loadConsolidatedBalance(month)
  }

  return (
    <>
      <Header current="ConsolidatedBalance" />
      <Container>
        <CardContainer>
          {isDeskTopScreen && (
            <>
              <Card>
                <header>
                  <p>{consolidated?.requester?.name || 'Requester'}</p>
                  <img src={income} alt="Income" />
                </header>
                <h1>{formatAmount(consolidated?.requester.total || 0)}</h1>
              </Card>
              <Card>
                <header>
                  <p>{consolidated?.partner?.name || 'Partner'}</p>
                  <img src={outcome} alt="Outcome" />
                </header>
                <h1>{formatAmount(consolidated?.partner?.total || 0)}</h1>
              </Card>
            </>
          )}
          <Card total>
            <header>
              <p>Balance</p>
              <img src={total} alt="Balance" />
            </header>
            <h1>{formatAmount(consolidated?.balance || 0)}</h1>
          </Card>
        </CardContainer>
        <FormContainer>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Input icon={MdDateRange} name="month" type="month" />
            <Button type="submit">Search</Button>
          </Form>
        </FormContainer>
        {consolidated && (
          <TableContainer>
            {consolidated.requester.payments.length > 0 && (
              <Table>
                <table>
                  <thead>
                    <tr>
                      <th colSpan={2}>{consolidated.requester.name}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consolidated.requester.payments.map((payment) => (
                      <Fragment key={payment.id}>
                        <tr>
                          <td className="payment-type" colSpan={2}>{payment.description}</td>
                        </tr>
                        {payment.banks.map((bank) => (
                          <tr key={bank.id}>
                            <td className="bank-name">{bank.name}</td>
                            <td className="bank-total">{formatAmount(bank.total)}</td>
                          </tr>
                        ))}
                        <tr>
                          <td className="requester" colSpan={2}>
                            Total
                            {' - '}
                            {formatAmount(payment.total)}
                          </td>
                        </tr>
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </Table>
            )}
            {consolidated.partner && (
              <Table>
                <table className="table-partner">
                  <thead>
                    <tr>
                      <th colSpan={2}>{consolidated.partner.name}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consolidated.partner.payments.map((payment) => (
                      <Fragment key={payment.id}>
                        <tr>
                          <td className="payment-type" colSpan={2}>{payment.description}</td>
                        </tr>
                        {payment.banks.map((bank) => (
                          <tr key={bank.id}>
                            <td className="bank-name">{bank.name}</td>
                            <td className="bank-total">{formatAmount(bank.total)}</td>
                          </tr>
                        ))}
                        <tr>
                          <td className="partner" colSpan={2}>
                            Total
                            {' - '}
                            {formatAmount(payment.total)}
                          </td>
                        </tr>
                      </Fragment>
                    ))}
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

export default ConsolidatedBalance
