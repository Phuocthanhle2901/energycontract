import { Component, OnChanges, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  FullNameValidation,
  EmailValidation,
  PasswordValidation,
} from '../../Validators/validator';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import {authenticate,isAuth} from '../../../assets/js/auth.js';

import axios from 'axios';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  register = faDownload;
  message: string;
  passwordNotMatch: boolean;
  //data from form
  dataform: FormGroup;

  constructor(private formbuilder: FormBuilder,private router: Router) {
    this.dataform = this.formbuilder.group({
      fullname: new FormControl('',FullNameValidation),
      email: new FormControl('', EmailValidation),
      password: new FormControl('', PasswordValidation),
      confirmpassword: ['',[Validators.required, this.passwordMatcher.bind(this)]],
    });
  }
  private passwordMatcher(control: FormControl): { [s: string]: boolean } {
    if (
      this.dataform &&
      control.value !== this.dataform.get('password').value
    ) {
      return { passwordNotMatch: true };
    }
    return null;
  }

  ngOnInit(): void {}

  onchange() {
    this.dataform.controls['confirmpassword'].setValue('');
  }

  sumbitRegister(e, data: any) {
    console.log(data)
    axios
      .post('https://localhost:44328/api/userinfo/register', data)
      .then((res) => {
        if (res.data.status == 200){
          this.router.navigate(["login"]);
        } else {
          this.message = res.data.message;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
    
}
