import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { AssignmentComponent } from './list/assignment.component';
import { AssignmentDetailComponent } from './detail/assignment-detail.component';
import { AssignmentUpdateComponent } from './update/assignment-update.component';
import AssignmentResolve from './route/assignment-routing-resolve.service';

const assignmentRoute: Routes = [
  {
    path: '',
    component: AssignmentComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AssignmentDetailComponent,
    resolve: {
      assignment: AssignmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AssignmentUpdateComponent,
    resolve: {
      assignment: AssignmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AssignmentUpdateComponent,
    resolve: {
      assignment: AssignmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default assignmentRoute;
