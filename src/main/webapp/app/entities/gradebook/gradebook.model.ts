import dayjs from 'dayjs/esm';
import { IAppUser } from 'app/entities/app-user/app-user.model';
import { GradeType } from 'app/entities/enumerations/grade-type.model';

export interface IGradebook {
  id: number;
  gradeType?: keyof typeof GradeType | null;
  gradeValue?: string | null;
  comments?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  student?: IAppUser | null;
}

export type NewGradebook = Omit<IGradebook, 'id'> & { id: null };
