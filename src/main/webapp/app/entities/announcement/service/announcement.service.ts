import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAnnouncement, NewAnnouncement } from '../announcement.model';

export type PartialUpdateAnnouncement = Partial<IAnnouncement> & Pick<IAnnouncement, 'id'>;

type RestOf<T extends IAnnouncement | NewAnnouncement> = Omit<T, 'publishDate' | 'createdDate' | 'lastModifiedDate'> & {
  publishDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestAnnouncement = RestOf<IAnnouncement>;

export type NewRestAnnouncement = RestOf<NewAnnouncement>;

export type PartialUpdateRestAnnouncement = RestOf<PartialUpdateAnnouncement>;

export type EntityResponseType = HttpResponse<IAnnouncement>;
export type EntityArrayResponseType = HttpResponse<IAnnouncement[]>;

@Injectable({ providedIn: 'root' })
export class AnnouncementService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/announcements');

  create(announcement: NewAnnouncement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(announcement);
    return this.http
      .post<RestAnnouncement>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(announcement: IAnnouncement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(announcement);
    return this.http
      .put<RestAnnouncement>(`${this.resourceUrl}/${this.getAnnouncementIdentifier(announcement)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(announcement: PartialUpdateAnnouncement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(announcement);
    return this.http
      .patch<RestAnnouncement>(`${this.resourceUrl}/${this.getAnnouncementIdentifier(announcement)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAnnouncement>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAnnouncement[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAnnouncementIdentifier(announcement: Pick<IAnnouncement, 'id'>): number {
    return announcement.id;
  }

  compareAnnouncement(o1: Pick<IAnnouncement, 'id'> | null, o2: Pick<IAnnouncement, 'id'> | null): boolean {
    return o1 && o2 ? this.getAnnouncementIdentifier(o1) === this.getAnnouncementIdentifier(o2) : o1 === o2;
  }

  addAnnouncementToCollectionIfMissing<Type extends Pick<IAnnouncement, 'id'>>(
    announcementCollection: Type[],
    ...announcementsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const announcements: Type[] = announcementsToCheck.filter(isPresent);
    if (announcements.length > 0) {
      const announcementCollectionIdentifiers = announcementCollection.map(announcementItem =>
        this.getAnnouncementIdentifier(announcementItem),
      );
      const announcementsToAdd = announcements.filter(announcementItem => {
        const announcementIdentifier = this.getAnnouncementIdentifier(announcementItem);
        if (announcementCollectionIdentifiers.includes(announcementIdentifier)) {
          return false;
        }
        announcementCollectionIdentifiers.push(announcementIdentifier);
        return true;
      });
      return [...announcementsToAdd, ...announcementCollection];
    }
    return announcementCollection;
  }

  protected convertDateFromClient<T extends IAnnouncement | NewAnnouncement | PartialUpdateAnnouncement>(announcement: T): RestOf<T> {
    return {
      ...announcement,
      publishDate: announcement.publishDate?.format(DATE_FORMAT) ?? null,
      createdDate: announcement.createdDate?.toJSON() ?? null,
      lastModifiedDate: announcement.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAnnouncement: RestAnnouncement): IAnnouncement {
    return {
      ...restAnnouncement,
      publishDate: restAnnouncement.publishDate ? dayjs(restAnnouncement.publishDate) : undefined,
      createdDate: restAnnouncement.createdDate ? dayjs(restAnnouncement.createdDate) : undefined,
      lastModifiedDate: restAnnouncement.lastModifiedDate ? dayjs(restAnnouncement.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAnnouncement>): HttpResponse<IAnnouncement> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAnnouncement[]>): HttpResponse<IAnnouncement[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
