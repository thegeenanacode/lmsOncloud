import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { DiscussionComponent } from './list/discussion.component';
import { DiscussionDetailComponent } from './detail/discussion-detail.component';
import { DiscussionUpdateComponent } from './update/discussion-update.component';
import DiscussionResolve from './route/discussion-routing-resolve.service';

const discussionRoute: Routes = [
  {
    path: '',
    component: DiscussionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DiscussionDetailComponent,
    resolve: {
      discussion: DiscussionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DiscussionUpdateComponent,
    resolve: {
      discussion: DiscussionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DiscussionUpdateComponent,
    resolve: {
      discussion: DiscussionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default discussionRoute;
