import dayjs from 'dayjs/esm';

import { ILesson, NewLesson } from './lesson.model';

export const sampleWithRequiredData: ILesson = {
  id: 172,
  title: 'furthermore',
};

export const sampleWithPartialData: ILesson = {
  id: 6134,
  title: 'too jaded',
  createdBy: 'broaden comprehension truly',
};

export const sampleWithFullData: ILesson = {
  id: 28328,
  title: 'overlie oh stinger',
  content: '../fake-data/blob/hipster.txt',
  videoUrl: 'condor shield',
  createdBy: 'anthropology indeed versus',
  createdDate: dayjs('2024-07-16T12:01'),
  lastModifiedBy: 'ouch',
  lastModifiedDate: dayjs('2024-07-16T09:15'),
};

export const sampleWithNewData: NewLesson = {
  title: 'upliftingly beyond daily',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
