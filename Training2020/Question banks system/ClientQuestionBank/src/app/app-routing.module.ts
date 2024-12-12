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
import{QuetstionBodyComponent} from './Components/ComponentQuestions/quetstion-body/quetstion-body.component';
import {UpdateComponent} from './Components/Admin/Question/update/update.component';
import {AchievementsComponent} from './Components/achievements/achievements.component';
import {DetailAchievementComponent} from './Components/detail-achievement/detail-achievement.component';
import{UsUpdateComponent}from './Components/Admin/User/us-update/us-update.component';
import {ForgetComponent} from './Components/login/forget/forget.component';
import { ResetPasswordComponent } from './Components/login/reset-password/reset-password.component'
const routes: Routes = [
  {path:"",component:HomeComponent},
  {path:"login",component:LoginComponent},
  {path:"login/forget", component:ForgetComponent},
  {path:"login/passwordReset/:email", component:ResetPasswordComponent},
  {path:"register",component:RegisterComponent},
  {path:"questions",component:QuestionComponent},
  {path:"questionTest/:name",component:QuetstionBodyComponent},// thực hiện test
  {path:"admin/index",component:IndexComponent},
  {path:"admin/createQuestion",component:IndexComponent},// create question
  {path:"admin/questions",component:IndexComponent},// list question
  {path:"admin/updateQuestion",component:UpdateComponent},// update question
  {path:"admin/updateQuestion",component:IndexComponent},// list question
  {path:"admin/users",component:IndexComponent},
  {path:"admin/createUsers",component:IndexComponent},// list question
  {path:"achievements",component:AchievementsComponent},// AchievementsComponent user
  {path:"detail/achievements/:id",component:DetailAchievementComponent},// AchievementsComponent user
  {path:"admin/editUser",component:IndexComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
