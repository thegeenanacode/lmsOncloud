import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IModule, NewModule } from '../module.model';

export type PartialUpdateModule = Partial<IModule> & Pick<IModule, 'id'>;

type RestOf<T extends IModule | NewModule> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestModule = RestOf<IModule>;

export type NewRestModule = RestOf<NewModule>;

export type PartialUpdateRestModule = RestOf<PartialUpdateModule>;

export type EntityResponseType = HttpResponse<IModule>;
export type EntityArrayResponseType = HttpResponse<IModule[]>;

@Injectable({ providedIn: 'root' })
export class ModuleService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/modules');

  create(module: NewModule): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(module);
    return this.http
      .post<RestModule>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(module: IModule): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(module);
    return this.http
      .put<RestModule>(`${this.resourceUrl}/${this.getModuleIdentifier(module)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(module: PartialUpdateModule): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(module);
    return this.http
      .patch<RestModule>(`${this.resourceUrl}/${this.getModuleIdentifier(module)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestModule>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestModule[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getModuleIdentifier(module: Pick<IModule, 'id'>): number {
    return module.id;
  }

  compareModule(o1: Pick<IModule, 'id'> | null, o2: Pick<IModule, 'id'> | null): boolean {
    return o1 && o2 ? this.getModuleIdentifier(o1) === this.getModuleIdentifier(o2) : o1 === o2;
  }

  addModuleToCollectionIfMissing<Type extends Pick<IModule, 'id'>>(
    moduleCollection: Type[],
    ...modulesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const modules: Type[] = modulesToCheck.filter(isPresent);
    if (modules.length > 0) {
      const moduleCollectionIdentifiers = moduleCollection.map(moduleItem => this.getModuleIdentifier(moduleItem));
      const modulesToAdd = modules.filter(moduleItem => {
        const moduleIdentifier = this.getModuleIdentifier(moduleItem);
        if (moduleCollectionIdentifiers.includes(moduleIdentifier)) {
          return false;
        }
        moduleCollectionIdentifiers.push(moduleIdentifier);
        return true;
      });
      return [...modulesToAdd, ...moduleCollection];
    }
    return moduleCollection;
  }

  protected convertDateFromClient<T extends IModule | NewModule | PartialUpdateModule>(module: T): RestOf<T> {
    return {
      ...module,
      createdDate: module.createdDate?.toJSON() ?? null,
      lastModifiedDate: module.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restModule: RestModule): IModule {
    return {
      ...restModule,
      createdDate: restModule.createdDate ? dayjs(restModule.createdDate) : undefined,
      lastModifiedDate: restModule.lastModifiedDate ? dayjs(restModule.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestModule>): HttpResponse<IModule> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestModule[]>): HttpResponse<IModule[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
