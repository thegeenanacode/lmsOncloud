import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAnnouncement } from '../announcement.model';
import { AnnouncementService } from '../service/announcement.service';

const announcementResolve = (route: ActivatedRouteSnapshot): Observable<null | IAnnouncement> => {
  const id = route.params['id'];
  if (id) {
    return inject(AnnouncementService)
      .find(id)
      .pipe(
        mergeMap((announcement: HttpResponse<IAnnouncement>) => {
          if (announcement.body) {
            return of(announcement.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default announcementResolve;
