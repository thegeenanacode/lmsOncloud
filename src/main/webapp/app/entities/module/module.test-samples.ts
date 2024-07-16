import dayjs from 'dayjs/esm';

import { IModule, NewModule } from './module.model';

export const sampleWithRequiredData: IModule = {
  id: 16756,
  title: 'per intellect',
};

export const sampleWithPartialData: IModule = {
  id: 7996,
  title: 'gosh lest dollarize',
  description: '../fake-data/blob/hipster.txt',
  createdBy: 'incidentally message',
  createdDate: dayjs('2024-07-16T19:05'),
  lastModifiedBy: 'favorable sitar',
  lastModifiedDate: dayjs('2024-07-16T10:40'),
};

export const sampleWithFullData: IModule = {
  id: 19725,
  title: 'round',
  description: '../fake-data/blob/hipster.txt',
  createdBy: 'uncover',
  createdDate: dayjs('2024-07-16T07:13'),
  lastModifiedBy: 'terrific ick',
  lastModifiedDate: dayjs('2024-07-16T02:51'),
};

export const sampleWithNewData: NewModule = {
  title: 'volunteering',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
