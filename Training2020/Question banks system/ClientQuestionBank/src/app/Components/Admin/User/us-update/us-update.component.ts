import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
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
} from '../../../../Validators/validator';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import {UserService} from '../../../../Services/user.service';
// import { userInfo } from 'os';
@Component({
  selector: 'app-us-update',
  templateUrl: './us-update.component.html',
  styleUrls: ['./us-update.component.scss']
})
export class UsUpdateComponent implements OnInit {
  dataform: FormGroup;
  register = faDownload;
  message: string;
  passwordNotMatch: boolean;
  defaultValue = "Admin";
  
  idUser:string="";

  constructor(private http: HttpClient, private formbuilder: FormBuilder, private serviceuser:UserService) {
    this.dataform = this.formbuilder.group({
      fullname: new FormControl('', FullNameValidation),
      email: new FormControl('', EmailValidation),
      password: new FormControl('', PasswordValidation),
      confirmpassword: ['', [Validators.required, this.passwordMatcher.bind(this)]],
      role: new FormControl('')
    });
  }
  fileToUpload: File = null;
  ngOnInit(): void {

  } 
  
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }
  
  passwordMatcher(control: FormControl): { [s: string]: boolean } {
    if (
      this.dataform &&
      control.value !== this.dataform.get('password').value
    ) {
      return { passwordNotMatch: true };
    }
    return null;
  }
  onchange() {
    this.dataform.controls['confirmpassword'].setValue('');
  }
  submitEditUser(e, data: any){

    this.serviceuser.editUser(this.idUser, data).subscribe((data:any)=>{
      if(data==true)
      {
        alert("create user success")
      }
      else{
        this.message="email exist !";
      }
    })
    console.log(data)

  }

}
