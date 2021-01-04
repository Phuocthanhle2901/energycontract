import {Component, OnInit } from '@angular/core';
import {UserService} from '../../../Services/user.service'
import{EmailValidation,PasswordValidation} from '../../../Validators/validator';
import {faEnvelope } from '@fortawesome/free-solid-svg-icons';
import {FormBuilder,FormControl,FormGroup } from '@angular/forms';
import $cookie from "js-cookie";


@Component({
  selector: 'app-register',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.scss']
})
export class ForgetComponent implements OnInit {
  envelope=faEnvelope;
  message:string;
  dataform:FormGroup;
  status:number;

  constructor(private userService:UserService ,private formBuilder: FormBuilder) {
    this.dataform = new FormGroup({email: new FormControl('', EmailValidation)});
   }

  ngOnInit(): void {

  }

  async sendLink(data:FormGroup)
  {
    this.status = await this.userService.sendLink(data['email']);
    if(this.status==0){ //if no error
      let expire = new Date();
      expire.setMinutes(expire.getMinutes() + 10); //set expire time
      $cookie.set(data['email'], data['email'], {expires: expire}); //set cookie expiring in set time
    }
  }

}
