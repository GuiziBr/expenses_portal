import React from 'react'
import { Switch } from 'react-router-dom'
import SharedBalance from '../pages/ConsolidatedBalance'
import BankManagement from '../pages/Management/Bank'
import CategoryManagement from '../pages/Management/Category'
import PaymentTypeManagement from '../pages/Management/PaymentType'
import StoreManagement from '../pages/Management/Store'
import PersonalDashboard from '../pages/PersonalDashboard'
import SharedDashboard from '../pages/SharedDashboard'
import SignIn from '../pages/SignIn'
import Route from './Route'

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/sharedDashboard" component={SharedDashboard} isPrivate />
    <Route path="/personalDashboard" component={PersonalDashboard} isPrivate />
    <Route path="/sharedBalance" component={SharedBalance} isPrivate />
    <Route path="/paymentTypeManagement" component={PaymentTypeManagement} isPrivate />
    <Route path="/categoryManagement" component={CategoryManagement} isPrivate />
    <Route path="/bankManagement" component={BankManagement} isPrivate />
    <Route path="/storeManagement" component={StoreManagement} isPrivate />
  </Switch>
)

export default Routes
