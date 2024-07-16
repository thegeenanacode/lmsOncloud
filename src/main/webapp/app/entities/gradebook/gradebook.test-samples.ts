import dayjs from 'dayjs/esm';

import { IGradebook, NewGradebook } from './gradebook.model';

export const sampleWithRequiredData: IGradebook = {
  id: 23452,
};

export const sampleWithPartialData: IGradebook = {
  id: 11814,
  createdDate: dayjs('2024-07-16T10:27'),
  lastModifiedBy: 'once livid',
};

export const sampleWithFullData: IGradebook = {
  id: 10543,
  gradeType: 'LETTER',
  gradeValue: 'tool howev',
  comments: '../fake-data/blob/hipster.txt',
  createdBy: 'spread scope',
  createdDate: dayjs('2024-07-16T12:00'),
  lastModifiedBy: 'knuckle mourn',
  lastModifiedDate: dayjs('2024-07-16T15:09'),
};

export const sampleWithNewData: NewGradebook = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
