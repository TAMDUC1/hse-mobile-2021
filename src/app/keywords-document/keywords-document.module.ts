import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KeywordsDocumentPageRoutingModule } from './keywords-document-routing.module';

import { KeywordsDocumentPage } from './keywords-document.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KeywordsDocumentPageRoutingModule
  ],
  declarations: [KeywordsDocumentPage]
})
export class KeywordsDocumentPageModule {}
