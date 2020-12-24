import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import {Observable,of} from 'rxjs';
import {Question} from '../Models/question.model';
import axios from "axios";
const httpOptions ={
  headers:new HttpHeaders({'Content-Type':'Application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private httpClient:HttpClient) { }

  getThemeQuestions(theme:string, page:number){
    let questionUrl = "https://localhost:44328/api/Question/themeQuestions?theme=" + encodeURIComponent(theme) + "&page=" + page;
    return this.httpClient.post<JSON>(questionUrl, null).pipe(); //get paged questions, convert to iterable observable
  }

  getCount(theme:string){
    let count = "https://localhost:44328/api/Question/countQuestions?theme=" + encodeURIComponent(theme);
    return this.httpClient.post<JSON>(count, null); //get question count of a theme
  }

  getAnswer(id:string){
    let answer = "https://localhost:44328/api/Question/GetAnswer?id=" + id;
    return this.httpClient.post<JSON>(answer, null); //get answer of a question
  }

  createQuestion(question:any)
  {

    axios.post("https://localhost:44328/api/Question",question)
    .then(res=>{
      console.log(res);
      return res;
    })
    .catch(err=> err)
  }
}
