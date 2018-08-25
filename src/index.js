import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Create from './Create'
import Browse from './Browse'
import Dashboard from './Dashboard'
import Admin from './Admin'
import 'bootstrap/dist/css/bootstrap.min.css'
import {
  hashHistory, Route,
  HashRouter, Switch
} from 'react-router-dom'

ReactDOM.render(
  <HashRouter history={hashHistory}>
    <Switch>
      <Route exact path="/ipns/QmXmyJdaBYfqeBrJRmKtkxPFiJ8xrUSLaxegvhCT1WqvW9" component={App} />
      <Route path="/create" component={Create} />
      <Route path="/browse" component={Browse} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin" component={Admin} />
    </Switch>
  </HashRouter>,
  document.getElementById('root')
);
