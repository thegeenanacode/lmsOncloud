import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IContentLibrary, NewContentLibrary } from '../content-library.model';

export type PartialUpdateContentLibrary = Partial<IContentLibrary> & Pick<IContentLibrary, 'id'>;

type RestOf<T extends IContentLibrary | NewContentLibrary> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestContentLibrary = RestOf<IContentLibrary>;

export type NewRestContentLibrary = RestOf<NewContentLibrary>;

export type PartialUpdateRestContentLibrary = RestOf<PartialUpdateContentLibrary>;

export type EntityResponseType = HttpResponse<IContentLibrary>;
export type EntityArrayResponseType = HttpResponse<IContentLibrary[]>;

@Injectable({ providedIn: 'root' })
export class ContentLibraryService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/content-libraries');

  create(contentLibrary: NewContentLibrary): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(contentLibrary);
    return this.http
      .post<RestContentLibrary>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(contentLibrary: IContentLibrary): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(contentLibrary);
    return this.http
      .put<RestContentLibrary>(`${this.resourceUrl}/${this.getContentLibraryIdentifier(contentLibrary)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(contentLibrary: PartialUpdateContentLibrary): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(contentLibrary);
    return this.http
      .patch<RestContentLibrary>(`${this.resourceUrl}/${this.getContentLibraryIdentifier(contentLibrary)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestContentLibrary>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestContentLibrary[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getContentLibraryIdentifier(contentLibrary: Pick<IContentLibrary, 'id'>): number {
    return contentLibrary.id;
  }

  compareContentLibrary(o1: Pick<IContentLibrary, 'id'> | null, o2: Pick<IContentLibrary, 'id'> | null): boolean {
    return o1 && o2 ? this.getContentLibraryIdentifier(o1) === this.getContentLibraryIdentifier(o2) : o1 === o2;
  }

  addContentLibraryToCollectionIfMissing<Type extends Pick<IContentLibrary, 'id'>>(
    contentLibraryCollection: Type[],
    ...contentLibrariesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const contentLibraries: Type[] = contentLibrariesToCheck.filter(isPresent);
    if (contentLibraries.length > 0) {
      const contentLibraryCollectionIdentifiers = contentLibraryCollection.map(contentLibraryItem =>
        this.getContentLibraryIdentifier(contentLibraryItem),
      );
      const contentLibrariesToAdd = contentLibraries.filter(contentLibraryItem => {
        const contentLibraryIdentifier = this.getContentLibraryIdentifier(contentLibraryItem);
        if (contentLibraryCollectionIdentifiers.includes(contentLibraryIdentifier)) {
          return false;
        }
        contentLibraryCollectionIdentifiers.push(contentLibraryIdentifier);
        return true;
      });
      return [...contentLibrariesToAdd, ...contentLibraryCollection];
    }
    return contentLibraryCollection;
  }

  protected convertDateFromClient<T extends IContentLibrary | NewContentLibrary | PartialUpdateContentLibrary>(
    contentLibrary: T,
  ): RestOf<T> {
    return {
      ...contentLibrary,
      createdDate: contentLibrary.createdDate?.toJSON() ?? null,
      lastModifiedDate: contentLibrary.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restContentLibrary: RestContentLibrary): IContentLibrary {
    return {
      ...restContentLibrary,
      createdDate: restContentLibrary.createdDate ? dayjs(restContentLibrary.createdDate) : undefined,
      lastModifiedDate: restContentLibrary.lastModifiedDate ? dayjs(restContentLibrary.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestContentLibrary>): HttpResponse<IContentLibrary> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestContentLibrary[]>): HttpResponse<IContentLibrary[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
