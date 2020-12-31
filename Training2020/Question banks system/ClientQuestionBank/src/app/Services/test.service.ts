import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAnswer } from '../Models/UserAnswer.model';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  email:string;
  constructor(private httpClient:HttpClient) { }

  generateTest(theme:string, count:number){
    let testUrl = 'https://localhost:44328/api/Question/randomQuestions?'+ 'theme='+ theme +'&count=' + count;
    return this.httpClient.post<JSON>(testUrl, null).pipe();
  }

  saveResult(userAnswer:UserAnswer){
    let resultUrl = 'https://localhost:44328/api/AnswerUser';
    return this.httpClient.post<UserAnswer>(resultUrl, userAnswer);
  }

  getResults(email:string, page:number){
    let resultsUrl = 'https://localhost:44328/api/AnswerUser/getAchievement?email='+ encodeURIComponent(email) + '&page=' + page;
    return this.httpClient.post<JSON>(resultsUrl, null).pipe();
  }

  getResultCount(email:string){
    let count = 'https://localhost:44328/api/AnswerUser/getResultCount?email=' + encodeURIComponent(email);
    return this.httpClient.post<number>(count, null);
  }

  getDetail(id:string){
    let detail ='https://localhost:44328/api/AnswerUser/' + id;
    return this.httpClient.get<UserAnswer>(detail);
  }

  getEmail(){
    return this.email;
  }
  setEmail(email:string){
    this.email = email;
  }
}
