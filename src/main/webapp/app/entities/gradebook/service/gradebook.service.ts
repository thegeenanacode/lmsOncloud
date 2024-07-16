import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGradebook, NewGradebook } from '../gradebook.model';

export type PartialUpdateGradebook = Partial<IGradebook> & Pick<IGradebook, 'id'>;

type RestOf<T extends IGradebook | NewGradebook> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestGradebook = RestOf<IGradebook>;

export type NewRestGradebook = RestOf<NewGradebook>;

export type PartialUpdateRestGradebook = RestOf<PartialUpdateGradebook>;

export type EntityResponseType = HttpResponse<IGradebook>;
export type EntityArrayResponseType = HttpResponse<IGradebook[]>;

@Injectable({ providedIn: 'root' })
export class GradebookService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/gradebooks');

  create(gradebook: NewGradebook): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gradebook);
    return this.http
      .post<RestGradebook>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(gradebook: IGradebook): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gradebook);
    return this.http
      .put<RestGradebook>(`${this.resourceUrl}/${this.getGradebookIdentifier(gradebook)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(gradebook: PartialUpdateGradebook): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gradebook);
    return this.http
      .patch<RestGradebook>(`${this.resourceUrl}/${this.getGradebookIdentifier(gradebook)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestGradebook>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestGradebook[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGradebookIdentifier(gradebook: Pick<IGradebook, 'id'>): number {
    return gradebook.id;
  }

  compareGradebook(o1: Pick<IGradebook, 'id'> | null, o2: Pick<IGradebook, 'id'> | null): boolean {
    return o1 && o2 ? this.getGradebookIdentifier(o1) === this.getGradebookIdentifier(o2) : o1 === o2;
  }

  addGradebookToCollectionIfMissing<Type extends Pick<IGradebook, 'id'>>(
    gradebookCollection: Type[],
    ...gradebooksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const gradebooks: Type[] = gradebooksToCheck.filter(isPresent);
    if (gradebooks.length > 0) {
      const gradebookCollectionIdentifiers = gradebookCollection.map(gradebookItem => this.getGradebookIdentifier(gradebookItem));
      const gradebooksToAdd = gradebooks.filter(gradebookItem => {
        const gradebookIdentifier = this.getGradebookIdentifier(gradebookItem);
        if (gradebookCollectionIdentifiers.includes(gradebookIdentifier)) {
          return false;
        }
        gradebookCollectionIdentifiers.push(gradebookIdentifier);
        return true;
      });
      return [...gradebooksToAdd, ...gradebookCollection];
    }
    return gradebookCollection;
  }

  protected convertDateFromClient<T extends IGradebook | NewGradebook | PartialUpdateGradebook>(gradebook: T): RestOf<T> {
    return {
      ...gradebook,
      createdDate: gradebook.createdDate?.toJSON() ?? null,
      lastModifiedDate: gradebook.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restGradebook: RestGradebook): IGradebook {
    return {
      ...restGradebook,
      createdDate: restGradebook.createdDate ? dayjs(restGradebook.createdDate) : undefined,
      lastModifiedDate: restGradebook.lastModifiedDate ? dayjs(restGradebook.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestGradebook>): HttpResponse<IGradebook> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestGradebook[]>): HttpResponse<IGradebook[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
