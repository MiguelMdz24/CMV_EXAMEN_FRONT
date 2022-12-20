import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './views/pages/error-page/error-page.component';


const routes: Routes = [
  {
    path: '', loadChildren: () => import('./views/pages/clientes/clientes.module').then(m => m.ClientesModule) //pagina principal (clientes)
  },
  {
    path: '**', component: ErrorPageComponent, //cualquier otro path, mandar a la pagina de error
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
