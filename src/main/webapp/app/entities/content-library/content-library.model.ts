import dayjs from 'dayjs/esm';
import { ResourceType } from 'app/entities/enumerations/resource-type.model';

export interface IContentLibrary {
  id: number;
  name?: string | null;
  description?: string | null;
  resourceType?: keyof typeof ResourceType | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
}

export type NewContentLibrary = Omit<IContentLibrary, 'id'> & { id: null };
