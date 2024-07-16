import dayjs from 'dayjs/esm';
import { ICourse } from 'app/entities/course/course.model';

export interface IDiscussion {
  id: number;
  topic?: string | null;
  details?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  course?: ICourse | null;
}

export type NewDiscussion = Omit<IDiscussion, 'id'> & { id: null };
