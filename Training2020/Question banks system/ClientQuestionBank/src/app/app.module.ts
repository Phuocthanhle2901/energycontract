import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HaederComponent } from './Components/haeder/haeder.component';
import { ContentComponent } from './Components/content/content.component';
import { FooterComponent } from './Components/footer/footer.component';
import { HomeComponent } from './Components/home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentFirstComponent } from './Components/supperHome/content-first/content-first.component';
import {FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { ContentSecondComponent } from './Components/SupperHome/content-second/content-second.component';
import { QuestionComponent } from './Components/ComponentQuestions/question/question.component';
import { NavRightComponent } from './Components/ComponentQuestions/nav-right/nav-right.component';
import { QuetstionBodyComponent } from './Components/ComponentQuestions/quetstion-body/quetstion-body.component';
import { ValidatorsModule } from "ngx-validators";
import { HttpClientModule } from '@angular/common/http';
import { IndexComponent } from './Components/Admin/index/index.component';
import { NavleftComponent } from './Components/Admin/navleft/navleft.component';
import { HeaderAdminComponent } from './Components/Admin/header-admin/header-admin.component';
import { NavMainComponent } from './Components/Admin/nav-main/nav-main.component';
import { BodyMainComponent } from './Components/Admin/body-main/body-main.component';
import { BodysComponent } from './Components/Admin/bodys/bodys.component';
import { CreateComponent } from './Components/Admin/Question/create/create.component';
import { UpdateComponent } from './Components/Admin/Question/update/update.component';
import { ListComponent } from './Components/Admin/Question/list/list.component';
import { UsersComponent } from './Components/Admin/User/users/users.component';
import { UsCreateComponent } from './Components/Admin/User/us-create/us-create.component';
import { UsUpdateComponent } from './Components/Admin/User/us-update/us-update.component';
import { CommonModule } from '@angular/common';
import { AchievementsComponent } from './Components/achievements/achievements.component';
import { DetailAchievementComponent } from './Components/detail-achievement/detail-achievement.component';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { ForgetComponent } from './Components/login/forget/forget.component';
import { ResetPasswordComponent } from './Components/login/reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    HaederComponent,
    ContentComponent,
    FooterComponent,
    HomeComponent,
    ContentFirstComponent,
    LoginComponent,
    RegisterComponent,
    ContentSecondComponent,
    QuestionComponent,
    NavRightComponent,
    QuetstionBodyComponent,
    IndexComponent,
    NavleftComponent,
    HeaderAdminComponent,
    NavMainComponent,
    BodyMainComponent,
    BodysComponent,
    CreateComponent,
    UpdateComponent,
    ListComponent,
    UsersComponent,
    UsCreateComponent,
    UsUpdateComponent,
    AchievementsComponent,
    DetailAchievementComponent,
    ForgetComponent,
    ResetPasswordComponent,

  ],
  imports: [
    ValidatorsModule,
    BrowserModule,
    AppRoutingModule,
    NgxPageScrollModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    FontAwesomeModule,
    NgbAlertModule,NgbPaginationModule,
    HttpClientModule,
    CommonModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
