import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: 'e40d3b9b-6d1b-4304-87e0-a4a8b222f842',
};

export const sampleWithPartialData: IAuthority = {
  name: 'ac619b84-7725-47ad-a0ef-67c346f06915',
};

export const sampleWithFullData: IAuthority = {
  name: '33715710-88e9-459a-8fea-b3074a6b3848',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
