import dayjs from 'dayjs';
import { IMeetingRooms } from 'app/shared/model/meeting-rooms.model';
import { IAppUsers } from 'app/shared/model/app-users.model';

export interface IEventMeetings {
  id?: number;
  title?: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  meetingRoom?: IMeetingRooms | null;
  members?: IAppUsers[] | null;
}

export const defaultValue: Readonly<IEventMeetings> = {};
