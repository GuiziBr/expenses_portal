import React from 'react'
import ManagementPage from '../../components/ManagementPage'

const PaymentTypeManagement: React.FC = () => (
  <ManagementPage pageLabel="Payment Type" inputName="description" entityPath="paymentType" hasStatement />
)

export default PaymentTypeManagement
