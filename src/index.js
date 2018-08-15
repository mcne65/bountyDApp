import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Create from './Create'
import Browse from './Browse'
import Dashboard from './Dashboard'
import 'bootstrap/dist/css/bootstrap.min.css'
import {
  browserHistory, Route,
  BrowserRouter, Switch
} from 'react-router-dom'

ReactDOM.render(
  <BrowserRouter history={browserHistory}>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/create" component={Create} />
      <Route path="/browse" component={Browse} />
      <Route path="/dashboard" component={Dashboard} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);
