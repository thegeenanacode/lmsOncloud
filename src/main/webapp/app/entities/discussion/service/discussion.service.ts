import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDiscussion, NewDiscussion } from '../discussion.model';

export type PartialUpdateDiscussion = Partial<IDiscussion> & Pick<IDiscussion, 'id'>;

type RestOf<T extends IDiscussion | NewDiscussion> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestDiscussion = RestOf<IDiscussion>;

export type NewRestDiscussion = RestOf<NewDiscussion>;

export type PartialUpdateRestDiscussion = RestOf<PartialUpdateDiscussion>;

export type EntityResponseType = HttpResponse<IDiscussion>;
export type EntityArrayResponseType = HttpResponse<IDiscussion[]>;

@Injectable({ providedIn: 'root' })
export class DiscussionService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/discussions');

  create(discussion: NewDiscussion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(discussion);
    return this.http
      .post<RestDiscussion>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(discussion: IDiscussion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(discussion);
    return this.http
      .put<RestDiscussion>(`${this.resourceUrl}/${this.getDiscussionIdentifier(discussion)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(discussion: PartialUpdateDiscussion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(discussion);
    return this.http
      .patch<RestDiscussion>(`${this.resourceUrl}/${this.getDiscussionIdentifier(discussion)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestDiscussion>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestDiscussion[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDiscussionIdentifier(discussion: Pick<IDiscussion, 'id'>): number {
    return discussion.id;
  }

  compareDiscussion(o1: Pick<IDiscussion, 'id'> | null, o2: Pick<IDiscussion, 'id'> | null): boolean {
    return o1 && o2 ? this.getDiscussionIdentifier(o1) === this.getDiscussionIdentifier(o2) : o1 === o2;
  }

  addDiscussionToCollectionIfMissing<Type extends Pick<IDiscussion, 'id'>>(
    discussionCollection: Type[],
    ...discussionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const discussions: Type[] = discussionsToCheck.filter(isPresent);
    if (discussions.length > 0) {
      const discussionCollectionIdentifiers = discussionCollection.map(discussionItem => this.getDiscussionIdentifier(discussionItem));
      const discussionsToAdd = discussions.filter(discussionItem => {
        const discussionIdentifier = this.getDiscussionIdentifier(discussionItem);
        if (discussionCollectionIdentifiers.includes(discussionIdentifier)) {
          return false;
        }
        discussionCollectionIdentifiers.push(discussionIdentifier);
        return true;
      });
      return [...discussionsToAdd, ...discussionCollection];
    }
    return discussionCollection;
  }

  protected convertDateFromClient<T extends IDiscussion | NewDiscussion | PartialUpdateDiscussion>(discussion: T): RestOf<T> {
    return {
      ...discussion,
      createdDate: discussion.createdDate?.toJSON() ?? null,
      lastModifiedDate: discussion.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restDiscussion: RestDiscussion): IDiscussion {
    return {
      ...restDiscussion,
      createdDate: restDiscussion.createdDate ? dayjs(restDiscussion.createdDate) : undefined,
      lastModifiedDate: restDiscussion.lastModifiedDate ? dayjs(restDiscussion.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestDiscussion>): HttpResponse<IDiscussion> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestDiscussion[]>): HttpResponse<IDiscussion[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
