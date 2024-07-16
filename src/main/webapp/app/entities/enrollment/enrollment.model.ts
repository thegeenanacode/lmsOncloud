import dayjs from 'dayjs/esm';
import { IAppUser } from 'app/entities/app-user/app-user.model';
import { ICourse } from 'app/entities/course/course.model';
import { EnrollmentStatus } from 'app/entities/enumerations/enrollment-status.model';

export interface IEnrollment {
  id: number;
  enrollmentDate?: dayjs.Dayjs | null;
  status?: keyof typeof EnrollmentStatus | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  user?: IAppUser | null;
  course?: ICourse | null;
}

export type NewEnrollment = Omit<IEnrollment, 'id'> & { id: null };
