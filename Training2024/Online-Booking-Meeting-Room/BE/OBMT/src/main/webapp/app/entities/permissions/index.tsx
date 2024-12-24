import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Permissions from './permissions';
import PermissionsDetail from './permissions-detail';
import PermissionsUpdate from './permissions-update';
import PermissionsDeleteDialog from './permissions-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={PermissionsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={PermissionsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={PermissionsDetail} />
      <ErrorBoundaryRoute path={match.url} component={Permissions} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={PermissionsDeleteDialog} />
  </>
);

export default Routes;
