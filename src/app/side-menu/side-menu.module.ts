import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';

import { SideMenuPageRoutingModule } from './side-menu-routing.module';

import { SideMenuPage } from './side-menu.page';
const routes: Routes = [
    {
        path: '',
        component: SideMenuPage,
        children: [
            {
                path: 'main',
                loadChildren: '../main/main.module#MainPageModule'
            }
        ]
    }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SideMenuPageRoutingModule
  ],
  declarations: [SideMenuPage]
})
export class SideMenuPageModule {}
