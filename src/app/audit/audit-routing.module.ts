import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuditPage } from './audit.page';
import {AuthResolverService} from '../services/data/auth-resolver.service';

const routes: Routes = [
  {
    path: '',
    resolve:{
      authEmail : AuthResolverService
    },
    component: AuditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditPageRoutingModule {}
