import React from 'react'
import { Switch } from 'react-router-dom'
import PersonalDashboard from '../pages/PersonalDashboard'
import SharedDashboard from '../pages/SharedDashboard'
import SignIn from '../pages/SignIn'
import Route from './Route'

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/sharedDashboard" component={SharedDashboard} isPrivate />
    <Route path="/personalDashboard" component={PersonalDashboard} isPrivate />
  </Switch>
)

export default Routes
