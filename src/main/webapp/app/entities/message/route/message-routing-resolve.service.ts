import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMessage } from '../message.model';
import { MessageService } from '../service/message.service';

const messageResolve = (route: ActivatedRouteSnapshot): Observable<null | IMessage> => {
  const id = route.params['id'];
  if (id) {
    return inject(MessageService)
      .find(id)
      .pipe(
        mergeMap((message: HttpResponse<IMessage>) => {
          if (message.body) {
            return of(message.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default messageResolve;
