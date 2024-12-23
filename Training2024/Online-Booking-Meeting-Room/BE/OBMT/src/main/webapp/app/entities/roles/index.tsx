import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Roles from './roles';
import RolesDetail from './roles-detail';
import RolesUpdate from './roles-update';
import RolesDeleteDialog from './roles-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={RolesUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={RolesUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={RolesDetail} />
      <ErrorBoundaryRoute path={match.url} component={Roles} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={RolesDeleteDialog} />
  </>
);

export default Routes;
