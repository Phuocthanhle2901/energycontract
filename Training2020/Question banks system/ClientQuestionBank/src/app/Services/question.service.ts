import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  questionUrl:string;
  count:string
  constructor(private httpClient:HttpClient) { }

  getThemeQuestions(theme:string, page:number):Observable<JSON>{
    this.questionUrl = "https://localhost:44328/api/Question/themeQuestions?theme=" + encodeURIComponent(theme) + "&page=" + page;
    return this.httpClient.post<JSON>(this.questionUrl, null).pipe();
  }

  getCount(theme:string){
    this.count = "https://localhost:44328/api/Question/countQuestions?theme=" + encodeURIComponent(theme);
    return this.httpClient.post<JSON>(this.count, null);
  }
}
