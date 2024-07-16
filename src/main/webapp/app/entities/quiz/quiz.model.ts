import dayjs from 'dayjs/esm';

export interface IQuiz {
  id: number;
  title?: string | null;
  description?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
}

export type NewQuiz = Omit<IQuiz, 'id'> & { id: null };
