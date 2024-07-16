import dayjs from 'dayjs/esm';

import { IAssignment, NewAssignment } from './assignment.model';

export const sampleWithRequiredData: IAssignment = {
  id: 7326,
  name: 'foolishly',
};

export const sampleWithPartialData: IAssignment = {
  id: 25900,
  name: 'likewise rapidly inside',
  lastModifiedBy: 'aromatic',
};

export const sampleWithFullData: IAssignment = {
  id: 13555,
  name: 'vine automation',
  description: '../fake-data/blob/hipster.txt',
  dueDate: dayjs('2024-07-16'),
  createdBy: 'velvety',
  createdDate: dayjs('2024-07-16T09:12'),
  lastModifiedBy: 'indeed',
  lastModifiedDate: dayjs('2024-07-15T21:36'),
};

export const sampleWithNewData: NewAssignment = {
  name: 'whereas',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
