import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Create from './Create'
import 'bootstrap/dist/css/bootstrap.min.css'
import {
  Router, browserHistory, hashHistory,
  Route,
  IndexRoute,
  BrowserRouter, Switch
} from 'react-router-dom'

ReactDOM.render(
  <BrowserRouter history={browserHistory}>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/create" component={Create} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);
