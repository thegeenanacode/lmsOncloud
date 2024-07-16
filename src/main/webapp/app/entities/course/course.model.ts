import dayjs from 'dayjs/esm';
import { IModule } from 'app/entities/module/module.model';

export interface ICourse {
  id: number;
  name?: string | null;
  description?: string | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  modules?: IModule[] | null;
}

export type NewCourse = Omit<ICourse, 'id'> & { id: null };
