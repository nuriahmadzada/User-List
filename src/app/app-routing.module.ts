import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RegisterComponent } from './register/register.component';
import { UserListComponent } from './user-list/user-list.component';
import { AuthGuard } from './guard/auth.guard.ts';


const routes: Routes = [
  { 
    path: '',
    canActivate: [AuthGuard],
    component: UserListComponent,
    children: [
      { path: '', pathMatch: "full", redirectTo: "user-list/1" },
      { path: 'user-list/:id', component: UserListComponent },
    ]
  },  
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent, pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
