import dayjs from 'dayjs/esm';

export interface IAssignment {
  id: number;
  name?: string | null;
  description?: string | null;
  dueDate?: dayjs.Dayjs | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
}

export type NewAssignment = Omit<IAssignment, 'id'> & { id: null };
