import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuditImageZoomComponent} from './audit-image-zoom/audit-image-zoom.component';
import { IonicModule } from '@ionic/angular';

import { ProblemDetailPageRoutingModule } from './problem-detail-routing.module';

import { ProblemDetailPage } from './problem-detail.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProblemDetailPageRoutingModule,
        ReactiveFormsModule
    ],
  declarations: [ProblemDetailPage,AuditImageZoomComponent],
  entryComponents:[AuditImageZoomComponent]

})
export class ProblemDetailPageModule {}
