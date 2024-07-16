import dayjs from 'dayjs/esm';
import { ICourse } from 'app/entities/course/course.model';

export interface IModule {
  id: number;
  title?: string | null;
  description?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  courses?: ICourse[] | null;
}

export type NewModule = Omit<IModule, 'id'> & { id: null };
