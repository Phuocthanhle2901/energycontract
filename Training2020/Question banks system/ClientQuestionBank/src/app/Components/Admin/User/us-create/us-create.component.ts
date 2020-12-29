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
@Component({
  selector: 'app-us-create',
  templateUrl: './us-create.component.html',
  styleUrls: ['./us-create.component.scss']
})
export class UsCreateComponent implements OnInit {
  dataform: FormGroup;
  register = faDownload;
  message: string;
  passwordNotMatch: boolean;
  defaultValue = "Admin";


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

  submitAddUser(data: any){

    data['status']=true;
    this.serviceuser.createUser(data).subscribe((data:any)=>{
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
  onchange() {
    this.dataform.controls['confirmpassword'].setValue('');
  }

  // uploadFileToActivity() {
  //   this.postFile(this.fileToUpload).subscribe(data => {
  //     // do something, if upload success
  //     }, error => {
  //       console.log(error);
  //     });
  // }
  // postFile(fileToUpload: File): Observable<boolean> {
  //   const endpoint = 'your-destination-url';
  //   const formData: FormData = new FormData();
  //   formData.append('fileKey', fileToUpload, fileToUpload.name);

  //   console.log(formData);
  //   return this.http
  //     .post(endpoint, formData)
  //     .map(() => { return true; })
  //     .catch((e) => console.log(e));
  // }


}
