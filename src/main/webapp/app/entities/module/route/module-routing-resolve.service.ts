import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IModule } from '../module.model';
import { ModuleService } from '../service/module.service';

const moduleResolve = (route: ActivatedRouteSnapshot): Observable<null | IModule> => {
  const id = route.params['id'];
  if (id) {
    return inject(ModuleService)
      .find(id)
      .pipe(
        mergeMap((module: HttpResponse<IModule>) => {
          if (module.body) {
            return of(module.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default moduleResolve;
