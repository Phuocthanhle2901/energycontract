import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import MeetingRooms from './meeting-rooms';
import MeetingRoomsDetail from './meeting-rooms-detail';
import MeetingRoomsUpdate from './meeting-rooms-update';
import MeetingRoomsDeleteDialog from './meeting-rooms-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={MeetingRoomsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={MeetingRoomsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={MeetingRoomsDetail} />
      <ErrorBoundaryRoute path={match.url} component={MeetingRooms} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={MeetingRoomsDeleteDialog} />
  </>
);

export default Routes;
