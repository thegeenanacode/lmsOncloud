import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAssignment } from '../assignment.model';
import { AssignmentService } from '../service/assignment.service';

const assignmentResolve = (route: ActivatedRouteSnapshot): Observable<null | IAssignment> => {
  const id = route.params['id'];
  if (id) {
    return inject(AssignmentService)
      .find(id)
      .pipe(
        mergeMap((assignment: HttpResponse<IAssignment>) => {
          if (assignment.body) {
            return of(assignment.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default assignmentResolve;
