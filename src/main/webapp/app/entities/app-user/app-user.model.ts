import dayjs from 'dayjs/esm';
import { IEnrollment } from 'app/entities/enrollment/enrollment.model';
import { UserRole } from 'app/entities/enumerations/user-role.model';

export interface IAppUser {
  id: number;
  username?: string | null;
  password?: string | null;
  email?: string | null;
  role?: keyof typeof UserRole | null;
  firstName?: string | null;
  lastName?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  lastLoginDate?: dayjs.Dayjs | null;
  isActive?: boolean | null;
  enrollment?: IEnrollment | null;
}

export type NewAppUser = Omit<IAppUser, 'id'> & { id: null };
