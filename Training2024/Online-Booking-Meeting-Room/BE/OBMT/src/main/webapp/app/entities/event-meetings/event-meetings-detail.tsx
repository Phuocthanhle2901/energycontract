import React, { useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getEntity } from './event-meetings.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

export const EventMeetingsDetail = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getEntity(props.match.params.id));
  }, []);

  const eventMeetingsEntity = useAppSelector(state => state.eventMeetings.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="eventMeetingsDetailsHeading">EventMeetings</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{eventMeetingsEntity.id}</dd>
          <dt>
            <span id="title">Title</span>
          </dt>
          <dd>{eventMeetingsEntity.title}</dd>
          <dt>
            <span id="startTime">Start Time</span>
          </dt>
          <dd>
            {eventMeetingsEntity.startTime ? (
              <TextFormat value={eventMeetingsEntity.startTime} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="endTime">End Time</span>
          </dt>
          <dd>
            {eventMeetingsEntity.endTime ? <TextFormat value={eventMeetingsEntity.endTime} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="description">Description</span>
          </dt>
          <dd>{eventMeetingsEntity.description}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>
            {eventMeetingsEntity.createdAt ? (
              <TextFormat value={eventMeetingsEntity.createdAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>
            {eventMeetingsEntity.updatedAt ? (
              <TextFormat value={eventMeetingsEntity.updatedAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="status">Status</span>
          </dt>
          <dd>{eventMeetingsEntity.status}</dd>
          <dt>Meeting Room</dt>
          <dd>{eventMeetingsEntity.meetingRoom ? eventMeetingsEntity.meetingRoom.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/event-meetings" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/event-meetings/${eventMeetingsEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default EventMeetingsDetail;
