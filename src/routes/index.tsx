import React from 'react'
import { Switch } from 'react-router-dom'

import Route from './Route'
import SignIn from '../pages/SignIn'
import Dashboard from '../pages/Dashboard'
import Expenses from '../pages/Expenses'

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/dashboard" component={Dashboard} isPrivate />
    <Route path="/expenses" component={Expenses} isPrivate />
  </Switch>
)

export default Routes
