import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 13903,
  login: 'u@vefTq',
};

export const sampleWithPartialData: IUser = {
  id: 23602,
  login: 'S@pD\\EW\\vz',
};

export const sampleWithFullData: IUser = {
  id: 18366,
  login: 'vBP0Y=@m4p\\?eMQDro\\gjpOsji\\Gbb0\\K-SN',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
