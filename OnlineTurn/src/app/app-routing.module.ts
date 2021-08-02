import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './components/companies/list/list.component';
import { CurrentComponent } from './components/companies/current/current.component';
import { CreateComponent } from './components/companies/create/create.component';
import { TakeTiketComponent } from './components/take-tiket/take-tiket.component';
import { MyComponent } from './components/companies/my/my.component';
import { LoginComponent } from './components/login/login.component';


const routes: Routes = [
  {
    path: "",
    component: ListComponent
  },
  {
    path: "companies/:id/current",
    component: CurrentComponent
  },
  {
    path: "companies/create/:id",
    component: CreateComponent
  },
  {
    path: "companies/my/:id",
    component: MyComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "companies/:id/tiket",
    component: TakeTiketComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
