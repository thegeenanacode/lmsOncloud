import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEnrollment, NewEnrollment } from '../enrollment.model';

export type PartialUpdateEnrollment = Partial<IEnrollment> & Pick<IEnrollment, 'id'>;

type RestOf<T extends IEnrollment | NewEnrollment> = Omit<T, 'enrollmentDate' | 'createdDate' | 'lastModifiedDate'> & {
  enrollmentDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestEnrollment = RestOf<IEnrollment>;

export type NewRestEnrollment = RestOf<NewEnrollment>;

export type PartialUpdateRestEnrollment = RestOf<PartialUpdateEnrollment>;

export type EntityResponseType = HttpResponse<IEnrollment>;
export type EntityArrayResponseType = HttpResponse<IEnrollment[]>;

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/enrollments');

  create(enrollment: NewEnrollment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(enrollment);
    return this.http
      .post<RestEnrollment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(enrollment: IEnrollment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(enrollment);
    return this.http
      .put<RestEnrollment>(`${this.resourceUrl}/${this.getEnrollmentIdentifier(enrollment)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(enrollment: PartialUpdateEnrollment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(enrollment);
    return this.http
      .patch<RestEnrollment>(`${this.resourceUrl}/${this.getEnrollmentIdentifier(enrollment)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEnrollment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEnrollment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEnrollmentIdentifier(enrollment: Pick<IEnrollment, 'id'>): number {
    return enrollment.id;
  }

  compareEnrollment(o1: Pick<IEnrollment, 'id'> | null, o2: Pick<IEnrollment, 'id'> | null): boolean {
    return o1 && o2 ? this.getEnrollmentIdentifier(o1) === this.getEnrollmentIdentifier(o2) : o1 === o2;
  }

  addEnrollmentToCollectionIfMissing<Type extends Pick<IEnrollment, 'id'>>(
    enrollmentCollection: Type[],
    ...enrollmentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const enrollments: Type[] = enrollmentsToCheck.filter(isPresent);
    if (enrollments.length > 0) {
      const enrollmentCollectionIdentifiers = enrollmentCollection.map(enrollmentItem => this.getEnrollmentIdentifier(enrollmentItem));
      const enrollmentsToAdd = enrollments.filter(enrollmentItem => {
        const enrollmentIdentifier = this.getEnrollmentIdentifier(enrollmentItem);
        if (enrollmentCollectionIdentifiers.includes(enrollmentIdentifier)) {
          return false;
        }
        enrollmentCollectionIdentifiers.push(enrollmentIdentifier);
        return true;
      });
      return [...enrollmentsToAdd, ...enrollmentCollection];
    }
    return enrollmentCollection;
  }

  protected convertDateFromClient<T extends IEnrollment | NewEnrollment | PartialUpdateEnrollment>(enrollment: T): RestOf<T> {
    return {
      ...enrollment,
      enrollmentDate: enrollment.enrollmentDate?.format(DATE_FORMAT) ?? null,
      createdDate: enrollment.createdDate?.toJSON() ?? null,
      lastModifiedDate: enrollment.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restEnrollment: RestEnrollment): IEnrollment {
    return {
      ...restEnrollment,
      enrollmentDate: restEnrollment.enrollmentDate ? dayjs(restEnrollment.enrollmentDate) : undefined,
      createdDate: restEnrollment.createdDate ? dayjs(restEnrollment.createdDate) : undefined,
      lastModifiedDate: restEnrollment.lastModifiedDate ? dayjs(restEnrollment.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEnrollment>): HttpResponse<IEnrollment> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEnrollment[]>): HttpResponse<IEnrollment[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
