import React, { useState, useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IPermissions } from 'app/shared/model/permissions.model';
import { getEntities as getPermissions } from 'app/entities/permissions/permissions.reducer';
import { IAppUsers } from 'app/shared/model/app-users.model';
import { getEntities as getAppUsers } from 'app/entities/app-users/app-users.reducer';
import { getEntity, updateEntity, createEntity, reset } from './roles.reducer';
import { IRoles } from 'app/shared/model/roles.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

export const RolesUpdate = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const permissions = useAppSelector(state => state.permissions.entities);
  const appUsers = useAppSelector(state => state.appUsers.entities);
  const rolesEntity = useAppSelector(state => state.roles.entity);
  const loading = useAppSelector(state => state.roles.loading);
  const updating = useAppSelector(state => state.roles.updating);
  const updateSuccess = useAppSelector(state => state.roles.updateSuccess);
  const handleClose = () => {
    props.history.push('/roles' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(props.match.params.id));
    }

    dispatch(getPermissions({}));
    dispatch(getAppUsers({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...rolesEntity,
      ...values,
      permissions: mapIdList(values.permissions),
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
          ...rolesEntity,
          permissions: rolesEntity?.permissions?.map(e => e.id.toString()),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="obmrApp.roles.home.createOrEditLabel" data-cy="RolesCreateUpdateHeading">
            Create or edit a Roles
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="roles-id" label="ID" validate={{ required: true }} /> : null}
              <ValidatedField
                label="Role Name"
                id="roles-roleName"
                name="roleName"
                data-cy="roleName"
                type="text"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              <ValidatedField label="Permissions" id="roles-permissions" data-cy="permissions" type="select" multiple name="permissions">
                <option value="" key="0" />
                {permissions
                  ? permissions.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.permissionName}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/roles" replace color="info">
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

export default RolesUpdate;
