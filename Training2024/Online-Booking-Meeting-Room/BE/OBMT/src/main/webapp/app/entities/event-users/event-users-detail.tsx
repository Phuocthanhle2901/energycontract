import React, { useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getEntity } from './event-users.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

export const EventUsersDetail = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getEntity(props.match.params.id));
  }, []);

  const eventUsersEntity = useAppSelector(state => state.eventUsers.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="eventUsersDetailsHeading">EventUsers</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{eventUsersEntity.id}</dd>
          <dt>
            <span id="isOrganizer">Is Organizer</span>
          </dt>
          <dd>{eventUsersEntity.isOrganizer ? 'true' : 'false'}</dd>
          <dt>Appusers</dt>
          <dd>{eventUsersEntity.appusers ? eventUsersEntity.appusers.id : ''}</dd>
          <dt>Event Meeting</dt>
          <dd>{eventUsersEntity.eventMeeting ? eventUsersEntity.eventMeeting.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/event-users" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/event-users/${eventUsersEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default EventUsersDetail;
