import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';
import SearchPoint from './pages/SearchPoint';

const Routes = () =>{
  return (
    <BrowserRouter>
      <Switch>
        <Route component={Home} path='/' exact />
        <Route component={CreatePoint} path='/create-point' />
        <Route component={SearchPoint} path='/search-point/:uf/:city' />
      </Switch>
    </BrowserRouter>
  )
}

export default Routes;