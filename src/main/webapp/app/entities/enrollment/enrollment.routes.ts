import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { EnrollmentComponent } from './list/enrollment.component';
import { EnrollmentDetailComponent } from './detail/enrollment-detail.component';
import { EnrollmentUpdateComponent } from './update/enrollment-update.component';
import EnrollmentResolve from './route/enrollment-routing-resolve.service';

const enrollmentRoute: Routes = [
  {
    path: '',
    component: EnrollmentComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EnrollmentDetailComponent,
    resolve: {
      enrollment: EnrollmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EnrollmentUpdateComponent,
    resolve: {
      enrollment: EnrollmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EnrollmentUpdateComponent,
    resolve: {
      enrollment: EnrollmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default enrollmentRoute;
