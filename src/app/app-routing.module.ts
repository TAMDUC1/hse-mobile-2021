import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuardService} from './services/auth/auth-guard.service';
import {AuthResolverService} from './services/data/auth-resolver.service';

const routes: Routes = [
  {path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
    { path: 'main',
        resolve:{
          authEmail : AuthResolverService
        },
        loadChildren: './main/main.module#MainPageModule',
        canActivate: [AuthGuardService]
    },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },


  {
    path: 'audit',
    resolve:{
      authEmail : AuthResolverService
    },
    loadChildren: () => import('./audit/audit.module').then( m => m.AuditPageModule)
  },
  {
    path: 'audit-detail',
    resolve:{
      authEmail : AuthResolverService
    },
    loadChildren: () => import('./audit-detail/audit-detail.module').then( m => m.AuditDetailPageModule)
  },
  {
    path: 'problem-detail',
    resolve:{
      authEmail : AuthResolverService
    },
    loadChildren: () => import('./problem-detail/problem-detail.module').then( m => m.ProblemDetailPageModule)
  },
  {
    path: 'keywords-home',
    resolve:{
      authEmail : AuthResolverService
    },
    loadChildren: () => import('./keywords-home/keywords-home.module').then( m => m.KeywordsHomePageModule)
  },
  {
    path: 'keywords-document',
    resolve:{
      authEmail : AuthResolverService
    },
    loadChildren: () => import('./keywords-document/keywords-document.module').then( m => m.KeywordsDocumentPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
