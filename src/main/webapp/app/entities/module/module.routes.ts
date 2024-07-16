import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ModuleComponent } from './list/module.component';
import { ModuleDetailComponent } from './detail/module-detail.component';
import { ModuleUpdateComponent } from './update/module-update.component';
import ModuleResolve from './route/module-routing-resolve.service';

const moduleRoute: Routes = [
  {
    path: '',
    component: ModuleComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ModuleDetailComponent,
    resolve: {
      module: ModuleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ModuleUpdateComponent,
    resolve: {
      module: ModuleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ModuleUpdateComponent,
    resolve: {
      module: ModuleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default moduleRoute;
