import { IAppUsers } from 'app/shared/model/app-users.model';
import { IEventMeetings } from 'app/shared/model/event-meetings.model';

export interface IEventUsers {
  id?: number;
  isOrganizer?: boolean;
  appusers?: IAppUsers | null;
  eventMeeting?: IEventMeetings | null;
}

export const defaultValue: Readonly<IEventUsers> = {
  isOrganizer: false,
};
