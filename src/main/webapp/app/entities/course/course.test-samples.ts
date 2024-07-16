import dayjs from 'dayjs/esm';

import { ICourse, NewCourse } from './course.model';

export const sampleWithRequiredData: ICourse = {
  id: 6659,
  name: 'physical whoever',
};

export const sampleWithPartialData: ICourse = {
  id: 19545,
  name: 'cope after',
  startDate: dayjs('2024-07-16'),
};

export const sampleWithFullData: ICourse = {
  id: 5319,
  name: 'entrench per neatly',
  description: '../fake-data/blob/hipster.txt',
  startDate: dayjs('2024-07-16'),
  endDate: dayjs('2024-07-15'),
  createdBy: 'pea qua',
  createdDate: dayjs('2024-07-16T15:41'),
  lastModifiedBy: 'phooey',
  lastModifiedDate: dayjs('2024-07-16T02:14'),
};

export const sampleWithNewData: NewCourse = {
  name: 'electric',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
