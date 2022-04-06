import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomPreloadingStrategy } from '@core/strategies';

const routes: Routes = [
  { path: '', redirectTo: '/passport/welcome', pathMatch: 'full' },
  {
    path: 'passport',
    loadChildren: () => import('./pages/passport/passport.module').then((m) => m.PassportModule),
    data: { preload: true },
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: '403',
    loadChildren: () =>
      import('./pages/forbidden-page/forbidden-page.module').then((m) => m.ForbiddenPageModule),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./pages/not-found-page/not-found-page.module').then((m) => m.NotFoundPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: CustomPreloadingStrategy,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
