import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ContentLibraryComponent } from './list/content-library.component';
import { ContentLibraryDetailComponent } from './detail/content-library-detail.component';
import { ContentLibraryUpdateComponent } from './update/content-library-update.component';
import ContentLibraryResolve from './route/content-library-routing-resolve.service';

const contentLibraryRoute: Routes = [
  {
    path: '',
    component: ContentLibraryComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ContentLibraryDetailComponent,
    resolve: {
      contentLibrary: ContentLibraryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ContentLibraryUpdateComponent,
    resolve: {
      contentLibrary: ContentLibraryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ContentLibraryUpdateComponent,
    resolve: {
      contentLibrary: ContentLibraryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default contentLibraryRoute;
