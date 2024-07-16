import dayjs from 'dayjs/esm';

import { IDiscussion, NewDiscussion } from './discussion.model';

export const sampleWithRequiredData: IDiscussion = {
  id: 25418,
  topic: 'between beneficial stagnate',
  details: '../fake-data/blob/hipster.txt',
};

export const sampleWithPartialData: IDiscussion = {
  id: 10983,
  topic: 'but that simulate',
  details: '../fake-data/blob/hipster.txt',
  createdBy: 'anti trip truly',
};

export const sampleWithFullData: IDiscussion = {
  id: 28511,
  topic: 'busily geez',
  details: '../fake-data/blob/hipster.txt',
  createdBy: 'antagonize perk',
  createdDate: dayjs('2024-07-16T17:39'),
  lastModifiedBy: 'absentmindedly absent panhandle',
  lastModifiedDate: dayjs('2024-07-16T19:44'),
};

export const sampleWithNewData: NewDiscussion = {
  topic: 'small um daintily',
  details: '../fake-data/blob/hipster.txt',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
