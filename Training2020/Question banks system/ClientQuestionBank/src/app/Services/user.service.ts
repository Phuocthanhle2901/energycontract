import { Injectable } from '@angular/core';
import {getCookie} from '../../assets/js/auth.js';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from "@angular/common/http";
import axios from 'axios';
import { Observable, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: BehaviorSubject<any> = new BehaviorSubject<any>({});
  user$: Observable<any> = this.user.asObservable(); // new data
  httpOptions = {
    headers: new HttpHeaders()
  }
  constructor(private httpClient:HttpClient) { }

  setuserObservable(data:any)
  {
    this.user.next(data);
  }

  createUser(user:any){

    return this.httpClient.post<JSON>('https://localhost:44328/api/UserInfo/Create', user);
  }
  editUser(id:any, data:any){
    return this.httpClient.put<JSON>('https://localhost:44328/api/UserInfo/'+id, data);
  }
  getInfoUser()
  {
    var cookie=getCookie();
    if(cookie.token!=undefined)
    {
      axios.post("https://localhost:44328/api/UserInfo/user?id="+cookie.token)
      .then(res=>{

          if(res.data!=null)
          {

           return {data:res.data.result,bio:true};
          }
          else{
           return {data:"",bio:false};
          }
      })
      .catch(err=>console.log(err));

    }
  }
  getRole()
  {
    return this.httpClient.post<JSON>('https://localhost:44328/api/UserInfo/role',null); //get question count of a theme
  }

  getUserbyRole(role:any)
  {
    return this.httpClient.post<JSON>(' https://localhost:44328/api/UserInfo/users?role='+role,null);
  }
  getAchievementByEmail(email:any)
  {
    // return this.httpClient.post<JSON>(' https://localhost:44328/api/UserInfo/users?role='+role,null);
  }
  getUserById(id:string){
    return this.httpClient.get<JSON>("https://localhost:44328/api/UserInfo/"+id);
  }

  removeUser(id:any){
    return this.httpClient.delete<JSON>("https://localhost:44328/api/UserInfo/"+id);
  }
  getAlluser()
  {
    return this.httpClient.get<JSON>("https://localhost:44328/api/UserInfo");
  }

  getUserForUpdate(id:any)
  {
    return this.httpClient.get<JSON>("https://localhost:44328/api/UserInfo/getuserById?id="+id);
  }
  updateUser(id:any,data:any)
  {
    return this.httpClient.put<JSON>("https://localhost:44328/api/UserInfo/"+id,data);

  }



}
