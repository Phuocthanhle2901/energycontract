import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  testUrl:string;
  constructor(private httpClient:HttpClient) { }

  generateTest(theme:string, count:number):Observable<JSON>{
    this.testUrl = 'https://localhost:44328/api/Question/randomQuestions?'+ 'theme='+ theme +'&count=' + count;
    return this.httpClient.post<JSON>(this.testUrl, null).pipe();
  }
}
