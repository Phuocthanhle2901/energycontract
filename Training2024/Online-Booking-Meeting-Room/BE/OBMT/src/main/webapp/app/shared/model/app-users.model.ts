import dayjs from 'dayjs';
import { IRoles } from 'app/shared/model/roles.model';
import { IEventMeetings } from 'app/shared/model/event-meetings.model';

export interface IAppUsers {
  id?: number;
  username?: string;
  password?: string;
  email?: string;
  phoneNumber?: string;
  resetToken?: string | null;
  resetTokenCreatedAt?: string | null;
  otpCode?: string | null;
  otpCodeCreatedAt?: string | null;
  otpCodeExpiredAt?: string | null;
  otpIsVerified?: boolean;
  rememberToken?: string | null;
  isRemembered?: boolean;
  deviceInfo?: string | null;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  roles?: IRoles[] | null;
  events?: IEventMeetings[] | null;
}

export const defaultValue: Readonly<IAppUsers> = {
  otpIsVerified: false,
  isRemembered: false,
};
