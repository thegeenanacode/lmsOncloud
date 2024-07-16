import dayjs from 'dayjs/esm';

import { IAnnouncement, NewAnnouncement } from './announcement.model';

export const sampleWithRequiredData: IAnnouncement = {
  id: 30034,
  title: 'aha',
  content: '../fake-data/blob/hipster.txt',
  publishDate: dayjs('2024-07-16'),
};

export const sampleWithPartialData: IAnnouncement = {
  id: 25262,
  title: 'thoughtful',
  content: '../fake-data/blob/hipster.txt',
  publishDate: dayjs('2024-07-16'),
  createdBy: 'loyally damp finally',
  createdDate: dayjs('2024-07-16T19:30'),
  lastModifiedDate: dayjs('2024-07-16T04:10'),
};

export const sampleWithFullData: IAnnouncement = {
  id: 23213,
  title: 'flawless',
  content: '../fake-data/blob/hipster.txt',
  publishDate: dayjs('2024-07-16'),
  createdBy: 'out speedily below',
  createdDate: dayjs('2024-07-15T22:12'),
  lastModifiedBy: 'whose index',
  lastModifiedDate: dayjs('2024-07-15T23:36'),
};

export const sampleWithNewData: NewAnnouncement = {
  title: 'same whose',
  content: '../fake-data/blob/hipster.txt',
  publishDate: dayjs('2024-07-16'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
