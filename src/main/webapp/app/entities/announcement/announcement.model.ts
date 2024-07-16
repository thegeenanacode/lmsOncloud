import dayjs from 'dayjs/esm';

export interface IAnnouncement {
  id: number;
  title?: string | null;
  content?: string | null;
  publishDate?: dayjs.Dayjs | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
}

export type NewAnnouncement = Omit<IAnnouncement, 'id'> & { id: null };
