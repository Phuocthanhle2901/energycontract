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
import { IndexComponent } from './Components/Admin/index/index.component';

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
    IndexComponent
  ],
  imports: [
    ValidatorsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    FontAwesomeModule,
    NgbAlertModule,NgbPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
