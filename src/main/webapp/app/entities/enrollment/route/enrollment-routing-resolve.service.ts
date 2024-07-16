import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEnrollment } from '../enrollment.model';
import { EnrollmentService } from '../service/enrollment.service';

const enrollmentResolve = (route: ActivatedRouteSnapshot): Observable<null | IEnrollment> => {
  const id = route.params['id'];
  if (id) {
    return inject(EnrollmentService)
      .find(id)
      .pipe(
        mergeMap((enrollment: HttpResponse<IEnrollment>) => {
          if (enrollment.body) {
            return of(enrollment.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default enrollmentResolve;
