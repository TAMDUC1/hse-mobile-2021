import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuditDetailPageRoutingModule } from './audit-detail-routing.module';

import { AuditDetailPage } from './audit-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuditDetailPageRoutingModule
  ],
  declarations: [AuditDetailPage]
})
export class AuditDetailPageModule {}
