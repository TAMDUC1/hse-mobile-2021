import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KeywordsHomePageRoutingModule } from './keywords-home-routing.module';
import { DocumentDetailComponent} from './document-detail/document-detail.component';
import { KeywordsHomePage } from './keywords-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KeywordsHomePageRoutingModule
  ],
  declarations: [KeywordsHomePage,DocumentDetailComponent],
  entryComponents:[DocumentDetailComponent]

})
export class KeywordsHomePageModule {}
