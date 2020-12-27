import { Injectable } from '@angular/core';
import {getCookie} from '../../assets/js/auth.js';
import axios from 'axios';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

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
}
