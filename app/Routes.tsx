import React from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from './constants/routes.json';
import HomePage from './containers/HomePage';

export default function Routes() {
  return (
    <Switch>
      <Route exact path={routes.HOME} component={HomePage} />
    </Switch>
  );
}
