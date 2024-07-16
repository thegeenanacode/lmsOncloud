import dayjs from 'dayjs/esm';
import { IModule } from 'app/entities/module/module.model';

export interface ILesson {
  id: number;
  title?: string | null;
  content?: string | null;
  videoUrl?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  module?: IModule | null;
}

export type NewLesson = Omit<ILesson, 'id'> & { id: null };
