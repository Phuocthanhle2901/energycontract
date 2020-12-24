import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAnswer } from '../Models/UserAnswer.model';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private httpClient:HttpClient) { }

  generateTest(theme:string, count:number){
    let testUrl = 'https://localhost:44328/api/Question/randomQuestions?'+ 'theme='+ theme +'&count=' + count;
    return this.httpClient.post<JSON>(testUrl, null).pipe();
  }

  saveResult(userAnswer:UserAnswer){
    let resultUrl = 'https://localhost:44328/api/AnswerUser';
    return this.httpClient.post<UserAnswer>(resultUrl, userAnswer);
  }
}
