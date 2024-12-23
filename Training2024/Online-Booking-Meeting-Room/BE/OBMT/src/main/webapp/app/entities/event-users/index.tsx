import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import EventUsers from './event-users';
import EventUsersDetail from './event-users-detail';
import EventUsersUpdate from './event-users-update';
import EventUsersDeleteDialog from './event-users-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={EventUsersUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={EventUsersUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={EventUsersDetail} />
      <ErrorBoundaryRoute path={match.url} component={EventUsers} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={EventUsersDeleteDialog} />
  </>
);

export default Routes;
