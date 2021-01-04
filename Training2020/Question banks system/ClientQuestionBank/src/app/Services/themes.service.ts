import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import {Observable,of} from 'rxjs';

const httpOptions ={
  headers:new HttpHeaders({'Content-Type':'Application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class ThemesService {
  apiUrl = "https://localhost:44328/api/Question/themes";

  constructor(private httpClient:HttpClient) { }

  async getThemes(){
    return await this.httpClient.post<string[]>(this.apiUrl, null).toPromise()//get themes from api
  }
}
