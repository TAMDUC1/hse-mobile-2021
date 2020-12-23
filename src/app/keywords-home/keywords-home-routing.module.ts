import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KeywordsHomePage } from './keywords-home.page';

const routes: Routes = [
  {
    path: '',
    component: KeywordsHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeywordsHomePageRoutingModule {}
