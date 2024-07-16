import dayjs from 'dayjs/esm';

import { IMessage, NewMessage } from './message.model';

export const sampleWithRequiredData: IMessage = {
  id: 20869,
  content: '../fake-data/blob/hipster.txt',
  timestamp: dayjs('2024-07-16T17:27'),
};

export const sampleWithPartialData: IMessage = {
  id: 326,
  content: '../fake-data/blob/hipster.txt',
  timestamp: dayjs('2024-07-16T04:51'),
  lastModifiedBy: 'unselfish wherever elaborate',
  lastModifiedDate: dayjs('2024-07-16T06:32'),
};

export const sampleWithFullData: IMessage = {
  id: 4808,
  content: '../fake-data/blob/hipster.txt',
  timestamp: dayjs('2024-07-16T18:43'),
  sender: 'during milepost obediently',
  createdBy: 'pasteurise behind walker',
  createdDate: dayjs('2024-07-16T08:56'),
  lastModifiedBy: 'as as after',
  lastModifiedDate: dayjs('2024-07-15T23:30'),
};

export const sampleWithNewData: NewMessage = {
  content: '../fake-data/blob/hipster.txt',
  timestamp: dayjs('2024-07-16T06:16'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
