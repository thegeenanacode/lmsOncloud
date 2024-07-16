import dayjs from 'dayjs/esm';

export interface IProject {
  id: number;
  projectName?: string | null;
  projectDescription?: string | null;
  submissionDate?: dayjs.Dayjs | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
}

export type NewProject = Omit<IProject, 'id'> & { id: null };
