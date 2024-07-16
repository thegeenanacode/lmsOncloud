import dayjs from 'dayjs/esm';

import { IEnrollment, NewEnrollment } from './enrollment.model';

export const sampleWithRequiredData: IEnrollment = {
  id: 19648,
};

export const sampleWithPartialData: IEnrollment = {
  id: 13325,
  status: 'ACTIVE',
  createdBy: 'aw',
  createdDate: dayjs('2024-07-16T09:02'),
  lastModifiedBy: 'yearningly',
};

export const sampleWithFullData: IEnrollment = {
  id: 9261,
  enrollmentDate: dayjs('2024-07-16'),
  status: 'ACTIVE',
  createdBy: 'insistent untimely',
  createdDate: dayjs('2024-07-15T20:48'),
  lastModifiedBy: 'drat memorable at',
  lastModifiedDate: dayjs('2024-07-16T10:19'),
};

export const sampleWithNewData: NewEnrollment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
