import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { faSign } from '@fortawesome/free-solid-svg-icons'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  //icon
  signin=faSign;



  email:string;
  password:string;
  constructor() {

   }

  ngOnInit(): void {
  }
  getAccount(e,email)
  {
    axios.post("https://localhost:44328/api/userinfo/login",email)
    .then(res=>{
      console.log(res);
    })
    .catch(err=>{console.log(err)})
    e.preventDefault();


  }
}
