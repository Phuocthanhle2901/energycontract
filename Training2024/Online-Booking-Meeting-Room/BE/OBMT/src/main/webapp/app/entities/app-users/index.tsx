import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import AppUsers from './app-users';
import AppUsersDetail from './app-users-detail';
import AppUsersUpdate from './app-users-update';
import AppUsersDeleteDialog from './app-users-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={AppUsersUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={AppUsersUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={AppUsersDetail} />
      <ErrorBoundaryRoute path={match.url} component={AppUsers} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={AppUsersDeleteDialog} />
  </>
);

export default Routes;
