import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Question } from '../Models/question.model';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  questionUrl: string;
  count: string;

  // used subcric dữ liệu, transition data component child to componet child different
  private question: BehaviorSubject<any> = new BehaviorSubject<any>({});
  question$: Observable<any> = this.question.asObservable(); // new data
  constructor(private httpClient: HttpClient) {}

  setQuestion(question: any) {
    // set new data for subcribed
    this.question.next(question);
  }

  getThemeQuestions(theme: string, page: number): Observable<JSON> {
    this.questionUrl =
      'https://localhost:44328/api/Question/themeQuestions?theme=' +
      encodeURIComponent(theme) +
      '&page=' +
      page;
    return this.httpClient.post<JSON>(this.questionUrl, null).pipe(); //get paged questions, convert to iterable observable
  }

  getCount(theme: string) {
    this.count =
      'https://localhost:44328/api/Question/countQuestions?theme=' +
      encodeURIComponent(theme);
    return this.httpClient.post<JSON>(this.count, null); //get question count of a theme
  }
  createQuestion(question: any) {
    return this.httpClient.post<JSON>(
      'https://localhost:44328/api/Question/create',
      question
    ); //get question count of a theme
  }

  getQuestionById(id: string) {
    return this.httpClient.get<JSON>(
      'https://localhost:44328/api/Question/' + id
    );
  }

  editQuestion(id:any,data: any) {
    return this.httpClient.put<JSON>(
      'https://localhost:44328/api/Question/'+id,
      data
    );
  }
  deleteQuestion(id:any)
  {
    return this.httpClient.delete<JSON>('https://localhost:44328/api/Question/'+id);
  }
  getAnswer(id:string){
    let answer = "https://localhost:44328/api/Question/GetAnswer?id=" + id;
    return this.httpClient.post<JSON>(answer, null); //get answer of a question
  }
}

