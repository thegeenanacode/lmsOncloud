import dayjs from 'dayjs/esm';

import { IContentLibrary, NewContentLibrary } from './content-library.model';

export const sampleWithRequiredData: IContentLibrary = {
  id: 26565,
  name: 'slither',
};

export const sampleWithPartialData: IContentLibrary = {
  id: 3594,
  name: 'yowza',
  description: '../fake-data/blob/hipster.txt',
  createdBy: 'leap amid geez',
  createdDate: dayjs('2024-07-16T07:15'),
  lastModifiedDate: dayjs('2024-07-16T02:19'),
};

export const sampleWithFullData: IContentLibrary = {
  id: 26448,
  name: 'until',
  description: '../fake-data/blob/hipster.txt',
  resourceType: 'VIDEO',
  createdBy: 'unkempt verifiable arm',
  createdDate: dayjs('2024-07-16T10:20'),
  lastModifiedBy: 'collision',
  lastModifiedDate: dayjs('2024-07-16T04:21'),
};

export const sampleWithNewData: NewContentLibrary = {
  name: 'pish',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
