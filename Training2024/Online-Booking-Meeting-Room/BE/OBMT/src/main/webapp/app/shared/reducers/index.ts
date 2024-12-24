import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import authentication from './authentication';
import applicationProfile from './application-profile';

import administration from 'app/modules/administration/administration.reducer';
import userManagement from 'app/modules/administration/user-management/user-management.reducer';
import register from 'app/modules/account/register/register.reducer';
import activate from 'app/modules/account/activate/activate.reducer';
import password from 'app/modules/account/password/password.reducer';
import settings from 'app/modules/account/settings/settings.reducer';
import passwordReset from 'app/modules/account/password-reset/password-reset.reducer';
// prettier-ignore
import appUsers from 'app/entities/app-users/app-users.reducer';
// prettier-ignore
import roles from 'app/entities/roles/roles.reducer';
// prettier-ignore
import permissions from 'app/entities/permissions/permissions.reducer';
// prettier-ignore
import meetingRooms from 'app/entities/meeting-rooms/meeting-rooms.reducer';
// prettier-ignore
import eventMeetings from 'app/entities/event-meetings/event-meetings.reducer';
// prettier-ignore
import eventUsers from 'app/entities/event-users/event-users.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const rootReducer = {
  authentication,
  applicationProfile,
  administration,
  userManagement,
  register,
  activate,
  passwordReset,
  password,
  settings,
  appUsers,
  roles,
  permissions,
  meetingRooms,
  eventMeetings,
  eventUsers,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  loadingBar,
};

export default rootReducer;
