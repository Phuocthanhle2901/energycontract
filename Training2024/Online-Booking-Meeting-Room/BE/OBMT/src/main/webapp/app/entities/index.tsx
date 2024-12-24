import React from 'react';
import { Switch } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import AppUsers from './app-users';
import Roles from './roles';
import Permissions from './permissions';
import MeetingRooms from './meeting-rooms';
import EventMeetings from './event-meetings';
import EventUsers from './event-users';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}app-users`} component={AppUsers} />
      <ErrorBoundaryRoute path={`${match.url}roles`} component={Roles} />
      <ErrorBoundaryRoute path={`${match.url}permissions`} component={Permissions} />
      <ErrorBoundaryRoute path={`${match.url}meeting-rooms`} component={MeetingRooms} />
      <ErrorBoundaryRoute path={`${match.url}event-meetings`} component={EventMeetings} />
      <ErrorBoundaryRoute path={`${match.url}event-users`} component={EventUsers} />
      {/* jhipster-needle-add-route-path - JHipster will add routes here */}
    </Switch>
  </div>
);

export default Routes;
