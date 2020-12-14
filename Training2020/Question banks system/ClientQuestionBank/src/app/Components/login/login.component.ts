import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';
import{EmailValidation,PasswordValidation} from '../../Validators/validator';
import { faSign } from '@fortawesome/free-solid-svg-icons';
import {authenticate,isAuth} from '../../../assets/js/auth.js';
import { FormBuilder,FormControl,FormGroup } from '@angular/forms';// cung cấp các phương pháp thuận tiện để tạo điều khiển
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  //icon
  signin=faSign;

  message:string;
  //data from form
  dataform:FormGroup;// biến chung cho data form cần lấy
  // tai liệu tham khảo: https://angular.io/start/start-forms
  constructor(private formBuilder: FormBuilder,private router: Router) {
    this.dataform = this.formBuilder.group({
      email: new FormControl('', EmailValidation),
      password: new FormControl('', PasswordValidation)
    });
   }

  ngOnInit(): void {

  }
  getAccount(e,data:any)
  {

    axios.post("https://localhost:44328/api/userinfo/login",data)
    .then(res=>{
      if(res.data.status==200)
      {
         const data=JSON.parse(res.data.data);
         authenticate(data);


        this.router.navigate(["/"]);
      }
      else
      {
        this.message=res.data.message;
      }

    })
    .catch(err=>{console.log(err)})
     e.preventDefault();
  }
}
