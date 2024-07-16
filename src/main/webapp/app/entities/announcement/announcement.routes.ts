import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { AnnouncementComponent } from './list/announcement.component';
import { AnnouncementDetailComponent } from './detail/announcement-detail.component';
import { AnnouncementUpdateComponent } from './update/announcement-update.component';
import AnnouncementResolve from './route/announcement-routing-resolve.service';

const announcementRoute: Routes = [
  {
    path: '',
    component: AnnouncementComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AnnouncementDetailComponent,
    resolve: {
      announcement: AnnouncementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AnnouncementUpdateComponent,
    resolve: {
      announcement: AnnouncementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AnnouncementUpdateComponent,
    resolve: {
      announcement: AnnouncementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default announcementRoute;
