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

  getThemes():Observable<JSON>{
    return this.httpClient.post<JSON>(this.apiUrl, null).pipe()
  }
}
