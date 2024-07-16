import dayjs from 'dayjs/esm';

import { IQuiz, NewQuiz } from './quiz.model';

export const sampleWithRequiredData: IQuiz = {
  id: 4183,
  title: 'especially poorly furthermore',
};

export const sampleWithPartialData: IQuiz = {
  id: 187,
  title: 'mmm but eminent',
  description: '../fake-data/blob/hipster.txt',
  lastModifiedDate: dayjs('2024-07-16T07:17'),
};

export const sampleWithFullData: IQuiz = {
  id: 31489,
  title: 'qua storage',
  description: '../fake-data/blob/hipster.txt',
  createdBy: 'apud',
  createdDate: dayjs('2024-07-16T19:58'),
  lastModifiedBy: 'energetic usable',
  lastModifiedDate: dayjs('2024-07-16T00:51'),
};

export const sampleWithNewData: NewQuiz = {
  title: 'vengeful',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
