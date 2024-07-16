import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAssignment, NewAssignment } from '../assignment.model';

export type PartialUpdateAssignment = Partial<IAssignment> & Pick<IAssignment, 'id'>;

type RestOf<T extends IAssignment | NewAssignment> = Omit<T, 'dueDate' | 'createdDate' | 'lastModifiedDate'> & {
  dueDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestAssignment = RestOf<IAssignment>;

export type NewRestAssignment = RestOf<NewAssignment>;

export type PartialUpdateRestAssignment = RestOf<PartialUpdateAssignment>;

export type EntityResponseType = HttpResponse<IAssignment>;
export type EntityArrayResponseType = HttpResponse<IAssignment[]>;

@Injectable({ providedIn: 'root' })
export class AssignmentService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/assignments');

  create(assignment: NewAssignment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(assignment);
    return this.http
      .post<RestAssignment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(assignment: IAssignment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(assignment);
    return this.http
      .put<RestAssignment>(`${this.resourceUrl}/${this.getAssignmentIdentifier(assignment)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(assignment: PartialUpdateAssignment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(assignment);
    return this.http
      .patch<RestAssignment>(`${this.resourceUrl}/${this.getAssignmentIdentifier(assignment)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAssignment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAssignment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAssignmentIdentifier(assignment: Pick<IAssignment, 'id'>): number {
    return assignment.id;
  }

  compareAssignment(o1: Pick<IAssignment, 'id'> | null, o2: Pick<IAssignment, 'id'> | null): boolean {
    return o1 && o2 ? this.getAssignmentIdentifier(o1) === this.getAssignmentIdentifier(o2) : o1 === o2;
  }

  addAssignmentToCollectionIfMissing<Type extends Pick<IAssignment, 'id'>>(
    assignmentCollection: Type[],
    ...assignmentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const assignments: Type[] = assignmentsToCheck.filter(isPresent);
    if (assignments.length > 0) {
      const assignmentCollectionIdentifiers = assignmentCollection.map(assignmentItem => this.getAssignmentIdentifier(assignmentItem));
      const assignmentsToAdd = assignments.filter(assignmentItem => {
        const assignmentIdentifier = this.getAssignmentIdentifier(assignmentItem);
        if (assignmentCollectionIdentifiers.includes(assignmentIdentifier)) {
          return false;
        }
        assignmentCollectionIdentifiers.push(assignmentIdentifier);
        return true;
      });
      return [...assignmentsToAdd, ...assignmentCollection];
    }
    return assignmentCollection;
  }

  protected convertDateFromClient<T extends IAssignment | NewAssignment | PartialUpdateAssignment>(assignment: T): RestOf<T> {
    return {
      ...assignment,
      dueDate: assignment.dueDate?.format(DATE_FORMAT) ?? null,
      createdDate: assignment.createdDate?.toJSON() ?? null,
      lastModifiedDate: assignment.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAssignment: RestAssignment): IAssignment {
    return {
      ...restAssignment,
      dueDate: restAssignment.dueDate ? dayjs(restAssignment.dueDate) : undefined,
      createdDate: restAssignment.createdDate ? dayjs(restAssignment.createdDate) : undefined,
      lastModifiedDate: restAssignment.lastModifiedDate ? dayjs(restAssignment.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAssignment>): HttpResponse<IAssignment> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAssignment[]>): HttpResponse<IAssignment[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
