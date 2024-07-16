import dayjs from 'dayjs/esm';

import { IAppUser, NewAppUser } from './app-user.model';

export const sampleWithRequiredData: IAppUser = {
  id: 16486,
  username: 'swell why oval',
  password: 'whether oak anenst',
  email: 'uEuG@=CQ\\KKXN',
};

export const sampleWithPartialData: IAppUser = {
  id: 18697,
  username: 'incidentally service',
  password: 'upon cautiously',
  email: 'e/EP3@oOo|h[\\g%>t*pQ',
  role: 'ADMIN',
  lastName: 'Hudson',
  createdDate: dayjs('2024-07-16T04:39'),
  lastLoginDate: dayjs('2024-07-16T18:14'),
  isActive: true,
};

export const sampleWithFullData: IAppUser = {
  id: 26027,
  username: 'rudely fooey doubtfully',
  password: 'woot meanwhile deliberately',
  email: 'K&`,na@hF\\BG-f',
  role: 'INSTRUCTOR',
  firstName: 'Ezekiel',
  lastName: 'Thompson',
  createdDate: dayjs('2024-07-16T16:31'),
  lastModifiedDate: dayjs('2024-07-16T06:33'),
  lastLoginDate: dayjs('2024-07-16T03:30'),
  isActive: true,
};

export const sampleWithNewData: NewAppUser = {
  username: 'anger',
  password: 'freely abaft',
  email: ',O@(?3*\\]X',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
