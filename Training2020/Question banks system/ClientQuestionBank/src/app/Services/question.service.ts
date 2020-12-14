import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import {Observable,of} from 'rxjs';
import {Question} from '../Models/question.model';

const httpOptions ={
  headers:new HttpHeaders({'Content-Type':'Application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  apiUrl:string;

  constructor(private httpClient:HttpClient) { }

  getThemeQuestions(theme:string):Observable<JSON>{
    this.apiUrl = "https://localhost:44328/api/Question/themeQuestions?theme=" + encodeURIComponent(theme);
    console.log(this.apiUrl);
    return this.httpClient.post<JSON>(this.apiUrl, null).pipe();
  }
}
