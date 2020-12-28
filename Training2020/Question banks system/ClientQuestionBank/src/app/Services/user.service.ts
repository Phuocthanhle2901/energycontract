import { Injectable } from '@angular/core';
import {getCookie} from '../../assets/js/auth.js';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient:HttpClient) { }
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
}
