import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';


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
