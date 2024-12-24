import React, { useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getEntity } from './meeting-rooms.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

export const MeetingRoomsDetail = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getEntity(props.match.params.id));
  }, []);

  const meetingRoomsEntity = useAppSelector(state => state.meetingRooms.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="meetingRoomsDetailsHeading">MeetingRooms</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{meetingRoomsEntity.id}</dd>
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{meetingRoomsEntity.name}</dd>
          <dt>
            <span id="description">Description</span>
          </dt>
          <dd>{meetingRoomsEntity.description}</dd>
          <dt>
            <span id="capacity">Capacity</span>
          </dt>
          <dd>{meetingRoomsEntity.capacity}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>
            {meetingRoomsEntity.createdAt ? <TextFormat value={meetingRoomsEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>
            {meetingRoomsEntity.updatedAt ? <TextFormat value={meetingRoomsEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
        </dl>
        <Button tag={Link} to="/meeting-rooms" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/meeting-rooms/${meetingRoomsEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default MeetingRoomsDetail;
