import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KeywordsDocumentPage } from './keywords-document.page';

const routes: Routes = [
  {
    path: '',
    component: KeywordsDocumentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeywordsDocumentPageRoutingModule {}
