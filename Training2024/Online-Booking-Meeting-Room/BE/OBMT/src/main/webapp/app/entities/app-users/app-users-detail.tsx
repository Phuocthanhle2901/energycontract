import React, { useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getEntity } from './app-users.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

export const AppUsersDetail = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getEntity(props.match.params.id));
  }, []);

  const appUsersEntity = useAppSelector(state => state.appUsers.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="appUsersDetailsHeading">AppUsers</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{appUsersEntity.id}</dd>
          <dt>
            <span id="username">Username</span>
          </dt>
          <dd>{appUsersEntity.username}</dd>
          <dt>
            <span id="password">Password</span>
          </dt>
          <dd>{appUsersEntity.password}</dd>
          <dt>
            <span id="email">Email</span>
          </dt>
          <dd>{appUsersEntity.email}</dd>
          <dt>
            <span id="phoneNumber">Phone Number</span>
          </dt>
          <dd>{appUsersEntity.phoneNumber}</dd>
          <dt>
            <span id="resetToken">Reset Token</span>
          </dt>
          <dd>{appUsersEntity.resetToken}</dd>
          <dt>
            <span id="resetTokenCreatedAt">Reset Token Created At</span>
          </dt>
          <dd>
            {appUsersEntity.resetTokenCreatedAt ? (
              <TextFormat value={appUsersEntity.resetTokenCreatedAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="otpCode">Otp Code</span>
          </dt>
          <dd>{appUsersEntity.otpCode}</dd>
          <dt>
            <span id="otpCodeCreatedAt">Otp Code Created At</span>
          </dt>
          <dd>
            {appUsersEntity.otpCodeCreatedAt ? (
              <TextFormat value={appUsersEntity.otpCodeCreatedAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="otpCodeExpiredAt">Otp Code Expired At</span>
          </dt>
          <dd>
            {appUsersEntity.otpCodeExpiredAt ? (
              <TextFormat value={appUsersEntity.otpCodeExpiredAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="otpIsVerified">Otp Is Verified</span>
          </dt>
          <dd>{appUsersEntity.otpIsVerified ? 'true' : 'false'}</dd>
          <dt>
            <span id="rememberToken">Remember Token</span>
          </dt>
          <dd>{appUsersEntity.rememberToken}</dd>
          <dt>
            <span id="isRemembered">Is Remembered</span>
          </dt>
          <dd>{appUsersEntity.isRemembered ? 'true' : 'false'}</dd>
          <dt>
            <span id="deviceInfo">Device Info</span>
          </dt>
          <dd>{appUsersEntity.deviceInfo}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{appUsersEntity.createdAt ? <TextFormat value={appUsersEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{appUsersEntity.updatedAt ? <TextFormat value={appUsersEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="status">Status</span>
          </dt>
          <dd>{appUsersEntity.status}</dd>
          <dt>Roles</dt>
          <dd>
            {appUsersEntity.roles
              ? appUsersEntity.roles.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.id}</a>
                    {appUsersEntity.roles && i === appUsersEntity.roles.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
          <dt>Events</dt>
          <dd>
            {appUsersEntity.events
              ? appUsersEntity.events.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.id}</a>
                    {appUsersEntity.events && i === appUsersEntity.events.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/app-users" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/app-users/${appUsersEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default AppUsersDetail;
