import React, { useState, useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IAppUsers } from 'app/shared/model/app-users.model';
import { getEntities as getAppUsers } from 'app/entities/app-users/app-users.reducer';
import { IEventMeetings } from 'app/shared/model/event-meetings.model';
import { getEntities as getEventMeetings } from 'app/entities/event-meetings/event-meetings.reducer';
import { getEntity, updateEntity, createEntity, reset } from './event-users.reducer';
import { IEventUsers } from 'app/shared/model/event-users.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

export const EventUsersUpdate = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const appUsers = useAppSelector(state => state.appUsers.entities);
  const eventMeetings = useAppSelector(state => state.eventMeetings.entities);
  const eventUsersEntity = useAppSelector(state => state.eventUsers.entity);
  const loading = useAppSelector(state => state.eventUsers.loading);
  const updating = useAppSelector(state => state.eventUsers.updating);
  const updateSuccess = useAppSelector(state => state.eventUsers.updateSuccess);
  const handleClose = () => {
    props.history.push('/event-users' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(props.match.params.id));
    }

    dispatch(getAppUsers({}));
    dispatch(getEventMeetings({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...eventUsersEntity,
      ...values,
      appusers: appUsers.find(it => it.id.toString() === values.appusers.toString()),
      eventMeeting: eventMeetings.find(it => it.id.toString() === values.eventMeeting.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...eventUsersEntity,
          appusers: eventUsersEntity?.appusers?.id,
          eventMeeting: eventUsersEntity?.eventMeeting?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="obmrApp.eventUsers.home.createOrEditLabel" data-cy="EventUsersCreateUpdateHeading">
            Create or edit a EventUsers
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="event-users-id" label="ID" validate={{ required: true }} /> : null}
              <ValidatedField
                label="Is Organizer"
                id="event-users-isOrganizer"
                name="isOrganizer"
                data-cy="isOrganizer"
                check
                type="checkbox"
              />
              <ValidatedField id="event-users-appusers" name="appusers" data-cy="appusers" label="Appusers" type="select">
                <option value="" key="0" />
                {appUsers
                  ? appUsers.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.username}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField id="event-users-eventMeeting" name="eventMeeting" data-cy="eventMeeting" label="Event Meeting" type="select">
                <option value="" key="0" />
                {eventMeetings
                  ? eventMeetings.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.title}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/event-users" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Save
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default EventUsersUpdate;
