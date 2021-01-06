import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import $cookie from 'js-cookie';
import { PasswordValidation } from 'src/app/Validators/validator';
import {UserService} from '../../../Services/user.service'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  available:boolean;
  status: number = -1;
  email:string;
  dataform:FormGroup;

  constructor(private userService:UserService) { }
  
  ngOnInit(): void {
    let cutPost = window.location.href.indexOf('passwordReset/') + 14;
    this.email = window.location.href.substring(cutPost)
    this.checkCookie();
    console.log(this.status);
  }

  checkCookie(){
    if($cookie.get(this.email)!=undefined){
      this.available = true;
      this.dataform = new FormGroup({password: new FormControl('', PasswordValidation)});
    }
    else this.available = false;
  }

  async updatePassword(data:FormGroup){
    this.status = await this.userService.resetPassword(this.email, data['password']);
    $cookie.remove(this.email) //remove cookie
  }

}
