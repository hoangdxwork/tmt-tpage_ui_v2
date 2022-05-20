import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./main-app/main-app.module').then(m => m.MainAppModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true , onSameUrlNavigation: 'reload',  preloadingStrategy: PreloadAllModules} )],
  exports: [RouterModule]
})

export class AppRoutingModule {}
