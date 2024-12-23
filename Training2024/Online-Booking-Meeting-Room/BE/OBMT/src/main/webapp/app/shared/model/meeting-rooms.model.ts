import dayjs from 'dayjs';

export interface IMeetingRooms {
  id?: number;
  name?: string;
  description?: string;
  capacity?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const defaultValue: Readonly<IMeetingRooms> = {};
