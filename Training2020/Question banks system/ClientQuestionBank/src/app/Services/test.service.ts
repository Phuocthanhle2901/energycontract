import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question } from '../Models/question.model';
import { UserAnswer } from '../Models/UserAnswer.model';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private httpClient:HttpClient) { }

  async generateTest(theme:string, level:number, count:number){
    let testUrl = 'https://localhost:44328/api/Question/randomQuestions?'
                    + 'theme='+ encodeURIComponent(theme) + '&level=' + level +'&count=' + count;
    return this.httpClient.post<Question[]>(testUrl, null).pipe().toPromise();
  }

  saveResult(userAnswer:UserAnswer){
    let resultUrl = 'https://localhost:44328/api/AnswerUser';
    return this.httpClient.post<UserAnswer>(resultUrl, userAnswer);
  }

  getResults(email:string, page:number){
    let resultsUrl = 'https://localhost:44328/api/AnswerUser/getAchievement?email='+ encodeURIComponent(email) + '&page=' + page;
    return this.httpClient.post<string>(resultsUrl, null).pipe();
  }

  getResultCount(email:string){
    let count = 'https://localhost:44328/api/AnswerUser/getResultCount?email=' + encodeURIComponent(email);
    return this.httpClient.post<number>(count, null);
  }

  getDetail(id:string){
    let detail ='https://localhost:44328/api/AnswerUser/' + id;
    return this.httpClient.get<UserAnswer>(detail);
  }

  async getLevels(theme:string){
    let levelsUrl = 'https://localhost:44328/api/Question/getLevels?theme=' + encodeURIComponent(theme);
    console.log(levelsUrl);
    return this.httpClient.post<number[]>(levelsUrl, null).pipe().toPromise();
  }

  async getTestCount(theme:string, level:number){
    let testCountUrl = 'https://localhost:44328/api/Question/levelCount?theme=' + encodeURIComponent(theme) + '&level=' + level;
    console.log(testCountUrl);
    return this.httpClient.post<number>(testCountUrl, null).toPromise();
  }

  countDown(time:number){
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
}
