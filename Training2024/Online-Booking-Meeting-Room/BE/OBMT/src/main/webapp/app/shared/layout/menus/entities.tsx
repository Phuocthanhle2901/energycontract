import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';

import { NavDropdown } from './menu-components';

export const EntitiesMenu = props => (
  <NavDropdown icon="th-list" name="Entities" id="entity-menu" data-cy="entity" style={{ maxHeight: '80vh', overflow: 'auto' }}>
    <>{/* to avoid warnings when empty */}</>
    <MenuItem icon="asterisk" to="/app-users">
      App Users
    </MenuItem>
    <MenuItem icon="asterisk" to="/roles">
      Roles
    </MenuItem>
    <MenuItem icon="asterisk" to="/permissions">
      Permissions
    </MenuItem>
    <MenuItem icon="asterisk" to="/meeting-rooms">
      Meeting Rooms
    </MenuItem>
    <MenuItem icon="asterisk" to="/event-meetings">
      Event Meetings
    </MenuItem>
    <MenuItem icon="asterisk" to="/event-users">
      Event Users
    </MenuItem>
    {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
  </NavDropdown>
);
