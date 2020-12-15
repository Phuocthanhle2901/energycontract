import { Content } from '@angular/compiler/src/render3/r3_ast';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HaederComponent} from './Components/haeder/haeder.component';
import {ContentComponent} from './Components/content/content.component';
import{HomeComponent} from'./Components/home/home.component';
import {LoginComponent} from './Components/login/login.component';
import {RegisterComponent} from './Components/register/register.component';
import {QuestionComponent} from './Components/ComponentQuestions/question/question.component';
import {IndexComponent} from "./Components/Admin/index/index.component";

const routes: Routes = [
  {path:"",component:HomeComponent},
  {path:"login",component:LoginComponent},
  {path:"register",component:RegisterComponent},
  {path:"questions",component:QuestionComponent},
  {path:"admin/index",component:IndexComponent},
  {path:"admin/createQuestion",component:IndexComponent},// create question
  {path:"admin/questions",component:IndexComponent},// list question


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
