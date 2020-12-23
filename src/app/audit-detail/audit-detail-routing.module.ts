import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuditDetailPage } from './audit-detail.page';

const routes: Routes = [
  {
    path: '',
    component: AuditDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditDetailPageRoutingModule {}
