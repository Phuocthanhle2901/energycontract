import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import EventMeetings from './event-meetings';
import EventMeetingsDetail from './event-meetings-detail';
import EventMeetingsUpdate from './event-meetings-update';
import EventMeetingsDeleteDialog from './event-meetings-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={EventMeetingsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={EventMeetingsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={EventMeetingsDetail} />
      <ErrorBoundaryRoute path={match.url} component={EventMeetings} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={EventMeetingsDeleteDialog} />
  </>
);

export default Routes;
