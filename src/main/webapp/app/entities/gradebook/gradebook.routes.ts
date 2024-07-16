import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { GradebookComponent } from './list/gradebook.component';
import { GradebookDetailComponent } from './detail/gradebook-detail.component';
import { GradebookUpdateComponent } from './update/gradebook-update.component';
import GradebookResolve from './route/gradebook-routing-resolve.service';

const gradebookRoute: Routes = [
  {
    path: '',
    component: GradebookComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GradebookDetailComponent,
    resolve: {
      gradebook: GradebookResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GradebookUpdateComponent,
    resolve: {
      gradebook: GradebookResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GradebookUpdateComponent,
    resolve: {
      gradebook: GradebookResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default gradebookRoute;
