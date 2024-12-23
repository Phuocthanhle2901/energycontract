import React, { useState, useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRoles } from 'app/shared/model/roles.model';
import { getEntities as getRoles } from 'app/entities/roles/roles.reducer';
import { IEventMeetings } from 'app/shared/model/event-meetings.model';
import { getEntities as getEventMeetings } from 'app/entities/event-meetings/event-meetings.reducer';
import { getEntity, updateEntity, createEntity, reset } from './app-users.reducer';
import { IAppUsers } from 'app/shared/model/app-users.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

export const AppUsersUpdate = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const roles = useAppSelector(state => state.roles.entities);
  const eventMeetings = useAppSelector(state => state.eventMeetings.entities);
  const appUsersEntity = useAppSelector(state => state.appUsers.entity);
  const loading = useAppSelector(state => state.appUsers.loading);
  const updating = useAppSelector(state => state.appUsers.updating);
  const updateSuccess = useAppSelector(state => state.appUsers.updateSuccess);
  const handleClose = () => {
    props.history.push('/app-users' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(props.match.params.id));
    }

    dispatch(getRoles({}));
    dispatch(getEventMeetings({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    values.resetTokenCreatedAt = convertDateTimeToServer(values.resetTokenCreatedAt);
    values.otpCodeCreatedAt = convertDateTimeToServer(values.otpCodeCreatedAt);
    values.otpCodeExpiredAt = convertDateTimeToServer(values.otpCodeExpiredAt);
    values.createdAt = convertDateTimeToServer(values.createdAt);
    values.updatedAt = convertDateTimeToServer(values.updatedAt);

    const entity = {
      ...appUsersEntity,
      ...values,
      roles: mapIdList(values.roles),
      events: mapIdList(values.events),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          resetTokenCreatedAt: displayDefaultDateTime(),
          otpCodeCreatedAt: displayDefaultDateTime(),
          otpCodeExpiredAt: displayDefaultDateTime(),
          createdAt: displayDefaultDateTime(),
          updatedAt: displayDefaultDateTime(),
        }
      : {
          ...appUsersEntity,
          resetTokenCreatedAt: convertDateTimeFromServer(appUsersEntity.resetTokenCreatedAt),
          otpCodeCreatedAt: convertDateTimeFromServer(appUsersEntity.otpCodeCreatedAt),
          otpCodeExpiredAt: convertDateTimeFromServer(appUsersEntity.otpCodeExpiredAt),
          createdAt: convertDateTimeFromServer(appUsersEntity.createdAt),
          updatedAt: convertDateTimeFromServer(appUsersEntity.updatedAt),
          roles: appUsersEntity?.roles?.map(e => e.id.toString()),
          events: appUsersEntity?.events?.map(e => e.id.toString()),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="obmrApp.appUsers.home.createOrEditLabel" data-cy="AppUsersCreateUpdateHeading">
            Create or edit a AppUsers
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="app-users-id" label="ID" validate={{ required: true }} /> : null}
              <ValidatedField
                label="Username"
                id="app-users-username"
                name="username"
                data-cy="username"
                type="text"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              <ValidatedField
                label="Password"
                id="app-users-password"
                name="password"
                data-cy="password"
                type="text"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              <ValidatedField
                label="Email"
                id="app-users-email"
                name="email"
                data-cy="email"
                type="text"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              <ValidatedField
                label="Phone Number"
                id="app-users-phoneNumber"
                name="phoneNumber"
                data-cy="phoneNumber"
                type="text"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              <ValidatedField label="Reset Token" id="app-users-resetToken" name="resetToken" data-cy="resetToken" type="text" />
              <ValidatedField
                label="Reset Token Created At"
                id="app-users-resetTokenCreatedAt"
                name="resetTokenCreatedAt"
                data-cy="resetTokenCreatedAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField label="Otp Code" id="app-users-otpCode" name="otpCode" data-cy="otpCode" type="text" />
              <ValidatedField
                label="Otp Code Created At"
                id="app-users-otpCodeCreatedAt"
                name="otpCodeCreatedAt"
                data-cy="otpCodeCreatedAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label="Otp Code Expired At"
                id="app-users-otpCodeExpiredAt"
                name="otpCodeExpiredAt"
                data-cy="otpCodeExpiredAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label="Otp Is Verified"
                id="app-users-otpIsVerified"
                name="otpIsVerified"
                data-cy="otpIsVerified"
                check
                type="checkbox"
              />
              <ValidatedField
                label="Remember Token"
                id="app-users-rememberToken"
                name="rememberToken"
                data-cy="rememberToken"
                type="text"
              />
              <ValidatedField
                label="Is Remembered"
                id="app-users-isRemembered"
                name="isRemembered"
                data-cy="isRemembered"
                check
                type="checkbox"
              />
              <ValidatedField label="Device Info" id="app-users-deviceInfo" name="deviceInfo" data-cy="deviceInfo" type="text" />
              <ValidatedField
                label="Created At"
                id="app-users-createdAt"
                name="createdAt"
                data-cy="createdAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              <ValidatedField
                label="Updated At"
                id="app-users-updatedAt"
                name="updatedAt"
                data-cy="updatedAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              <ValidatedField
                label="Status"
                id="app-users-status"
                name="status"
                data-cy="status"
                type="text"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              <ValidatedField label="Roles" id="app-users-roles" data-cy="roles" type="select" multiple name="roles">
                <option value="" key="0" />
                {roles
                  ? roles.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField label="Events" id="app-users-events" data-cy="events" type="select" multiple name="events">
                <option value="" key="0" />
                {eventMeetings
                  ? eventMeetings.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/app-users" replace color="info">
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

export default AppUsersUpdate;
