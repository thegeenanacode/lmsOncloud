import dayjs from 'dayjs/esm';

import { IProject, NewProject } from './project.model';

export const sampleWithRequiredData: IProject = {
  id: 9334,
  projectName: 'beneath',
};

export const sampleWithPartialData: IProject = {
  id: 6092,
  projectName: 'deposition continually',
  projectDescription: '../fake-data/blob/hipster.txt',
  createdDate: dayjs('2024-07-16T08:28'),
};

export const sampleWithFullData: IProject = {
  id: 16895,
  projectName: 'whose',
  projectDescription: '../fake-data/blob/hipster.txt',
  submissionDate: dayjs('2024-07-15'),
  createdBy: 'confront till',
  createdDate: dayjs('2024-07-16T11:52'),
  lastModifiedBy: 'google or oh',
  lastModifiedDate: dayjs('2024-07-16T13:01'),
};

export const sampleWithNewData: NewProject = {
  projectName: 'county',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
