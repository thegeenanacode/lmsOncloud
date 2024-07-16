import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IContentLibrary } from '../content-library.model';
import { ContentLibraryService } from '../service/content-library.service';

const contentLibraryResolve = (route: ActivatedRouteSnapshot): Observable<null | IContentLibrary> => {
  const id = route.params['id'];
  if (id) {
    return inject(ContentLibraryService)
      .find(id)
      .pipe(
        mergeMap((contentLibrary: HttpResponse<IContentLibrary>) => {
          if (contentLibrary.body) {
            return of(contentLibrary.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default contentLibraryResolve;
